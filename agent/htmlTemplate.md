
HTML template without the articles:

Prepared `<article>` blocks live in `agent/articlesHtml.md` (staging); ordering rules are in `agent/articles.md` (context only). Insert those articles here, as one complete `<article>` section per newsletter, then update the date and the index.

```html

<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Digest diario de newsletters · 15 de abril de 2026</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="wrap">
    <h1>Digest Diario de Newsletters de Jesús Olmos Soler</h1>

    <section class="section">
      <h2>Miércoles, 15 de abril de 2026</h2>
      <details class="digest-index">
        <summary class="digest-index__title">
          <span class="digest-index__label digest-index__label--closed">Mostrar índice</span>
          <span class="digest-index__label digest-index__label--open">Ocultar índice</span>
        </summary>
        <nav aria-label="Indice de newsletters">
          <ul>
            <li>
              <a href="#noticias-generales">NOTICIAS GENERALES</a>
              <ul>
                <li><a href="#1440-daily-digest-2026-04-15">1440 Daily Digest</a></li>
              </ul>
            </li>
            <li>
              <a href="#divulgacion">DIVULGACIÓN</a>
              <ul>
                <li><a href="#spicy4tuna">Spicy4Tuna</a></li>
              </ul>
            </li>
            <li>
              <a href="#opinion">OPINIÓN</a>
              <ul>
                <li><a href="#made-in-ancapia-1">Made in Ancapia (Monedas)</a></li>
                <li><a href="#made-in-ancapia-2">Made in Ancapia (Brigada Antifraude)</a></li>
                <li><a href="#made-in-ancapia-3">Made in Ancapia (Autocrítica)</a></li>
              </ul>
            </li>
            <li>
              <a href="#tech">TECH</a>
              <ul>
                <li><a href="#tldr">TLDR</a></li>
                <li><a href="#tldr-ai">TLDR AI</a></li>
                <li><a href="#tldr-devops">TLDR DevOps</a></li>
                <li><a href="#superhuman-ai">Superhuman</a></li>
                <li><a href="#lennys-newsletter-1">Lenny's Newsletter (Agentes)</a></li>
                <li><a href="#lennys-newsletter-2">Lenny's Newsletter (Claude)</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </details>

      <h2 id="noticias-generales" class="section-header section-header--secondary">NOTICIAS GENERALES</h2>

      <h2 id="divulgacion" class="section-header section-header--tertiary">DIVULGACIÓN</h2>

      <h2 id="opinion" class="section-header section-header--quaternary">OPINIÓN</h2>

      <h2 id="tech" class="section-header section-header--quinary">TECH</h2>

    </section>

    <p class="footer"><a href="old.html">Ver ediciones antiguas</a></p>
  </main>
</body>
</html>


```