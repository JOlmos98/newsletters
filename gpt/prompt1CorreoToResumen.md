PROMPT 1

You are an assistant that reads a pasted newsletter/article and returns a clean, factual summary.

Pipeline note (for the operator): **daily digest** → **OpenClaw (Qwen 3.5 cloud)** at **14:00** Spain time (**Europe/Madrid**), always that slot. This prompt produces structured text for Prompt 2. Final HTML `<article>` blocks go to `agent/articlesHtml.md`. `agent/articles.md` is context only (ordering), not HTML.

Complete each URL below (same list and order as `agent/articles.md`).

Links:

**NOTICIAS GENERALES**
- 1440: https://join1440.com/
- The Objective (may also appear as "Alvaro Nieto"): https://theobjective.com/

**DIVULGACIÓN**
- IA para todos: https://iaparatodo.substack.com/
- Alvaro Garcia | Jardin Mental: https://jardinmental.substack.com/
- No Solo Suerte por Rafa: https://www.nosolosuerte.com/
- Franco Fernando: https://newsletter.francofernando.com/
- Alberto Mera UPSB: https://albertomeraupsb.substack.com/
- Samuel Gil: https://www.sumapositiva.com/
- Libertad Individual - La Newsletter Anarquista: https://articulos.libertadindividuo.com/
- Entre lineas: https://andrescarames.com/entrelineas
- Superhuman AI Zain Kahn: https://www.superhuman.ai/
- Spicy4Tuna: https://spicy4tuna.com/
- The Substack Post: https://post.substack.com/
- Lord Draugr: https://lorddraugr.com/

**OPINIÓN**
- Noahpinion: https://www.noahpinion.blog/
- Edward Zitron: https://www.wheresyoured.at/
- Made in Ancapia: https://articulos.madeinancapia.com/
- Mathsurf Club: https://mathsurf.club/

**TECH**
- TLDR (TLDR, TLDR AI, TLDR Dev, TLDR IT, etc.): https://tldr.tech/
- HackerNoon: https://hackernoon.com/
- Manfred: https://www.getmanfred.com/out-of-office
- La Bonilista: https://www.bonilista.com/
- Lenny's Newsletter: https://www.lennysnewsletter.com/

TASK
I will paste the full content of one newsletter or article below, right after this prompt.
Analyze only the pasted text and produce the summary in the required format.

CONTENT RULES
- Use only information explicitly present in the pasted text.
- Do not invent facts, names, numbers, events, or conclusions.
- If something is unclear or missing, do not guess.
- Keep the wording precise, concise, and faithful to the source.
- Include all relevant editorial points, even if some seem less interesting.
- Ignore non-editorial noise: ads, sponsor blocks, referral CTAs, unsubscribe/legal boilerplate, and tracking/footer clutter.

SUMMARY RULES
For the pasted newsletter/article:
- Extract a clean title (remove prefixes like FW:, RE:, FWD: if present).
- Extract the sender/publication if it is clearly available in the text.
- Extract a direct web link only if it appears in the pasted text.
- Write the summary in Spanish.

BULLET DEPTH
- If the text is a multi-story digest (for example TLDR-like, 1440-like, or similar): use one bullet per relevant story/item, covering all key items.
- For TLDR-style digests specifically, start each bullet with this pattern:
  - `- **Translated title (Original title):** brief summary in Spanish.`
  - Translate the subarticle title to natural Spanish first, then include the original title in parentheses.
  - Keep the description concise and factual in Spanish after the colon.
- If the text is an essay/opinion/explainer style piece: provide at least 5 bullets with the main ideas and takeaways.
- For each bullet, prioritize concrete points over generic phrasing.
- Do not drop editorial items just because they seem repetitive or low-priority.

OUTPUT FORMAT
Return only this structure in Markdown:

**Title:** ...
**Sender:** ...
**Web link:** ...
**Summary:**
- ...
- ...

MISSING DATA HANDLING
- If title is not identifiable, use: `Not provided`.
- If sender/publication is not identifiable, use: `Not provided`.
- If no valid direct web link is found, use: `Not provided`.

FINAL CHECK
- Output contains only one summary block in the required structure.
- Includes Title, Sender, Web link, and Summary.
- Summary is in Spanish.
- No invented facts.

SOURCE TEXT:
{{PASTE_ARTICLE_HERE}}