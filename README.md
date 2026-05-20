# Portafolio · Sergio A. Hernández Vera

Portafolio personal con estética cósmico-cuántica, bilingüe (ES/EN), y proyectos gestionados con archivos Markdown.


## 📁 Estructura del proyecto

```
.
├── Portafolio.html       ← punto de entrada
├── styles.css            ← estilos
├── i18n.js               ← textos del hero, about, navegación (raramente cambian)
├── quantum-bg.js         ← 3 animaciones del hero
├── app.jsx               ← componente raíz, Nav, Hero, Loader, Cursor
├── sections.jsx          ← About, Experience, Hardware, Timeline, Contact
├── projects.jsx          ← Sección proyectos + modal con markdown
├── tweaks-panel.jsx      ← Panel de tweaks (oculto por defecto)
├── data/                 ← ✏️ EDITA AQUÍ contenido sin tocar código
│   ├── timeline.json     ← línea de tiempo
│   ├── experience.json   ← experiencia profesional
│   ├── stack.json        ← stack tecnológico (chips)
│   ├── hardware.json     ← items + galería de maker
│   └── contact.json      ← redes sociales
├── projects/
│   ├── manifest.json     ← lista ordenada de proyectos
│   ├── melanoma-ml.md
│   ├── telescopio-114-900.md
│   └── ...               ← un .md por proyecto
└── assets/
    ├── moon-1.jpg
    ├── moon-2.jpg
    ├── telescope-build.jpg
    └── telescope-eyepiece.jpg
```

## ✍️ Cómo editar el contenido (sin tocar código)

Todo el contenido vive en archivos JSON dentro de la carpeta `data/` y `projects/`. Para editar, abre el archivo, cambia el texto, guarda. **No tocas JSX nunca.**

### 📊 Timeline — `data/timeline.json`

```json
{
  "year": "2026",
  "title_es": "Nuevo logro",
  "title_en": "New milestone",
  "desc_es": "Descripción en español.",
  "desc_en": "Description in english."
}
```

Para añadir un evento: copia un bloque, pégalo y edítalo. El orden del array es el orden visual (arriba → abajo).

### 💼 Experiencia — `data/experience.json`

```json
{
  "when_es": "2026 — Presente",
  "when_en": "2026 — Present",
  "role_es": "Puesto en español",
  "role_en": "Role in english",
  "desc_es": "Qué hago…",
  "desc_en": "What I do…"
}
```

### 🛠 Stack tecnológico — `data/stack.json`

Cinco categorías. Cada una tiene `title_es`, `title_en`, `color` (`default | purple | pink | orange`) y un array `items` con strings simples.

### 🔧 Hardware & Maker — `data/hardware.json`

Dos arrays:
- `items` — las 4 tarjetas con icono + título + descripción
- `gallery` — fotos del telescopio/luna. `wide: true` hace que la foto ocupe dos columnas (úsalo para la foto destacada).

### 📬 Contacto — `data/contact.json`

Cada tarjeta tiene `icon`, `label_es`, `label_en`, `value` (texto visible) y `href` (enlace).

### 📁 Proyectos — `projects/manifest.json` + `projects/*.md`

Ver sección de abajo.

### 🏠 Hero, Sobre mí y textos de UI

Solo estos textos viven en `i18n.js` (porque son el "marco" del sitio, casi nunca cambian):
- Tagline, nombre, frase del hero
- Párrafos de "Sobre mí"
- Títulos de sección y kickers
- Labels de botones, filtros, navegación

Si quieres cambiar alguno, abre `i18n.js`, hay dos objetos: `es` y `en` con las mismas llaves.

## 📁 Cómo agregar un proyecto nuevo

1. Crea un archivo Markdown en `projects/`, por ejemplo `projects/mi-nuevo-proyecto.md`.

2. Agrégalo a `projects/manifest.json`:

```json
{
  "slug": "mi-nuevo-proyecto",
  "title_es": "Título en español",
  "title_en": "Title in english",
  "subtitle_es": "Subtítulo corto",
  "subtitle_en": "Short subtitle",
  "category": "ai",          // ai | physics | quantum | fullstack | hardware
  "year": "2026",
  "status_es": "En desarrollo",
  "status_en": "In progress",
  "tags": ["Python", "OpenCV"],
  "links": [
    { "label": "GitHub", "url": "https://github.com/..." }
  ],
  "featured": true            // opcional, aparece con estrella
}
```

3. Listo. Recarga la página.

El archivo `.md` soporta: headings (`#`, `##`, `###`), **negrita**, *itálica*, `código inline`, listas (`-`), enlaces `[texto](url)`, citas `> ...` y `\`\`\`bloques de código\`\`\``.

## 🌍 Traducciones

Edita `i18n.js`. Tiene dos objetos: `es` y `en`. Las claves coinciden 1:1. Si agregas una clave nueva, agrégala en ambos idiomas.

## 🎨 Personalización rápida

Los colores principales viven en `styles.css` dentro de `:root`. Los más importantes:

- `--accent` (turquesa principal, `#64ffda`)
- `--accent-2` (violeta, `#bd93f9`)
- `--accent-3` (rosa, `#ff79c6`)
- `--bg-0` (fondo principal, `#050816`)

El panel de **Tweaks** (toggle en la toolbar de Claude) deja cambiar:
- Modo del hero: red cuántica / átomo Bohr / función de onda
- Densidad de partículas, velocidad, intensidad del glow
- Color de acento
- Cursor personalizado on/off
- Sonidos sutiles al hover on/off

Los valores se guardan en el bloque `EDITMODE` del JSON dentro de `app.jsx`.

## 🔥 Deploy en Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2. Inicializar en este folder

```bash
firebase init hosting
```

Cuando pregunte:
- **Public directory:** `.` (un punto, raíz del proyecto)
- **Single-page app:** `No`
- **Set up automatic builds with GitHub:** opcional
- **Overwrite Portafolio.html:** **No**

### 3. Cambiar el archivo de entrada

Firebase por default sirve `index.html`. Tienes dos opciones:

**Opción A** (recomendada): renombra `Portafolio.html` a `index.html`.

**Opción B**: en `firebase.json` agrega un rewrite:

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/", "destination": "/Portafolio.html" }
    ]
  }
}
```

### 4. Desplegar

```bash
firebase deploy --only hosting
```

Te dará una URL `https://tu-proyecto.web.app`. Si quieres dominio propio, configúralo desde la consola de Firebase.

### ⚡ Tip de rendimiento

El proyecto carga Babel en el cliente (para mantener simplicidad y editabilidad). Para producción puedes:
- Pre-compilar los `.jsx` con esbuild/swc a `.js` puro
- Quitar la línea de Babel del HTML
- Cambiar `type="text/babel"` por `type="module"` o nada

Pero honestamente, para un portafolio que se visita unas decenas de veces al día, está perfecto así.

## 📜 Licencia

Todo el código de este portafolio es tuyo, hazlo brillar 🌟
