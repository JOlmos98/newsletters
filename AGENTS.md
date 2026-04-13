# Newsletter Digest - Proyecto

Web estática desplegada en GitHub Pages que se regenera diariamente de forma automática. Una IA lee los correos del día (etiqueta `newsletters` en Gmail), genera un resumen en HTML y hace push para que GitHub Pages lo publique.

## Arquitectura del proyecto

| Fichero | Función |
|---|---|
| `index.html` | Página desplegada (se sobreescribe cada día con el digest generado) |
| `plantilla.html` | Plantilla con placeholders (`{{PAGE_TITLE}}`, `{{NEWSLETTER_CARDS}}`, etc.) que la IA rellena |
| `prompt.md` | Prompt completo que recibe la IA para generar el digest |
| `style.css` | Estilos (fuentes Public Sans y Oswald, tema oscuro, variables de color) |
| `script.js` | Reservado para JS mínimo si hiciera falta |

## Tipografia

- **Cuerpo / Resto del texto:** Lexend (300-700)
- **Titulos de secciones y articulos:** Oswald (400-700)

## Orden de secciones (obligatorio)

El digest siempre respeta este orden vertical, de arriba a abajo:

1. **NOTICIAS GENERALES** — color `--secondary` (amarillo `#fff27c`), clase `section-header--secondary`
2. **DIVULGACIÓN** — color `--tertiary` (verde `#9effc8`), clase `section-header--tertiary`
3. **OPINIÓN** — color `--quaternary` (morado `#be7cff`), clase `section-header--quaternary`
4. **TECH** — color `--quinary` (azul `#7cc4ff`), clase `section-header--quinary`

Los titulos de seccion son exactamente estos, en mayusculas, y no se cambian. El CSS ya aplica `text-transform:uppercase`.

Si un dia no llega ninguna newsletter de una seccion, esa seccion simplemente no aparece.

## Newsletters suscritas y su orden dentro de cada seccion

### 1. Noticias generales

1. 1440
2. The Objective (puede aparecer tambien como "Alvaro Nieto")

### 2. Divulgacion

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

### 3. Opinion

1. Noahpinion
2. Edward Zitron
3. Made in Ancapia

### 4. Tech

1. TLDR (incluye TLDR, TLDR AI, TLDR Dev, TLDR IT, etc.)
2. HackerNoon
3. Manfred
4. La Bonilista
5. Lenny's Newsletter

Cualquier newsletter no listada aqui debe clasificarse en la seccion mas apropiada y colocarse al final de esa seccion.

## Regla de titulos de las cards

**IMPORTANTE:** El nombre de la seccion NO aparece en el titulo (`<h3>`) de cada newsletter. La cabecera de seccion (`<h2>`) se pone una sola vez antes del grupo de newsletters de esa seccion, y despues cada card lleva solo el nombre de la newsletter y/o el titulo de la edicion. Ejemplo correcto: `<h3>TLDR</h3>`. Ejemplo incorrecto: `<h3>Tech · TLDR</h3>`.

## Estructura HTML de las cards

Hay dos formatos de card segun el tipo de newsletter:

### Card estandar (para newsletters no-TLDR)

```html
<article class="card">
  <div class="top">
    <span class="pub">Nombre de la newsletter</span>
    <span class="tag">Etiqueta de seccion</span>
  </div>
  <h3 class="title">Titulo del contenido</h3>
  <ul>
    <li><strong>Tema central:</strong> ...</li>
    <li><strong>Que dice la newsletter:</strong> ...</li>
    <li><strong>Por que importa:</strong> ...</li>
  </ul>
</article>
```

### Card tipo bloque (para TLDR y similares)

```html
<article class="block">
  <h3>TLDR</h3>
  <ul>
    <li>
      <strong>Titulo traducido del item</strong><br>
      Descripcion traducida y explicada en espanol.
    </li>
  </ul>
</article>
```

Para TLDR y similares se conserva la estructura de lista de la edicion original, traducida al espanol. No se comprimen en un parrafo unico.

## Cabeceras de seccion

Cada seccion lleva un `<h2>` con la clase de color correspondiente:

```html
<h2 class="section-header section-header--secondary">Noticias generales</h2>
<h2 class="section-header section-header--tertiary">Divulgación</h2>
<h2 class="section-header section-header--quaternary">Opinión</h2>
<h2 class="section-header section-header--quinary">Tech</h2>
```

## Reglas editoriales clave

- Todo el contenido del digest esta en **espanol**.
- **Sin emojis** en ningun lugar del HTML.
- Tono: preciso, calmado, util. Sin hype, sin relleno, sin entusiasmo exagerado.
- Fidelidad estricta al contenido original: no inventar, no exagerar, no suavizar.
- Si un correo llega danado o ilegible, se dice brevemente y no se rellena con suposiciones.
- Se excluyen correos de bienvenida, confirmacion, alta y ruido no editorial.

## Placeholders de la plantilla

| Placeholder | Contenido |
|---|---|
| `{{PAGE_TITLE}}` | Titulo para la pestana del navegador |
| `{{MAIN_TITLE}}` | Titulo principal visible en la pagina |
| `{{INTRO}}` | Parrafo corto resumiendo el dia (cuantas newsletters, temas dominantes) |
| `{{HUMAN_DATE}}` | Fecha legible en espanol (ej: "Miercoles, 1 de abril de 2026") |
| `{{NEWSLETTER_CARDS}}` | HTML completo de todas las cards en el orden correcto |
| `{{FOOTER}}` | Texto breve de pie de pagina |

## Flujo de despliegue

1. La IA lee los correos de las ultimas 24h con etiqueta `newsletters`.
2. Clasifica y filtra (solo contenido editorial real).
3. Genera el HTML sustituyendo los placeholders de `plantilla.html`.
4. Sobreescribe `index.html` con el resultado.
5. Hace commit y push a `main`.
6. GitHub Pages despliega automaticamente.
