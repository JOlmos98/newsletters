#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { google } = require("googleapis");

function printHelp() {
  console.log(`Uso:
  node scriptFetchNewsletters.js [opciones]

Opciones:
  --credentials <path>   JSON de credenciales OAuth de Google (obligatorio)
  --token <path>         JSON de token OAuth ya autorizado (obligatorio)
  --run-date <YYYY-MM-DD> Fecha de carpeta run (por defecto: hoy local)
  --hours <n>            Ventana de búsqueda en horas exactas (por defecto: 24)
  --max-results <n>      Máximo de mensajes por ejecución (por defecto: 100)
  --query <q>            Query Gmail adicional (por defecto: vacía)
  --output-dir <path>    Directorio base para runs (por defecto: ./runs)
  --help                 Muestra esta ayuda
`);
}

function parseArgs(argv) {
  const args = {
    credentials: null,
    token: null,
    runDate: localDateString(),
    hours: 24,
    maxResults: 100,
    query: "",
    outputDir: path.join(process.cwd(), "runs"),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--credentials") {
      args.credentials = argv[++i];
      continue;
    }
    if (arg === "--token") {
      args.token = argv[++i];
      continue;
    }
    if (arg === "--run-date") {
      args.runDate = argv[++i];
      continue;
    }
    if (arg === "--days") {
      throw new Error(
        "--days ya no está soportado. Usa --hours <n> (por ejemplo, --hours 24)."
      );
    }
    if (arg === "--hours") {
      args.hours = Number(argv[++i]);
      continue;
    }
    if (arg === "--max-results") {
      args.maxResults = Number(argv[++i]);
      continue;
    }
    if (arg === "--query") {
      args.query = String(argv[++i] || "").trim();
      continue;
    }
    if (arg === "--include-read") {
      throw new Error(
        "--include-read no está soportado en este flujo. Solo se procesan no leídos."
      );
    }
    if (arg === "--output-dir") {
      args.outputDir = argv[++i];
      continue;
    }

    throw new Error(`Argumento no reconocido: ${arg}`);
  }

  if (!args.credentials) {
    throw new Error("Falta --credentials <path>.");
  }
  if (!args.token) {
    throw new Error("Falta --token <path>.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.runDate)) {
    throw new Error("--run-date debe tener formato YYYY-MM-DD.");
  }
  if (!Number.isInteger(args.hours) || args.hours < 1) {
    throw new Error("--hours debe ser entero >= 1.");
  }
  if (!Number.isInteger(args.maxResults) || args.maxResults < 1) {
    throw new Error("--max-results debe ser entero >= 1.");
  }

  return args;
}

function localDateString() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function decodeBase64Url(value) {
  if (!value) return "";
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|li|tr|h\d|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function extractHeaderValue(headers, name) {
  const wanted = String(name || "").toLowerCase();
  const hit = (headers || []).find((h) => String(h.name || "").toLowerCase() === wanted);
  return hit ? String(hit.value || "").trim() : "";
}

function findPartByMime(payload, mimeType) {
  if (!payload) return null;
  if (payload.mimeType === mimeType && payload.body && payload.body.data) {
    return payload.body.data;
  }
  for (const part of payload.parts || []) {
    const found = findPartByMime(part, mimeType);
    if (found) return found;
  }
  return null;
}

function extractBody(payload) {
  const textPlainData = findPartByMime(payload, "text/plain");
  if (textPlainData) {
    return decodeBase64Url(textPlainData).trim();
  }

  const textHtmlData = findPartByMime(payload, "text/html");
  if (textHtmlData) {
    return stripHtml(decodeBase64Url(textHtmlData));
  }

  if (payload && payload.body && payload.body.data) {
    return stripHtml(decodeBase64Url(payload.body.data));
  }

  return "";
}

function sanitizeFileName(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 180);
}

function buildMessageTimestamp(data, dateHeader) {
  const internalDateMs = Number(data && data.internalDate);
  const pad2 = (value) => String(value).padStart(2, "0");
  const formatDateForFile = (date) =>
    [
      date.getFullYear(),
      "-",
      pad2(date.getMonth() + 1),
      "-",
      pad2(date.getDate()),
      "_",
      pad2(date.getHours()),
      "-",
      pad2(date.getMinutes()),
      "-",
      pad2(date.getSeconds()),
    ].join("");

  if (Number.isFinite(internalDateMs) && internalDateMs > 0) {
    return formatDateForFile(new Date(internalDateMs));
  }

  const parsedDateMs = Date.parse(String(dateHeader || "").trim());
  if (Number.isFinite(parsedDateMs) && parsedDateMs > 0) {
    return formatDateForFile(new Date(parsedDateMs));
  }

  return formatDateForFile(new Date());
}

function extractEmailDomain(fromHeader) {
  const match = String(fromHeader || "").match(/<([^>]+)>/);
  const email = (match ? match[1] : fromHeader).trim().toLowerCase();
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 0) return "";
  return email.slice(atIndex + 1).replace(/[^a-z0-9.-]/g, "");
}

function ensureRunDirectories(baseOutputDir, runDate) {
  const runDir = path.resolve(baseOutputDir, runDate);
  const rawDir = path.join(runDir, "raw");
  const summaryDir = path.join(runDir, "summary");
  const manifestPath = path.join(runDir, "manifest.jsonl");

  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(summaryDir, { recursive: true });
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, "", "utf8");
  }

  return { runDir, rawDir, summaryDir, manifestPath };
}

function readManifestById(manifestPath) {
  const byId = new Map();
  if (!fs.existsSync(manifestPath)) return byId;

  const lines = fs
    .readFileSync(manifestPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry && entry.messageId) {
        byId.set(String(entry.messageId), entry);
      }
    } catch {
      // Si hay una línea corrupta, no detenemos la ingesta.
    }
  }

  return byId;
}

function appendManifest(manifestPath, entry) {
  fs.appendFileSync(manifestPath, `${JSON.stringify(entry)}${os.EOL}`, "utf8");
}

function buildRawContent(metadata, bodyText) {
  return [
    `# Newsletter raw`,
    ``,
    `- messageId: ${metadata.messageId}`,
    `- threadId: ${metadata.threadId || "Not provided"}`,
    `- internalDate: ${metadata.internalDate || "Not provided"}`,
    `- dateHeader: ${metadata.dateHeader || "Not provided"}`,
    `- from: ${metadata.from || "Not provided"}`,
    `- subject: ${metadata.subject || "Not provided"}`,
    ``,
    `---`,
    ``,
    bodyText || "Not provided",
    ``,
  ].join("\n");
}

async function buildGmailClient(credentialsPath, tokenPath) {
  const credentialsRaw = fs.readFileSync(path.resolve(credentialsPath), "utf8");
  const tokenRaw = fs.readFileSync(path.resolve(tokenPath), "utf8");

  const credentials = JSON.parse(credentialsRaw);
  const token = JSON.parse(tokenRaw);

  const clientConfig = credentials.installed || credentials.web;
  if (!clientConfig) {
    throw new Error("Credenciales OAuth inválidas: falta 'installed' o 'web'.");
  }

  const auth = new google.auth.OAuth2(
    clientConfig.client_id,
    clientConfig.client_secret,
    Array.isArray(clientConfig.redirect_uris) ? clientConfig.redirect_uris[0] : undefined
  );
  auth.setCredentials(token);

  return google.gmail({ version: "v1", auth });
}

function buildGmailQuery(args) {
  const afterUnixSeconds = Math.floor(
    (Date.now() - args.hours * 60 * 60 * 1000) / 1000
  );
  const timeClause = `after:${afterUnixSeconds}`;
  const unreadClause = "is:unread";
  const newsletterLabelClause = "label:newsletters";
  const extraQuery = String(args.query || "").trim();
  return [newsletterLabelClause, unreadClause, timeClause, extraQuery]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function buildManifestBaseEntry({
  runDate,
  messageId,
  threadId,
  internalDate,
  from,
  subject,
  dateHeader,
  senderDomain,
  rawPath,
}) {
  return {
    runDate,
    messageId,
    threadId,
    internalDate,
    senderDomain,
    from,
    subject,
    dateHeader,
    rawPath,
    summaryPath: null,
    status: "fetched",
    fetchedAt: new Date().toISOString(),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { rawDir, manifestPath } = ensureRunDirectories(args.outputDir, args.runDate);
  const manifestById = readManifestById(manifestPath);

  const gmail = await buildGmailClient(args.credentials, args.token);
  const query = buildGmailQuery(args);

  let totalFetched = 0;
  let skippedAlreadyInManifest = 0;
  let failed = 0;
  const processedMessageIds = [];
  let pageToken = undefined;
  let exhausted = false;

  while (!exhausted && totalFetched < args.maxResults) {
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: Math.min(100, args.maxResults),
      pageToken,
    });

    const listedMessages = listResponse.data.messages || [];
    pageToken = listResponse.data.nextPageToken || undefined;
    if (listedMessages.length === 0 && !pageToken) {
      exhausted = true;
      break;
    }

    for (const messageRef of listedMessages) {
      if (totalFetched >= args.maxResults) {
        break;
      }

      const messageId = String(messageRef.id || "").trim();
      if (!messageId) continue;

      if (manifestById.has(messageId)) {
        skippedAlreadyInManifest += 1;
        continue;
      }

      try {
        const messageResponse = await gmail.users.messages.get({
          userId: "me",
          id: messageId,
          format: "full",
        });

        const data = messageResponse.data || {};
        const payload = data.payload || {};
        const headers = payload.headers || [];
        const from = extractHeaderValue(headers, "From");
        const subject = extractHeaderValue(headers, "Subject");
        const dateHeader = extractHeaderValue(headers, "Date");
        const senderDomain = extractEmailDomain(from);

        const bodyText = extractBody(payload);
        const messageTimestamp = buildMessageTimestamp(data, dateHeader);
        const safeId = sanitizeFileName(messageId) || `msg_${Date.now()}`;
        const rawFileName = `${messageTimestamp}_${safeId}.md`;
        const rawPath = path.join(rawDir, rawFileName);

        const metadata = {
          messageId,
          threadId: String(data.threadId || ""),
          internalDate: data.internalDate
            ? new Date(Number(data.internalDate)).toISOString()
            : "",
          from,
          subject,
          dateHeader,
        };

        fs.writeFileSync(rawPath, buildRawContent(metadata, bodyText), "utf8");

        const entry = buildManifestBaseEntry({
          runDate: args.runDate,
          messageId,
          threadId: metadata.threadId,
          internalDate: metadata.internalDate,
          from,
          subject,
          dateHeader,
          senderDomain,
          rawPath: path.relative(process.cwd(), rawPath).replace(/\\/g, "/"),
        });

        appendManifest(manifestPath, entry);
        manifestById.set(messageId, entry);
        totalFetched += 1;
        processedMessageIds.push(messageId);

      } catch (error) {
        failed += 1;
        const failureEntry = {
          runDate: args.runDate,
          messageId,
          status: "error",
          phase: "fetch",
          error: String(error && error.message ? error.message : error),
          failedAt: new Date().toISOString(),
        };
        appendManifest(manifestPath, failureEntry);
      }
    }

    if (!pageToken) {
      exhausted = true;
    }
  }

  console.log("Fetch completado.");
  console.log(`- query: ${query}`);
  console.log(`- run: runs/${args.runDate}`);
  console.log(`- fetched: ${totalFetched}`);
  console.log(`- skipped_in_manifest: ${skippedAlreadyInManifest}`);
  console.log(`- failed: ${failed}`);
  if (processedMessageIds.length > 0) {
    console.log(`- message_ids: ${processedMessageIds.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
