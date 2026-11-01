# jsonresume-theme-folio

A JSON Resume theme: one resume document, rendered to two equal targets — screen and print.

## Language

**Folio**:
The design identity of this theme: quiet, typographic, one accent.
_Avoid_: "the react theme" (that's the upstream it was forked from)

**Accent**:
The single non-neutral hue in the palette. Used sparingly: section titles, links, timeline rules, growth indicator.
_Avoid_: Brand, highlight, primary — the pre-redesign code mixed all three; **Accent** is the canonical term from now on

**Ink scale**:
The neutral text color scale (darkest → lightest) used for the type hierarchy: headings, body, secondary, muted.
_Avoid_: `text-foreground-secondary` and friends — those are the broken utility names, not concepts

**Surface**:
A card or region background, one step off the page background.
_Avoid_: `bg-color`, `bg-surface` (legacy upstream token, dead since the migration)

**Token**:
A CSS custom property defined in `:root` that parameterizes the theme (ink, accent, surface, spacing, radius, layout columns). Hosts or resumes may override tokens; components never hardcode colors.

**Layout mode**:
How the theme arranges its sections: `double` (main column + sidebar, the default) or `single` (one column, pro-style). Selected via a token: the `--folio-cols-wide` value, preset by the `layout-single` / `layout-double` class on the resume root — CSS cannot branch on a variable *value*, so the class is the selector form of the token (ADR 0001); hosts may set either. Both must honor the ATS-safe document order.
_Avoid_: "columns mode", "two-column" — the canonical mode names are **single** and **double**

**Resume date**:
A date field in a resume document (ISO-8601 with optional month/day, or free text). Always parsed as a *local* date — a UTC-midnight parse would shift the day for viewers west of UTC — and rendered through the i18n provider, so locale, timezone, and "now" all come from it (open-ended durations measure from the provider's "now", never `new Date()`).
_Avoid_: `new Date(...)` in components

**ATS-safe document order**:
The flat semantic DOM order: main sections first, sidebar sections after; no tables, floats, or positioned text; icons decorative-only. This is what makes either layout parseable by application-tracking systems.

**Screen target**:
On-screen rendering (any viewport, light or dark via `prefers-color-scheme`), including the resume **published as a static web page** — the built output must be self-contained (no CDN or network dependencies).

**Print target**:
PDF output rendered from an 850px-wide canvas. Always the light palette, regardless of `prefers-color-scheme`.

## Relationships

- The **Folio** identity is expressed entirely through **Tokens**
- A resume document renders to one **Screen target** view and one **Print target** view; layout decisions that only affect one must be marked as such
- **Accent** appears at most a handful of times per page; everything else is **Ink scale** or **Surface**
- Both layout modes share one **ATS-safe document order**; `double` repositions the sidebar visually, never reorders the DOM

## Example dialogue

> **Dev:** "Should the section title use the accent or the darkest ink?"
> **Expert:** "Accent — section titles are one of the few places the accent is allowed to appear."

> **Dev:** "The sidebar cards look washed out in dark mode — can I make them use the accent tint?"
> **Expert:** "No. Cards are surfaces, one step off the background. Accent tint is for tags and indicators only."

**Display face**:
The single embedded serif used for the name and nowhere else.
_Avoid_: "the font" (the body is the system sans stack — see ADR 0002)

## Flagged ambiguities

- "brand" was used for the accent hue, the `--brand` tag style, and the upstream project name — resolved: **Accent** for the color, no "brand" in new code.
- `bg-surface` / `bg-color` / `bg-color-secondary` all meant "a card background" at various points in the migration — resolved: **Surface**.
