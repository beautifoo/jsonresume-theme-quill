# Conferences & Research in the JSON Resume Schema

Findings from the 2.x schema (`node_modules/@jsonresume/schema/schema.json`). The 2.x top level is: `basics, objective, work, volunteer, education, awards, certificates, publications, skills, languages, interests, references, projects, meta, custom`. There is no `conferences` or `research` section, but both categories have sanctioned homes — no schema extension required.

## Conferences

Two standard escape hatches, both already rendered by the theme:

1. **`projects` with `type`** — the schema's `projects[].type` description names the examples: *'volunteering', 'presentation', 'talk', 'application', 'conference'*. A conference talk as a project item (`name`, `url`, dates, `roles`, `type`) is fully in-schema and flows into `Projects.tsx`.
2. **`publications` with `type: "talk"`** — `publications[].type` examples include *'talk'* (#295), and `publisher`'s description says *"For talks, the event name"*. A talk at a conference is `publications: [{ name, type: "talk", publisher: "OSCON 2025", ... }]`, flowing into the **Conferences** section (talk-like types) or `Publications.tsx` (everything else) — the split below.

### `publications` type: `"talk"` vs `projects` type: `"talk"`

They are shaped for different kinds of thing:

- **`publications` = a point-in-time artifact you put out into the world.** Bibliographic fields: `name` (title), `authors` ("in published order, including the resume owner"), `publisher` (the event name for talks), a single `releaseDate` (no date range), `volume`/`issue`/`pages`, `identifiers` (doi, arxiv, …). #295 folded talks in as another artifact kind.
- **`projects` = an activity or endeavor over time.** Career-shaped fields: `startDate`–`endDate` range, `roles`, `entity` (affiliation), `highlights`, `keywords`, `summary`. Its `type` classifies what *kind* of project it is.

| | `publications` type: `"talk"` | `projects` type: `"talk"` |
|---|---|---|
| Framing | one-off published artifact | ongoing endeavor |
| Date | single `releaseDate` | `startDate`–`endDate` range |
| Event name | `publisher` | nowhere first-class (`entity` is "company/entity affiliations" — a stretch) |
| Co-speakers | `authors` | n/a (`roles` is about your role) |
| Citations | `identifiers` (doi/arxiv) | n/a |
| Detail | `summary` only | `summary` + `highlights` + `keywords` |

**Rule of thumb:** a plain "I gave a talk at X in 2025" → **publications** (the schema explicitly routes the event name through `publisher`). Use **projects** when the talk needs a duration, an affiliation, or highlight bullets — e.g. a recurring speaking engagement, a conference series you ran, or a talk tied to a research project.

In this theme they render differently:

- `Publications.tsx` → **sidebar** (`Section` + `SidebarEntry`): title, `publisher` as subtitle, year-only date, url, `authors` and `summary` as body (whichever is present; both when both are). No `highlights` or range dates are read; the one field it routes on is `type` (below).
- `Projects.tsx` → **main column** (`Section` + `TimelineEntry`/`SectionCard`): title, `roles[0] || entity` as subtitle, date range, summary, highlights, keyword tags.

**The theme splits `publications` by `type` (ADR 0005).** Talk-like items — `type` of `talk`, `presentation` or `speech`, matched case-insensitively by the whitelist in `src/components/conferenceRouting.ts` — render in a distinct **Conferences** section (sidebar, before Publications, `View Talk` link label); everything else, including untyped publications, stays in **Publications**. Each publication renders exactly once, and the split is opt-in: a misspelled or novel `type` (`keynote`, `lecture`) safely stays in Publications. Since `type` is a stable 2.x field, no schema extension is involved — routing reads what the schema already declares. A talk placed in `projects` instead gets full main-column timeline treatment and is not part of the split.

## Research / university experience

**`work`** is the canonical home. `work[]` items are `additionalProperties: true`, so nothing extra is needed:

```json
{
  "work": [{
    "name": "University of Copenhagen",
    "position": "Postdoctoral Researcher",
    "location": "Copenhagen, DK",
    "startDate": "2022-08",
    "summary": "…",
    "keywords": ["…"]
  }]
}
```

It just renders in `WorkExperience.tsx`. The degree itself belongs in `education` (`area`, `studyType`), and research outputs (papers, thesis) belong in `publications` (`type: "thesis"` / `"article"`).

## Two things to avoid

- **`custom`** — tempting, but the schema defines it as *"Tool- or author-specific data… Themes are not expected to render it, and tools should preserve it unchanged."* It is a preservation channel, not a rendering hook.
- **A bespoke top-level `conferences` section** — valid (top level is `additionalProperties: true`), but it re-invents what the theme already provides: the ADR 0005 `type` split yields a distinct "Conferences" section from fully standard `publications` data. No reason to re-invent it.
