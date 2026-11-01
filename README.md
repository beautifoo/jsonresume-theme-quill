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
bun dev            # resume page (uses ./resume.json)
bun run compare    # same server: open /compare — the theme comparison tool
bun run build      # self-contained dist/
bun test           # vitest
```

The compare page renders Folio's variants (folio / folio-monochrome)
next to the registry reference themes for the same resume, with layout
(single/double), scheme, and variant controls.

## Theming

Everything is parameterized by `--folio-*` custom properties
(see `src/styles/globals.css`): the **ink scale** (type hierarchy),
one **accent**, **surface**, **line**, and the display face. Override them
on any wrapper — or per resume:

```css
:root {
	--folio-accent: oklch(0.5 0.15 30); /* one line, new identity */
}
```

The React API exposes the structural knobs:

```tsx
<Resume resume={resume} layout="double" variant="folio" />
// layout: "double" (default, main + sidebar) | "single"
// variant: "folio" (default) | "folio-monochrome" (zero hue: the accent collapses to ink)
```

The DOM is one flat semantic flow (main sections first, sidebar after —
no tables, floats, or positioned text) in **both** layouts, so the output
stays parseable by application-tracking systems. See `docs/adr/` for the
decisions behind the design.

## The name font

The name renders in **Folio Serif** — Source Serif 4 (Adobe, OFL 1.1)
instantiated at SemiBold/48 and subset to Latin + Latin-Extended, embedded
as base64 (~47 KB). It is a *modified* version, so per the OFL Reserved
Font Name clause it ships renamed. Regenerate with
`python3 scripts/embed-fonts.py` (needs `fonttools` + `brotli`).

## Notes

- Dates parse as local dates and format in the viewer's timezone;
  open-ended roles read `… – Present` (localized).
- Work history groups by company regardless of contiguity and sorts
  reverse-chronologically.
- Numbers in summaries and highlights are auto-bolded, so quantified
  results stand out.

## License

MIT (the embedded font is SIL OFL 1.1 — see `src/styles/fonts/LICENSE.md`)
