This file is now only the ordering guide. New raw HTML `<article>...</article>` blocks must be accumulated in `agent/articlesHtml.md`. Cursor will take those articles, sort them according to the order defined here, and then run the final flow in `agent/cursorPrompt.mdc` (using `agent/htmlTemplate.md` as reference).

1. NOTICIAS GENERALES first (color --secondary, class section-header--secondary)
   Strict internal order:
   1. 1440
   2. The Objective (can also appear as "Alvaro Nieto")

2. DIVULGACIÓN second (color --tertiary, class section-header--tertiary)
   Strict internal order:
   1. IA para todos
   2. Alvaro Garcia | Jardin Mental
   3. No Solo Suerte por Rafa
   4. Franco Fernando
   5. Alberto Mera UPSB
   6. Samuel Gil
   7. Libertad Individual - La Newsletter Anarquista
   8. Entre lineas
   9. Superhuman AI Zain Kahn
   10. Spicy4Tuna
   11. The Substack Post
   12. Lord Draugr

3. OPINIÓN third (color --quaternary, class section-header--quaternary)
   Strict internal order:
   1. Noahpinion
   2. Edward Zitron
   3. Made in Ancapia
   4. Mathsurf Club

4. TECH last (color --quinary, class section-header--quinary)
   Strict internal order:
   1. TLDR (includes TLDR, TLDR AI, TLDR Dev, TLDR IT, etc.)
   2. HackerNoon
   3. Manfred
   4. La Bonilista
   5. Lenny's Newsletter

Articles list (html, only `<article>...</article>` blocks) is in `agent/articlesHtml.md`.

