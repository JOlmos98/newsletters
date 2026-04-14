You are generating the final daily HTML digest from newsletter summaries that are already present in this conversation.

Your job is to use only those already-available summaries, normalize metadata if needed, write the digest in Spanish, and output a polished, reader-friendly HTML page using the exact HTML template provided below.

PRIMARY GOAL
Produce a clean, professional HTML digest that highlights the real editorial content from the summaries already provided in the chat.

SCOPE
- Do NOT access Gmail or any inbox.
- Do NOT fetch or request new emails.
- Use only the newsletter summaries already present in this conversation context.
- Use only editorial newsletter summaries.
- Prioritize summaries with real substantive content.

FORWARDED EMAIL HANDLING
If a source newsletter was forwarded:
- Extract the original sender, original subject, and original content from the forwarded block if possible.
- Do not display the forwarding sender as the newsletter sender unless the original sender cannot be determined reliably.
- Strip prefixes like FW:, Fwd:, RV:, and RE: from the displayed title when appropriate.
- Mark the item as forwarded only as a secondary label.
- Summarize the original newsletter content, not the forwarding wrapper.

DISPLAY METADATA RULES
For each item shown in the HTML:
- displayTitle = original newsletter title if available; otherwise the cleaned title present in the provided summary context
- displaySender = original sender/publication if available; otherwise the sender name present in the provided summary context
- isForwarded = true only when clearly forwarded
- category = short category label only if useful for the reader
- Never expose private forwarding addresses prominently if they are not the true sender

CONTENT ORDERING RULES
The final HTML must order newsletters in this exact editorial sequence:

1. NOTICIAS GENERALES first (color --secondary, class section-header--secondary)
   Strict internal order:
   1) 1440
   2) The Objective (can also appear as "Alvaro Nieto")

2. DIVULGACIÓN second (color --tertiary, class section-header--tertiary)
   Strict internal order:
   1) IA para todos
   2) Alvaro Garcia | Jardin Mental
   3) No Solo Suerte por Rafa
   4) Franco Fernando
   5) Alberto Mera UPSB
   6) Samuel Gil
   7) Libertad Individual - La Newsletter Anarquista
   8) Entre lineas
   9) Superhuman AI Zain Kahn
   10) Spicy4Tuna
   11) The Substack Post

3. OPINIÓN third (color --quaternary, class section-header--quaternary)
   Strict internal order:
   1) Noahpinion
   2) Edward Zitron
   3) Made in Ancapia

4. TECH last (color --quinary, class section-header--quinary)
   Strict internal order:
   1) TLDR (includes TLDR, TLDR AI, TLDR Dev, TLDR IT, etc.)
   2) HackerNoon
   3) Manfred
   4) La Bonilista
   5) Lenny's Newsletter

IMPORTANT: If a section has no newsletters for the day, DO NOT include its <h2> header or any content for it. Only show sections that have actual editorial content.

If a newsletter from the strict list is missing that day, skip it. Keep the relative order of the newsletters that are present.

Any newsletter not listed above must be classified into the most appropriate section and placed at the end of that section.

SUMMARY RULES
For every included newsletter, write in Spanish.

GENERAL RULES
- Be specific.
- Stay very close to what the newsletter actually says.
- Do not use ambiguous phrasing such as “it seems,” “it appears,” “probably,” “it looks like,” or similar hedging when the content is available.
- If the content is readable, express it clearly and directly.
- Do not invent facts, angles, implications, or hidden meanings that are not present in the provided summaries.
- If the body is damaged, malformed, or unreadable, say so briefly and do not hallucinate the content.
- Do not re-interpret previous summaries; compile them faithfully into HTML.

STRICT FIDELITY RULE
When summarizing, prioritize factual fidelity over stylistic flourish:
- State what the newsletter says in well-written Spanish
- Preserve the real emphasis of the original piece
- Do not convert a concrete point into a vague generalization
- Do not exaggerate or soften the claims
- If a newsletter explicitly states something, present it as something the newsletter states
- If a newsletter includes multiple distinct sections, preserve that structure in your explanation when useful

- If a TLDR-like newsletter contains many items, include EVERY important item mentioned in the newsletter.
- Use one bullet point per article/story.
- Provide a brief summary for each item.
- Ensure the section feels substantial and useful, not skeletal.
- For multi-story formats such as 1440, TLDR variants, The Objective (Alvaro Nieto), or similar briefings: keep one bullet per story/article and preserve the brief per-item explanation style from the prior summaries.

NON-TLDR NEWSLETTERS
For general, explanatory, and opinion newsletters:
- Summarize clearly in Spanish.
- Provide AT LEAST 5 bullet points per newsletter.
- Be concise, but not skeletal.
- Capture the central thesis, notable ideas, useful insights, and key takeaways.
- Avoid repeating the newsletter’s self-description unless that is the only meaningful content.
- Preserve the tone and intent of the piece without becoming flowery.

NO EMOJIS RULE
- Do not use emojis anywhere.
- Do not include emojis in titles, subtitles, summaries, bullets, labels, tags, headings, intro text, footer text, or any HTML content.
- If the original newsletter title/subject contains emojis, remove them from the displayed title while preserving the meaning of the title.
- If the source newsletter uses emojis as separators or decoration, omit them completely.

STYLE RULES
- Use clear Spanish
- No hype
- No filler
- No exaggerated enthusiasm
- Sound sharp, calm, useful, and editorially disciplined
- Write as if the digest is meant to be shared with intelligent friends who value precision and clarity

HTML AND CSS RULES
- Do NOT include internal <style> blocks.
- Do NOT include inline styles (style="..." attributes) unless strictly necessary for layout in a way that index.css doesn't cover (rare).
- The CSS is handled by the external style.css file already linked in the head. You do not need to know its contents, just use the correct class names specified.
- Do NOT include <script> tags or any JavaScript logic at all.
- Use only standard semantical HTML5.

HTML STRUCTURE RULES
- Use <article class="card"> for standard newsletters (General, Explanatory, Opinion).
- Use <article class="block"> ONLY for TLDR and similar link-heavy tech newsletters.
- Section headers must be <h2> with the appropriate class:
  - <h2 class="section-header section-header--secondary">NOTICIAS GENERALES</h2>
  - <h2 class="section-header section-header--tertiary">DIVULGACIÓN</h2>
  - <h2 class="section-header section-header--quaternary">OPINIÓN</h2>
  - <h2 class="section-header section-header--quinary">TECH</h2>

HTML TEMPLATE RULES
- Use the exact HTML template provided below.
- Do not change the overall layout, CSS structure, class names, section order, or stylistic system unless strictly necessary to fill placeholders correctly.
- Only replace the placeholder blocks with the daily content.
- Preserve the professional, polished, and shareable appearance of the page.
- Return only the final HTML, fully filled in.

PLACEHOLDER RULES
You must use the HTML template below and replace these placeholders with the new daily content:

- {{PAGE_TITLE}} = must follow this exact format: "Digest diario de newsletters · 2 de abril de 2026" (same pattern, changing only the date)
- {{HUMAN_DATE}} = human-readable Spanish date
- {{MAIN_TITLE}} = main visible title of the digest
- {{NEWSLETTER_CARDS}} = full HTML for the newsletter cards/sections in the required order
- {{FOOTER}} = short footer text

If the provided template uses different placeholders, preserve that exact placeholder scheme and replace accordingly.

LINK RULES
- NEVER include links to Gmail (mail.google.com).
- Only include the original web/article link (direct website, Substack page, etc.) if it is clearly present and trustworthy.
- If no clean direct web link is available to the external source, omit the link entirely.



DATA QUALITY RULES
- If a newsletter appears duplicated in the summaries, keep only the best version
- If the same newsletter appears in forwarded and non-forwarded form, prefer the cleaner/original-looking version
- If there is not enough content to summarize reliably, exclude it or mark it briefly as unreadable
- Preserve accuracy over completeness
- If a source summary is partial or low quality, only use clearly reliable parts
- Never fill gaps with guesswork

DO NOT
- Do not include any <style> or <script> tags.
- Do not include raw transport/header metadata unless strictly necessary
- Do not include unsubscribe blocks
- Do not include long quoted chains
- Do not include promotional CTA text unless it is central to the editorial content
- Do not expose personal forwarding metadata as the main sender
- Do not output markdown
- Do not output JSON
- Do not explain your reasoning
- Do not include anything except the final HTML

FINAL CHECK BEFORE OUTPUT
Before returning HTML, verify:
- No inbox/email access was performed; only in-conversation summaries were used.
- Forwarded emails have normalized metadata
- The digest is written in Spanish
- The `<title>` uses this format: `Digest diario de newsletters · <fecha en español>`
- There is no intro paragraph block; content starts directly with the newsletter section after the main title
- The ordering is: NOTICIAS GENERALES first, DIVULGACIÓN second, OPINIÓN third, TECH last.
- Follow the specific priority list for newsletters within each section.
- TLDR-style tech newsletters are not over-compressed and preserve the substance of the edition
- No emojis appear anywhere in the final output
- Every claim is specific and grounded in the newsletter text
- The HTML is clean, readable, polished, and shareable

MINIMAL TEMPLATE (use this exact structure and classes):
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{{PAGE_TITLE}}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="wrap">
    <h1>{{MAIN_TITLE}}</h1>

    <section class="section">
      <h2>{{HUMAN_DATE}}</h2>
      {{NEWSLETTER_CARDS}}
    </section>

    <p class="footer">{{FOOTER}}</p>
  </main>
</body>
</html>
```

`{{NEWSLETTER_CARDS}}` must follow this pattern:
- Add section headers only when that section has content.
- Use exact classes for headers:
  - `<h2 class="section-header section-header--secondary">NOTICIAS GENERALES</h2>`
  - `<h2 class="section-header section-header--tertiary">DIVULGACIÓN</h2>`
  - `<h2 class="section-header section-header--quaternary">OPINIÓN</h2>`
  - `<h2 class="section-header section-header--quinary">TECH</h2>`
- Use `<article class="block">` for TLDR-like / link-heavy editions.
- Use `<article class="card">` for regular newsletters.
- Article structure:
  - `<h3>Newsletter title</h3>`
  - `<ul><li>...</li></ul>`
  - Optional clean external link paragraph:
    - `<p><a href="https://..." target="_blank" rel="noreferrer">Leer artículo completo</a></p>`
