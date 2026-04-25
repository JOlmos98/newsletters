# Codex step 2 - raw -> summary (checkpoint batch mode)

Goal: process raw newsletters from today's run in **checkpointed batches** and create **one summary file per raw file** using the strict format from `agent/prompt1CorreoToResumen.md`.

## Inputs and folders

- Base folder: `runs/`
- There will be only **one** dated folder inside `runs/` (for example `runs/2026-04-23/`).
- Raw inputs are in: `runs/YYYY-MM-DD/raw/`
- Summaries must be written to: `runs/YYYY-MM-DD/summary/`
- Progress checklist path: `runs/YYYY-MM-DD/summary/codex-checklist.md`

## Mandatory behavior

1. Detect the only dated folder under `runs/`.
2. Read every file in `runs/YYYY-MM-DD/raw/` with extension `.md`, sorted by filename (deterministic order).
3. Ensure `runs/YYYY-MM-DD/summary/codex-checklist.md` exists:
   - If it does not exist, create it and list every raw `.md` file as an unchecked item in deterministic order.
   - If it already exists, reuse it as the source of truth for pending/completed files.
4. In each execution, process **at most 4 pending newsletters** (unchecked items in the checklist), in checklist order.
5. For each processed raw file:
   - Apply `agent/prompt1CorreoToResumen.md` to that file content.
   - Generate exactly one output summary file in `runs/YYYY-MM-DD/summary/`.
   - Keep deterministic naming: if input is `raw/<name>.md`, output is `summary/<name>.md`.
   - Mark that file as completed (checked) in `codex-checklist.md` immediately after writing the summary.
6. Stop when 4 pending files were completed in this run, even if more pending files remain.
7. If fewer than 4 pending files exist, process all remaining pending files.
8. Never reprocess files already marked as completed in `codex-checklist.md`.
9. Do not write consolidated HTML in this step.

## Output contract

- In one execution, the number of new summary files can be from 1 to 4, depending on pending items.
- Across repeated executions, completed checklist items must eventually match all `.md` files in `raw/`.
- Each summary file must preserve the **exact** block structure required by `agent/prompt1CorreoToResumen.md`.
- Do not prepend or append operational text to summary files.
- Keep `codex-checklist.md` in sync with actual processed files.

## Out of scope for this step

- Do **not** run `agent/cursorPrompt.mdc` here.
- `scriptSummaryToArticle.js` will be executed in the next step, separately.