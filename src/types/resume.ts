/**
 * The resume document as the theme consumes it.
 *
 * The theme renders **stable** (JSON Resume 2.x) resumes only (ADR 0003):
 * the base types come from `@jsonresume/types` (generated upstream from
 * `@jsonresume/schema`), and 1.x field names are detected and warned
 * about by the build-time gate in `src/validate/` — never read here.
 *
 * What remains hand-written are the theme's *non-standard* extensions —
 * fields no JSON Resume era declares:
 *
 * - `Work.growth` — screen-only progress garnish (the **Growth** metadata)
 * - `Award.url` — the 2.x award has no URL
 * - `Reference.label` / `position` / `summary` — free-text context the
 *   schema leaves to `relationship` / `organization`
 */

import type {
	AwardItem,
	CertificateItem,
	EducationItem,
	Iso8601,
	ProjectItem,
	PublicationItem,
	ReferenceItem,
	Resume,
	VolunteerItem,
	WorkItem,
} from '@jsonresume/types'

/** A stable resume document. */
export type ResumeDocument = Resume

/**
 * A work item with the theme's non-standard `growth` extension.
 * (`keywords` is stable in 2.x, #293 — plain schema work data renders.)
 */
export type Work = WorkItem & {
	growth?: {
		label?: string // e.g., "3 Promotions" or "Rapid Growth"
		level?: number // 1-5 discrete representation
		percent?: number // 0-100 percentage bar
	}
}

/** Awards: the 2.x schema has no URL; the theme reads one when present. */
export type Award = AwardItem & {
	url?: string
}

/**
 * References: free-text context the schema leaves to `relationship` /
 * `organization` — the theme reads them alongside the stable fields.
 */
export type Reference = ReferenceItem & {
	label?: string
	position?: string
	summary?: string
}

/** Education, volunteer, projects, publications, and certificates render as-is. */
export type Education = EducationItem
export type Volunteer = VolunteerItem
export type Project = ProjectItem
export type Certificate = CertificateItem
export type Publication = PublicationItem

export type { Iso8601 }
