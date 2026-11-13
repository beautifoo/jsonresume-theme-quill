# The published theme is a Node module that static-renders

resume-cli 3.x consumes a theme as a **Node module** exporting `render(resume) → HTML string` (its `loadTheme` resolves the package entry and imports it), but this package pointed `main`/`exports` at `dist/index.html` — Node cannot import an `.html` file, so every CLI path died with `ERR_UNKNOWN_FILE_EXTENSION` before rendering anything. We decided the published entry is an ESM module (`dist/index.js`) whose `render` server-side renders the theme (`react-dom/server`) into a fully self-contained document: inlined CSS, static markup, the small screen-scheme bootstrap, and nothing else.

Considered: an HTML template with a `{{resume}}` placeholder — that was resume-cli 1.x's contract; the 3.x loader has no template path. A client-rendering document (static markup plus an inlined React bundle that hydrates) — rejected: `resume audit` parses the exported HTML with cheerio, which executes no JavaScript, so static markup is required anyway, and hydration's only purchase is a live "now" for open-ended durations, at the cost of a much larger file, a timezone-mismatch surface between export and viewing, and a PDF that depends on the bundle executing cleanly in headless Chromium.

Consequences:

- All four CLI commands work: `export` to .html and .pdf, `audit` (scores against the real DOM — the double layout earns a 96/100 grade A on the demo resume), and `serve`.
- The PDF knobs (`pdfRenderOptions: { format: 'A4', mediaType: 'print' }`, `pdfViewport: { width: 794, height: 1123 }`) are **exports of the module**, not package.json fields: the CLI reads them off the loaded theme entry.
- `dependencies` is empty — React, the i18n runtime, and the stylesheet all bundle into `dist/index.js`; an npm install of the theme pulls nothing.
- Duration strings ("3 yrs 2 mos") are measured at export time and freeze with the file. Re-export refreshes them; a published page never drifts. If real client interactivity ever lands, this decision is reopened.
- `dist/` is one module plus `demo.html` (the same string `render` produces, for a quick look). The old HTML+chunks build is gone; the dev/preview server is unchanged.
