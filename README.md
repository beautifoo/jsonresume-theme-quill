# jsonresume-theme-folio

A quiet, typographic [JSON Resume](https://jsonresume.org/) theme: one accent,
a real type hierarchy, and a single embedded serif moment (the name). Built
with Bun, TypeScript, React 19, and Tailwind CSS v4.

Folio renders to two equal targets:

- **Screen** — any viewport, light or dark (`prefers-color-scheme`), fully
  self-contained (no CDN, no network, no webfont requests)
- **Print** — PDF from an ~850px canvas, always the light palette, at a
  denser scale, with page-break-safe entries

## Development

```bash
bun install
bun dev            # the resume page; /compare serves the theme comparison tool
bun run build      # self-contained dist/
bun test           # vitest
```

The compare page renders the theme's variants (folio / folio-monochrome)
side by side for the same resume, with layout (single/double), scheme,
and variant controls.

## Theming

Everything is parameterized by `--folio-*` custom properties
(see `src/styles/globals.css`): the **ink scale** (type hierarchy),
one **accent**, **surface**, **line**, the layout columns, and the
display face. Override them on any wrapper — or per resume:

```css
:root {
	--folio-accent: oklch(0.5 0.15 30); /* one line, new identity */
	--folio-cols-wide: minmax(0, 1fr); /* single-column layout */
}
```

The React API exposes the structural knobs:

```tsx
<Resume resume={resume} layout="double" variant="folio" />
// layout: "double" (default, main + sidebar) | "single" —
//         applied as the layout-* class, which presets --folio-cols-wide
// variant: "folio" (default) | "folio-monochrome" (zero hue: the accent collapses to ink)
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
