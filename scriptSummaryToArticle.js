#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {
    input: null,
    output: path.join(process.cwd(), "agent", "articlesHtml.md"),
    runsDir: path.join(process.cwd(), "runs"),
    summaryDir: null,
    stdout: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "-i" || arg === "--input") {
      args.input = argv[++i];
      continue;
    }

    if (arg === "-o" || arg === "--output") {
      args.output = argv[++i];
      continue;
    }

    if (arg === "--runs-dir") {
      args.runsDir = argv[++i];
      continue;
    }

    if (arg === "--summary-dir") {
      args.summaryDir = argv[++i];
      continue;
    }

    if (arg === "--no-stdout") {
      args.stdout = false;
      continue;
    }

    if (!arg.startsWith("-") && !args.input) {
      args.input = arg;
    }
  }

  return args;
}

function readInput(inputPath) {
  if (inputPath) {
    return fs.readFileSync(path.resolve(inputPath), "utf8");
  }

  if (!process.stdin.isTTY) {
    return fs.readFileSync(0, "utf8");
  }

  throw new Error(
    "No input provided. Usa: node scripts/summaryToArticle.js resumen.md"
  );
}

function resolveSummaryFiles(args) {
  if (args.input) {
    return [path.resolve(args.input)];
  }

  if (args.summaryDir) {
    const explicitSummaryDir = path.resolve(args.summaryDir);
    if (!fs.existsSync(explicitSummaryDir)) {
      throw new Error(
        `Summary directory not found: ${explicitSummaryDir}.`
      );
    }

    if (!fs.statSync(explicitSummaryDir).isDirectory()) {
      throw new Error(
        `Summary directory path is not a directory: ${explicitSummaryDir}.`
      );
    }

    return fs
      .readdirSync(explicitSummaryDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
      .map((entry) => path.join(explicitSummaryDir, entry.name))
      .sort((a, b) => a.localeCompare(b));
  }

  const runsDir = path.resolve(args.runsDir);
  if (!fs.existsSync(runsDir) || !fs.statSync(runsDir).isDirectory()) {
    throw new Error(`Runs directory not found: ${runsDir}.`);
  }

  const dayDirs = fs
    .readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (dayDirs.length === 0) {
    throw new Error(`No day folder found inside runs directory: ${runsDir}.`);
  }

  if (dayDirs.length > 1) {
    throw new Error(
      `Expected exactly one day folder inside runs directory (${runsDir}), found ${dayDirs.length}: ${dayDirs.join(
        ", "
      )}.`
    );
  }

  const summaryDir = path.join(runsDir, dayDirs[0], "summary");
  if (!fs.existsSync(summaryDir) || !fs.statSync(summaryDir).isDirectory()) {
    throw new Error(`Summary directory not found: ${summaryDir}.`);
  }

  return fs
    .readdirSync(summaryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => path.join(summaryDir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function stripOuterCodeFences(text) {
  const trimmed = String(text).replace(/^\uFEFF/, "").trim();

  const match = trimmed.match(/^```(?:md|markdown)?\s*\n([\s\S]*?)\n```$/i);
  return match ? match[1].trim() : trimmed;
}

function cleanDisplayText(text) {
  let value = String(text || "").trim();

  while (/^(fw|fwd|re|rv)\s*:/i.test(value)) {
    value = value.replace(/^(fw|fwd|re|rv)\s*:\s*/i, "").trim();
  }

  // Quita emojis y algunos símbolos decorativos habituales.
  value = value
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/[•·◆■▶►⭐✨🔥✅❌⚠️☑️✔️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  return value || "Not provided";
}

function normalizeOriginalTitleLanguage(value) {
  const normalized = String(value || "unknown").trim().toLowerCase();
  const allowed = new Set(["es", "en", "other", "unknown"]);

  if (!allowed.has(normalized)) {
    throw new Error(
      `Invalid 'Original title language': '${value}'. Expected one of: es, en, other, unknown.`
    );
  }

  return normalized;
}

function slugify(text) {
  const base =
    text && !/^not provided$/i.test(text) ? cleanDisplayText(text) : "newsletter";

  return (
    base
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "newsletter"
  );
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInlineText(text) {
  let html = escapeHtml(text);

  // Markdown links inline -> solo deja el texto visible.
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1");

  // Negrita markdown.
  html = html.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");

  // Cursiva markdown con *...* o _..._
  html = html.replace(
    /(^|[\s(])\*([^*\n]+?)\*(?=[$\s).,;:!?])/gm,
    "$1<em>$2</em>"
  );
  html = html.replace(
    /(^|[\s(])_([^_\n]+?)_(?=[$\s).,;:!?])/gm,
    "$1<em>$2</em>"
  );

  return html;
}

function normalizeUrl(rawUrl) {
  const value = String(rawUrl || "").trim();

  if (!value || /^not provided$/i.test(value)) {
    return null;
  }

  const markdownMatch = value.match(/^\[(.*?)\]\((https?:\/\/[^)]+)\)$/i);
  if (markdownMatch) {
    return normalizeUrl(markdownMatch[2]);
  }

  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function parseStructuredSummary(rawText) {
  const text = stripOuterCodeFences(rawText).replace(/\r\n/g, "\n");

  const lines = text.split("\n");
  const fields = {};
  const validHeaders = new Set([
    "Original title",
    "Original title language",
    "Digest title",
    "Sender",
    "Web link",
    "Mode",
    "Summary format",
    "Summary",
  ]);

  let summaryStartIndex = -1;
  let summaryInlineValue = "";
  let foundAnyHeader = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();

    const match = line.match(
      /^\*\*(Original title language|Original title|Digest title|Sender|Web link|Mode|Summary format|Summary):\*\*\s*(.*)$/i
    );

    if (!match) {
      if (!foundAnyHeader) {
        continue;
      }
      continue;
    }

    const header = match[1];
    const value = match[2] || "";

    if (!validHeaders.has(header)) {
      continue;
    }

    foundAnyHeader = true;

    if (header === "Summary") {
      summaryStartIndex = i;
      summaryInlineValue = value;
      break;
    }

    fields[header] = value.trim();
  }

  if (summaryStartIndex === -1) {
    throw new Error("Could not find '**Summary:**' in the input.");
  }

  const summaryBody = [
    summaryInlineValue,
    ...lines.slice(summaryStartIndex + 1),
  ]
    .join("\n")
    .trim();

  return {
    originalTitle: cleanDisplayText(fields["Original title"] || "Not provided"),
    originalTitleLanguage: normalizeOriginalTitleLanguage(
      fields["Original title language"] || "unknown"
    ),
    digestTitle: cleanDisplayText(fields["Digest title"] || "Not provided"),
    sender: cleanDisplayText(fields["Sender"] || "Not provided"),
    webLink: (fields["Web link"] || "Not provided").trim(),
    mode:
      String(fields["Mode"] || "summary").trim().toLowerCase() === "verbatim"
        ? "verbatim"
        : "summary",
    summaryFormat:
      String(fields["Summary format"] || "bullets").trim().toLowerCase() ===
      "paragraphs"
        ? "paragraphs"
        : "bullets",
    summary: summaryBody,
  };
}

function extractBulletItems(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const items = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (/^[-*]\s+/.test(trimmed)) {
      if (current !== null) {
        items.push(current.trim());
      }
      current = trimmed.replace(/^[-*]\s+/, "").trim();
      continue;
    }

    if (current !== null) {
      if (trimmed === "") {
        current += "\n";
      } else if (current.endsWith("\n")) {
        current += trimmed;
      } else {
        current += ` ${trimmed}`;
      }
    }
  }

  if (current !== null) {
    items.push(current.trim());
  }

  return items
    .map((item) => item.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function extractParagraphs(text) {
  return String(text || "")
    .trim()
    .split(/\n\s*\n+/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
        .trim()
    )
    .filter(Boolean);
}

function parseLabeledBullet(item) {
  const match = item.match(/^\*\*(.+?)\:\*\*\s*(.+)$/);

  if (!match) {
    return {
      label: null,
      text: item.trim(),
    };
  }

  return {
    label: match[1].trim(),
    text: match[2].trim(),
  };
}

function renderBulletList(data) {
  const items = extractBulletItems(data.summary);

  if (items.length === 0) {
    return renderParagraphBlocks(data.summary);
  }

  const isTLDR = /\btldr\b/i.test(data.sender);

  const htmlItems = items.map((item) => {
    const { label, text } = parseLabeledBullet(item);

    if (!label) {
      return `    <li>${formatInlineText(text)}</li>`;
    }

    let finalLabel = label;
    let finalText = text;

    // Caso TLDR:
    // **Título traducido (Original title):** resumen
    // =>
    // <strong>Título traducido:</strong> (Original title) resumen
    if (isTLDR) {
      const tldrMatch = label.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
      if (tldrMatch) {
        finalLabel = tldrMatch[1].trim();
        finalText = `(${tldrMatch[2].trim()}) ${text}`.trim();
      }
    }

    return `    <li><strong>${formatInlineText(finalLabel)}:</strong> ${formatInlineText(finalText)}</li>`;
  });

  return ["  <ul>", ...htmlItems, "  </ul>"].join("\n");
}

function renderParagraphBlocks(text) {
  const paragraphs = extractParagraphs(text);

  if (paragraphs.length === 0) {
    return "  <p></p>";
  }

  return paragraphs
    .map((paragraph) => `  <p>${formatInlineText(paragraph)}</p>`)
    .join("\n");
}

function shouldIncludeOriginalTitle(originalTitle, originalTitleLanguage) {
  if (!originalTitle || /^not provided$/i.test(originalTitle)) {
    return false;
  }

  return originalTitleLanguage !== "es";
}

function renderArticle(data) {
  const senderForId =
    !/^not provided$/i.test(data.sender) ? data.sender : data.digestTitle;

  const articleId = slugify(senderForId);
  const senderText = escapeHtml(data.sender);
  const h3Text = escapeHtml(
    !/^not provided$/i.test(data.digestTitle)
      ? data.digestTitle
      : data.originalTitle
  );

  const originalTitleLine = shouldIncludeOriginalTitle(
    data.originalTitle,
    data.originalTitleLanguage
  )
    ? `\n  <p class="newsletter-original-title">${escapeHtml(data.originalTitle)}</p>`
    : "";

  const summaryHtml =
    data.summaryFormat === "paragraphs"
      ? renderParagraphBlocks(data.summary)
      : renderBulletList(data);

  const normalizedUrl = normalizeUrl(data.webLink);
  const linkHtml = normalizedUrl
    ? `\n  <p><a href="${escapeHtml(normalizedUrl)}" target="_blank" rel="noreferrer">Link</a></p>`
    : "";

  return `<article id="${escapeHtml(articleId)}" class="card">
  <p class="newsletter-sender">${senderText}</p>
  <h3>${h3Text}</h3>${originalTitleLine}
${summaryHtml}${linkHtml}
</article>`;
}

function appendArticle(outputPath, articleHtml) {
  const absoluteOutputPath = path.resolve(outputPath);
  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });

  let prefix = "";
  if (fs.existsSync(absoluteOutputPath)) {
    const current = fs.readFileSync(absoluteOutputPath, "utf8");
    if (current.length > 0) {
      prefix = current.endsWith("\n\n")
        ? ""
        : current.endsWith("\n")
        ? "\n"
        : "\n\n";
    }
  }

  fs.appendFileSync(absoluteOutputPath, `${prefix}${articleHtml}\n`, "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const summaryFiles = resolveSummaryFiles(args);
  let processedCount = 0;
  let failedCount = 0;

  if (summaryFiles.length === 0) {
    throw new Error("No .md summary files were found to process.");
  }

  for (const summaryFile of summaryFiles) {
    try {
      const rawInput = args.input
        ? readInput(summaryFile)
        : fs.readFileSync(summaryFile, "utf8");
      const parsed = parseStructuredSummary(rawInput);
      const articleHtml = renderArticle(parsed);

      appendArticle(args.output, articleHtml);
      processedCount += 1;

      if (args.stdout) {
        process.stdout.write(`${articleHtml}\n`);
      }
    } catch (error) {
      failedCount += 1;
      console.error(
        `Skipping file due to parse/render error: ${summaryFile}. ${error.message}`
      );
    }
  }

  if (failedCount > 0) {
    console.error(
      `Finished with partial success: ${processedCount} processed, ${failedCount} failed.`
    );
    return;
  }

  console.error(`Finished successfully: ${processedCount} processed, 0 failed.`);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}