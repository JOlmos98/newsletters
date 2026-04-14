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
