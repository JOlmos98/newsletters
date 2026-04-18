# Newsletter Digest - Agent Playbook

This repository is a daily newsletter pipeline for a static site published on GitHub Pages.
The operational flow now uses OpenClaw (Llama) + ChatGPT Web + Cursor in sequence.

## Objective

Process all incoming newsletters from email, transform each one into a final HTML `<article>` block, append all generated articles into `agent/articlesHtml.md`, then rebuild and publish the daily digest.  
`agent/articles.md` holds **only context** (section order and strict per-section newsletter order), not the HTML snippets.

## Source Of Truth Files

| File | Purpose |
|---|---|
| `agent/AGENTS.md` | This operational guide for the agent workflow |
| `gpt/prompt1CorreoToResumen.md` | Prompt 1: convert raw newsletter email into structured summary |
| `gpt/prompt2ResumenToArticle.md` | Prompt 2: convert structured summary into final HTML `<article>` |
| `agent/articles.md` | Context only: ordering rules and newsletter list (no `<article>` HTML here) |
| `agent/articlesHtml.md` | Staging file that accumulates many `<article>...</article>` blocks |
| `agent/htmlTemplate.md` | Base digest HTML template used to regenerate `index.html` |
| `agent/cursorPrompt.mdc` | Final Cursor execution instructions to archive, rebuild, order, and publish |
| `index.html` | Live page that will be regenerated and published |
| `old.html` + `old/*.html` | Historical archive pages |

## End-To-End Workflow (Required Order)

1. Read one newsletter email from inbox (raw content).
2. Open ChatGPT Web.
3. Paste `gpt/prompt1CorreoToResumen.md` and then paste the raw newsletter email in the same chat.
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
- Do not edit section ordering logic manually in `index.html`; ordering is enforced later by the Cursor prompt flow, using the order list in `agent/articles.md` as the single source of truth for sequencing.

## Digest Structure Constraints

Final article ordering in the published digest must follow this section order:

1. NOTICIAS GENERALES
2. DIVULGACIÓN
3. OPINIÓN
4. TECH

Within each section, the strict newsletter order is defined in `agent/articles.md` and must be respected by the final assembly step.

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
