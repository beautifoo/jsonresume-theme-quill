# jsonresume-theme-quill

A quiet, typographic [JSON Resume](https://jsonresume.org/) theme: one accent,
a real type hierarchy, and a single embedded serif moment (the name). Built
with Bun, TypeScript, React 19, and Tailwind CSS v4.

Quill renders to two equal targets:

- **Screen** — any viewport, light or dark (`prefers-color-scheme`), fully
  self-contained (no CDN, no network, no webfont requests)
- **Print** — PDF from a 794px canvas (A4 at 96 dpi), always the light
  palette, at a denser scale, with page-break-safe entries

## Using it with resume-cli

```bash
npm install jsonresume-theme-quill

resume export resume.pdf   --theme quill   # A4 PDF, print palette
resume export resume.html  --theme quill   # self-contained static page
resume audit resume.json   --theme quill   # ATS score (reads the real DOM)
resume serve --theme quill # live preview with reload
```

The theme is a Node module exporting `render(resume) → html`; the
published document carries inlined CSS and static markup — no client
JavaScript, so it also renders in JS-disabled viewers. Duration strings
("3 yrs 2 mos") are measured at export time and freeze with the file;
re-export to refresh.

## Development

```bash
bun install
bun dev            # the resume page; /compare serves the theme comparison tool
bun run build      # self-contained dist/
bun test           # vitest
```

The compare page renders the theme's variants (default / monochrome)
side by side for the same resume, with layout (single/double), scheme,
and variant controls.

## Theming

Everything is parameterized by `--quill-*` custom properties
(see `src/styles/globals.css`): the **ink scale** (type hierarchy),
one **accent**, **surface**, **line**, the layout columns, and the
display face. Override them on any wrapper — or per resume:

```css
:root {
	--quill-accent: oklch(0.5 0.15 30); /* one line, new identity */
	--quill-cols-wide: minmax(0, 1fr); /* single-column layout */
}
```

The React API exposes the structural knobs:

```tsx
<Resume resume={resume} layout="double" variant="default" />
// layout: "double" (default, main + sidebar) | "single" —
//         applied as the layout-* class, which presets --quill-cols-wide
// variant: "default" | "monochrome" (zero hue: the accent collapses to ink)
```

The DOM is one flat semantic flow (main sections first, sidebar after —
no tables, floats, or positioned text) in **both** layouts, so the output
stays parseable by application-tracking systems. See `docs/adr/` for the
decisions behind the design.

## The name font

The name renders in a **system serif** — `"New York", Georgia, "Times
New Roman", serif` — with no embedded font: the built page and the PDF
carry zero font payload, and there is no font file, license, or
generation script to maintain. The exact face differs between macOS and
Windows, but the role (one quiet serif moment, semi-bold ink) does not.

## Notes

- Dates parse as local dates and format in the viewer's timezone;
  open-ended roles read `… – Present` (localized).
- Work history groups by company regardless of contiguity and sorts
  reverse-chronologically.
- Numbers in summaries and highlights are auto-bolded, so quantified
  results stand out.

## License

MIT
