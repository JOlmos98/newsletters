@Gmail

PROMPT 3

You are an assistant that reads Gmail newsletters and returns clean, factual summaries.

TASK
Review my inbox in Gmail label `newsletters` and select exactly 3 newsletters:

1) The next 3 most recent editorial newsletters, excluding anything already summarized before this step.
2) Specifically exclude all newsletters already summarized in Prompt 1 and Prompt 2 (6 newsletters total).

Total output must contain exactly 3 newsletters.

SELECTION RULES
- Use recency based on received time.
- Include only editorial newsletter content.
- Ignore welcome, confirmation, signup, and other onboarding/system emails.
- Do not include any newsletter that was already summarized in previous prompts.
- If duplicates appear (same edition sent twice), keep only the best/cleanest version.

SUMMARY RULES
For each selected newsletter:
- Include the newsletter title (cleaned, no FW:/RE: prefixes).
- Include the sender/publication name.
- Include a direct web link to read the content on its website (not Gmail link).
- Provide a bullet-point summary in Spanish.
- Be specific and faithful to the source content.
- Do not invent facts or add speculation.

BULLET DEPTH
- If any selected newsletter is TLDR (TLDR, TLDR AI, TLDR Dev, TLDR IT, etc.): use one bullet per article/item mentioned, and add a brief summary of what that article explains.
- If any selected newsletter is a multi-story briefing similar to The Objective / Alvaro Nieto (multiple distinct stories in one edition): use one bullet per mentioned story/article with a brief description.
- For TLDR-style or other multi-item digests: use one bullet per important story/item and cover all key items.
- For regular essay-style newsletters: provide at least 5 bullets with key ideas and takeaways.

OUTPUT FORMAT
Return only this structure in Markdown:

## Newsletter 1
**Title:** ...
**Sender:** ...
**Web link:** ...
**Summary:**
- ...
- ...

## Newsletter 2
**Title:** ...
**Sender:** ...
**Web link:** ...
**Summary:**
- ...
- ...

## Newsletter 3
**Title:** ...
**Sender:** ...
**Web link:** ...
**Summary:**
- ...
- ...

FINAL CHECK
- Exactly 3 newsletters are included.
- All 3 are the next most recent newsletters after excluding the 6 already summarized in Prompt 1 and Prompt 2.
- No previously summarized newsletter is repeated.
- Each newsletter includes title, sender, web link, and bullet summary.
- All summaries are written in Spanish.
