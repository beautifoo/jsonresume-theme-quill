# Conferences section from the `publications.type` split

JSON Resume 2.x has no conferences section; `publications.type` (#295) exists precisely so a talk can sit in `publications` with the event name in `publisher`. The theme rendered every publication in one Publications section, so talks drowned next to papers. We decided to split the section on that field: publications with a talk-like `type` (`talk`, `presentation`, `speech` — case-insensitive whitelist in `src/components/conferenceRouting.ts`) render in a new **Conferences** section; everything else, including untyped publications, stays in **Publications** (title unchanged). Each publication renders exactly once.

Considered: a bespoke top-level `conferences` section — rejected: re-invents `projects.type: "conference"` while diverging from what other hosts render, for data that the schema already carries. Routing talks to a main-column timeline — rejected: the publications shape has a single date and no highlights, so the card renders half-empty and borrows main-column weight. Listing talks in *both* sections — rejected: the ATS parses the same artifact twice and the page repeats itself. Drawing research *positions* (a `work` filter) into a Research section — rejected: `work` has no `type` field, it would need a non-standard extension, and it splits employment history that ATS parsers read as one section.

Consequences:

- Resume authors now write `type: "talk"` against the rendered contract: a document that once showed a talk in Publications shows it in Conferences on this theme and nowhere else. That is a hard-to-reverse promise, which is why the routing rule lives in one constant — extending it (e.g. `keynote`) is a one-line change.
- The split is opt-in by construction: an untyped or novel `type` value stays in Publications, so no existing document changes placement unless its author asks for it.
- When the split empties a side, that section disappears via the existing emptiness guard — an all-talk resume has Conferences and no Publications.
- Zero schema or type changes: `type` is stable in both the pinned valibot schema and the `@jsonresume/types` re-exports; the change is routing plus one registry entry (sidebar, before Publications) and a `viewTalk` label in all eight locales.
