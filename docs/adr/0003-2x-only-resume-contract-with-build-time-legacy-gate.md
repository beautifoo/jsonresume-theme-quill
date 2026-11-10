# 2.x-only resume contract with a build-time legacy gate

The typed legacy-field tolerance (introduced in `0d00bbd`, "the theme renders either era") was leaking: the fallbacks were scattered across ~8 components, and the basics block never read the 1.x names at all (`title`/`bio`) — the promise was never actually kept, and a half-kept promise is worse than a strict one. We decided the theme consumes **stable (2.x) resumes only**: the legacy fallbacks are deleted, and a build-time gate enforces the contract with two checks — the **stable** schema, checked with valibot (violations fail the build) and **legacy** 1.x-name detection, a direct table walk (warnings, each naming its stable successor).

Considered: a full both-eras normalizer (one seam mapping 1.x → 2.x before rendering) — rejected: it would maintain a second, forever hand-kept field table for an era the ecosystem left behind. A reorganize-only move of the existing fallbacks into one module — superseded by going 2.x-only.

Consequences:

- A pure 1.x resume builds **with a warning** and renders with its 1.x-specific fields missing. The warning is a migration checklist aimed at the resume author (who runs the build); viewers never see it.
- The gate runs at build time only. valibot is a devDependency — zero payload in the published bundle, consistent with ADR 0002's self-containment stance.
- Types come from `@jsonresume/types` (generated upstream from `@jsonresume/schema`), retiring the frozen local snapshot `src/types/resumeSchema.ts` that had no regeneration pipeline behind it. The hand-written valibot schema is pinned to those types by the type-check gate, so an upstream schema bump surfaces in CI as a type error rather than silent drift.
- The legacy table is defined mechanically — the 1.x-minus-2.x set difference per section — because a name the table misses renders silently with no warning.
