# OpenClaw — Daily digest (newsletters)

Operational guide for the **OpenClaw** agent (**Qwen 3.5 cloud** model). The day’s digest runs in the fixed **14:00** Spain time window (**Europe/Madrid**). This document defines the exact step sequence.

---

## 0. Reference files in the repo

| Role | Path |
|------|------|
| Prompt 1 (email → structured summary) | `agent/prompt1CorreoToResumen.md` |
| Prompt 2 (summary → HTML block) | `gpt/prompt2ResumenToArticle.md` |
| Staging for `<article>...</article>` only | `agent/articlesHtml.md` |
| Final assembly, archive, commit, and push | `agent/cursorPrompt.mdc` |

**ChatGPT Web** has no `@file` references: you must **paste the full text** of each prompt from the repo (equivalent to `@gpt/...` in Cursor).

---

## 1. Gmail: frozen inventory

1. Open **Gmail**.
2. Find all **unread** newsletters that belong in the digest pipeline (same logic as `agent/context/articles.md`).
3. **Before** opening the per-email processing flow, build a **closed list** of everything to handle in **this** run.

### 1.1 Local checklist (immutable list)

4. Create or overwrite a file in the repo, for example:

   `agent/openClaw-digest-checklist.md`

   Suggested minimum content:

   - Date and time of the snapshot (Spain time).
   - One line per newsletter to process, with a Markdown **checkbox** (`- [ ] ...`) and a clear identifier (subject, sender, and/or thread id).
   - An explicit note: *“List closed at snapshot; emails that arrive later are not part of this digest.”*

5. **Freezing rule:** as soon as that file is written, the list is **immutable**. If **more** mail arrives in the inbox during steps 2–3, do **not** add it to this batch or process it until the **next** digest.

---

## 2. Process each checklist item (sequential order)

For **each** pending line (`- [ ]`), in the **same order** as the checklist:

### 2.1 ChatGPT — Prompt 1

1. Open **ChatGPT Web** (new conversation or a thread dedicated to the day’s digest).
2. Paste the **full** contents of `agent/prompt1CorreoToResumen.md`.
3. In the same message or immediately after, paste the newsletter **email body** (source text: message body as received; include useful metadata such as the original link if present in the email).
4. Send and wait for the structured output block (Title, Sender, Web link, Summary).

### 2.2 ChatGPT — Prompt 2

5. In the **same chat** (to keep summary context), paste the **full** contents of `gpt/prompt2ResumenToArticle.md`.
6. Send and wait for a **single** HTML `<article>...</article>` block.

### 2.3 Repo — `articlesHtml.md`

7. Copy **only** the complete `<article>...</article>` block.
8. **Append it** to the end of `agent/articlesHtml.md` (no loose summaries or markdown; article HTML only, consistent with `agent/context/AGENTS.md`).

### 2.4 Update the checklist

9. In `agent/openClaw-digest-checklist.md`, mark the corresponding line done: `- [x] ...`.
10. Move to the **next** `- [ ]` until none remain.

---

## 3. Closing: Cursor Agents (web)

When **all** entries in `agent/openClaw-digest-checklist.md` are `- [x]`:

1. Open the **Cursor** website → **Agents** (cloud agents).
2. Select the **`newsletters`** repository (this project).
3. Send **exactly** this instruction (English, so the agent runs it verbatim):

   ```text
   Execute @agent/cursorPrompt.mdc completely
   ```

4. Wait until the agent finishes the `cursorPrompt.mdc` flow (archive previous digest, rebuild `index.html`, commit and push to `main`, per that file).

---

## 4. Quick reminders

- **One digest = one frozen checklist.** Nothing that arrives after the snapshot goes into this run.
- Prompts live under `gpt/`; assembly and publication are defined **only** by `agent/cursorPrompt.mdc` via Cursor Agents at the end.
- Section and newsletter order on the final page: `agent/context/articles.md` (context); the Cursor step applies that order when building `index.html`.
