/**
 * The resume document as the theme consumes it.
 *
 * `resumeSchema.ts` is generated from @jsonresume/schema (do not edit
 * it), but resumes in the wild still use *legacy* 1.x field names
 * alongside the current 2.x ones (`title`/`name`, `description`/
 * `summary`, …). The theme deliberately renders both. These
 * hand-written views type that tolerance: each extends the generated
 * base with the extra names the components read, so a resume written
 * in either era is fully typed — and the type-check gate (CI)
 * verifies the seam.
 */

import type { Iso8601, ResumeSchema } from './resumeSchema'

export type Resume = ResumeSchema

type BaseWork = NonNullable<Resume['work']>[number]
type BaseEducation = NonNullable<Resume['education']>[number]
type BaseAward = NonNullable<Resume['awards']>[number]
type BaseCertificate = NonNullable<Resume['certificates']>[number]
type BasePublication = NonNullable<Resume['publications']>[number]
type BaseReference = NonNullable<Resume['references']>[number]
type BaseProject = NonNullable<Resume['projects']>[number]
type BaseVolunteer = NonNullable<Resume['volunteer']>[number]

/**
 * A work item with the theme's non-standard extensions: `keywords`
 * (rendered as the tag row) and `growth` (a screen-only progress
 * garnish). Both optional — plain schema work data is assignable.
 */
export type Work = BaseWork & {
	keywords?: string[]
	growth?: {
		label?: string // e.g., "3 Promotions" or "Rapid Growth"
		level?: number // 1-5 discrete representation
		percent?: number // 0-100 percentage bar
	}
}

/** Education entries: the theme also reads a `location` the schema doesn't declare. */
export type Education = BaseEducation & {
	location?: string
}

/** Awards: 1.x `name` of `title`; `awardDate` / `startDate` / `issuer` as alternates of `date` / `awarder`; `url` (not in the schema). */
export type Award = BaseAward & {
	name?: string
	awardDate?: Iso8601
	startDate?: Iso8601
	issuer?: string
	url?: string
}

/** Certificates: `startDate` as an alternate of `date`. */
export type Certificate = BaseCertificate & {
	startDate?: Iso8601
}

/** Publications: 1.x `organization` of `publisher`; `startDate` of `releaseDate`; `authors` (not in the schema). */
export type Publication = BasePublication & {
	organization?: string
	startDate?: Iso8601
	authors?: string[]
}

/** References: 1.x context fields the schema leaves to free text. */
export type Reference = BaseReference & {
	label?: string
	position?: string
	organization?: string
	summary?: string
}

/** Projects: 1.x `position` and `summary` (of `roles` / `description`). */
export type Project = BaseProject & {
	position?: string
	summary?: string
}

/** Volunteer entries: the theme also reads a `location` the schema doesn't declare. */
export type Volunteer = BaseVolunteer & {
	location?: string
}
