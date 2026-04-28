# Newsletter Digest - Agent Playbook

This repository is a daily newsletter pipeline for a static site published on GitHub Pages.

**Daily digest:** run by **OpenClaw** with the **Qwen 3.5 (cloud)** model. Generation/publication of the day’s digest is fixed **always** at **14:00** Spain time (**Europe/Madrid**, Madrid reference).

The operational flow combines that automated step with **ChatGPT Web** and **Cursor** as needed (summaries, HTML, assembly, and commit), in the order described below.

## Objective

Process all incoming newsletters from email, transform each one into a final HTML `<article>` block, append all generated articles into `agent/articlesHtml.md`, then rebuild and publish the daily digest.  
`agent/context/articles.md` holds **only context** (section order and strict per-section newsletter order), not the HTML snippets.

## Source Of Truth Files

| File | Purpose |
|---|---|
| `agent/openClaw.md` | Concrete steps for OpenClaw: Gmail → frozen checklist → ChatGPT → `articlesHtml.md` → Cursor Agents |
| `agent/context/AGENTS.md` | This operational guide for the agent workflow |
| `agent/prompt1CorreoToResumen.md` | Prompt 1: convert raw newsletter email into structured summary |
| `gpt/prompt2ResumenToArticle.md` | Prompt 2: convert structured summary into final HTML `<article>` |
| `agent/context/articles.md` | Context only: ordering rules and newsletter list (no `<article>` HTML here) |
| `agent/articlesHtml.md` | Staging file that accumulates many `<article>...</article>` blocks |
| `agent/context/htmlTemplate.md` | Base digest HTML template used to regenerate `index.html` |
| `agent/cursorPrompt.mdc` | Final Cursor execution instructions to archive, rebuild, order, and publish |
| `index.html` | Live page that will be regenerated and published |
| `old.html` + `old/*.html` | Historical archive pages |

## End-To-End Workflow (Required Order)

> **Schedule:** the day’s digest must be produced in the daily **14:00 (Spain/Madrid)** cycle with OpenClaw (Qwen 3.5 cloud); the remaining steps fit in that same cycle.

1. Read one newsletter email from inbox (raw content).
2. Open ChatGPT Web.
3. Paste `agent/prompt1CorreoToResumen.md` and then paste the raw newsletter email in the same chat.
4. Wait for the structured summary output.
5. In the same chat, paste `gpt/prompt2ResumenToArticle.md`.
6. Get the final HTML output and extract only the complete `<article>...</article>` block.
7. Append that `<article>` block at the end of `agent/articlesHtml.md`.
8. Repeat steps 1-7 for the next newsletter until all target newsletters are processed.
9. After all articles are ready in `agent/articlesHtml.md`, instruct Cursor to execute `agent/cursorPrompt.mdc`.
10. Ensure the resulting commit is pushed to `main`.

## Strict Rules For Article Collection

- `agent/articlesHtml.md` must contain only article snippets in final HTML format plus its short header/comment if present.
- Never paste summaries, analysis text, markdown bullets, or explanations into `agent/articlesHtml.md`.
- Every inserted block must be a complete `<article>...</article>` element.
- Append new articles at the bottom; do not reorder manually there.
- Do not edit section ordering logic manually in `index.html`; ordering is enforced later by the Cursor prompt flow, using the order list in `agent/context/articles.md` as the single source of truth for sequencing.
- Preserve concrete links in the final output for these multi-story newsletters exactly: 1440, The Objective, The Substack Post, TLDR, Superhuman, and HackerNoon.
- For those newsletters, keep each item's specific URL and avoid collapsing to only a generic homepage URL; when the article body uses `<li>`, place the respective `Link` inside each corresponding list item.

## Digest Structure Constraints

Final article ordering in the published digest must follow this section order:

1. NOTICIAS GENERALES
2. DIVULGACIÓN
3. OPINIÓN
4. TECH

Within each section, the strict newsletter order is defined in `agent/context/articles.md` and must be respected by the final assembly step.

## Publication Checklist

Before pushing:

- `agent/articlesHtml.md` includes all new `<article>` blocks for the day.
- `agent/cursorPrompt.mdc` execution has been completed.
- `index.html` was rebuilt with updated date and index.
- Current previous digest was archived into `old/` and linked from `old.html`.

Then publish:

```bash
git add .
git commit -m "Digest YYYY-MM-DD"
git push origin main
```

Use today's date in the commit message.
