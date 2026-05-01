# Codex step 2 - raw -> summary (checkpoint batch mode)

Goal: process raw newsletters from today's run in **4 checkpointed tranches** and create **one summary file per raw file** using the strict format from `agent/prompt1CorreoToResumen.md`.

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
4. Compute deterministic tranche sizes from the total number of raw files `N`:
   - `base = floor(N / 4)`
   - Tranche 1 size = `base`
   - Tranche 2 size = `base`
   - Tranche 3 size = `base`
   - Tranche 4 size = `N - (3 * base)` (this tranche absorbs all remainder)
5. Determine progress from checked items in `codex-checklist.md` (`completed_count`).
6. In each execution, process **only one tranche** (never more), in checklist order:
   - If `completed_count < base`, process until `completed_count == base` (tranche 1).
   - Else if `completed_count < 2*base`, process until `completed_count == 2*base` (tranche 2).
   - Else if `completed_count < 3*base`, process until `completed_count == 3*base` (tranche 3).
   - Else process until `completed_count == N` (tranche 4).
7. If `N < 4` (so `base == 0`), tranches 1-3 are empty and tranche 4 processes all files.
8. For each processed raw file:
   - Apply `agent/prompt1CorreoToResumen.md` to that file content.
   - Generate exactly one output summary file in `runs/YYYY-MM-DD/summary/`.
   - Keep deterministic naming: if input is `raw/<name>.md`, output is `summary/<name>.md`.
   - Mark that file as completed (checked) in `codex-checklist.md` immediately after writing the summary.
9. Stop immediately when the active tranche target is reached, even if more pending files remain for later tranches.
10. Never reprocess files already marked as completed in `codex-checklist.md`.
11. Do not write consolidated HTML in this step.

## Output contract

- In one execution, the number of new summary files must be exactly the remaining size of the active tranche (can be 0 if that tranche is already complete).
- Across 4 repeated executions, completed checklist items must eventually match all `.md` files in `raw/`.
- Each summary file must preserve the **exact** block structure required by `agent/prompt1CorreoToResumen.md`.
- Do not prepend or append operational text to summary files.
- Keep `codex-checklist.md` in sync with actual processed files.

## Out of scope for this step

- Do **not** run `agent/cursorPrompt.mdc` here.
- `scriptSummaryToArticle.js` will be executed in the next step, separately.