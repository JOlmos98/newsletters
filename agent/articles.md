Este archivo solo da **contexto**: orden de secciones y orden estricto de newsletters dentro de cada sección. **No** contiene los bloques HTML `<article>`.

Los trocitos de HTML (solo los `<article>...</article>` generados) van en `agent/articlesHtml.md`. Cursor los moverá a `index.html` siguiendo el orden definido aquí abajo.

Tras publicar el digest del día, los bloques ya movidos se borran de `agent/articlesHtml.md`; este archivo (`articles.md`) se mantiene como referencia de contexto.

They can be grouped together and out of order in `articlesHtml.md`: Cursor will sort them exclusively in this order (some may always be missing; in that case, they are not included in the final HTML; use `@agent/htmlTemplate.md` as the reference and update date and index after inserting the articles in the proper order):

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
