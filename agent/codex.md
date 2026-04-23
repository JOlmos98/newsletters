# Codex step 2 - raw -> summary (batch mode)

Goal: process **all** raw newsletters from today's run and create **one summary file per raw file** using the strict format from `agent/prompt1CorreoToResumen.md`.

## Inputs and folders

- Base folder: `runs/`
- There will be only **one** dated folder inside `runs/` (for example `runs/2026-04-23/`).
- Raw inputs are in: `runs/YYYY-MM-DD/raw/`
- Summaries must be written to: `runs/YYYY-MM-DD/summary/`

## Mandatory behavior

1. Detect the only dated folder under `runs/`.
2. Read every file in `runs/YYYY-MM-DD/raw/` with extension `.md`.
3. For each raw file:
   - Apply `agent/prompt1CorreoToResumen.md` to that file content.
   - Generate exactly one output summary file in `runs/YYYY-MM-DD/summary/`.
   - Keep deterministic naming: if input is `raw/<name>.md`, output is `summary/<name>.md`.
4. Process all files (no early stop after first success).
5. Do not write consolidated HTML in this step.

## Output contract

- Number of files in `summary/` must match number of `.md` files in `raw/`.
- Each summary file must preserve the **exact** block structure required by `agent/prompt1CorreoToResumen.md`.
- Do not prepend or append operational text to summary files.

## Out of scope for this step

- Do **not** run `agent/cursorPrompt.mdc` here.
- `scriptSummaryToArticle.js` will be executed in the next step, separately.