/**
 * **Legacy** (JSON Resume 1.x) field detection.
 *
 * The theme renders stable (2.x) resumes only (ADR 0003). Resumes from
 * the 1.x era render with the legacy fields silently absent — so the
 * build gate warns about every known 1.x name it finds, naming the
 * stable successor, as a migration checklist for the resume author.
 *
 * The table is the 1.x-era schema minus the 2.x schema (per section),
 * plus the fields the 1.0 spec documented. It is a closed set: a 1.x
 * name this table misses renders with no warning, so additions are
 * audited against the schema's git history, not guessed.
 *
 * A *deprecated* 2.x alias (e.g. `projects.description` → `summary`,
 * #296) is **not** legacy: it is still in the 2.x schema, so it is
 * never warned about.
 */

import * as v from 'valibot'

export interface LegacyIssue {
	/** Dot path of the offending field, e.g. `basics.title` or `awards[0].name` */
	path: string
	/** The 1.x field name */
	field: string
	/** The stable (2.x) successor, or null when 2.x dropped the field */
	successor: string | null
}

/** 1.x names per 2.x section, mapping to their stable successor (or null when 2.x has none). */
const LEGACY_FIELDS: Record<string, Record<string, string | null>> = {
	// 1.0: title/bio/picture/website/links/twitter/github; 1.1: photo/url/profiles; 1.2: picture/website
	basics: {
		title: 'label',
		bio: 'summary',
		picture: 'image',
		photo: 'image',
		website: 'url',
		websites: 'url',
		links: 'profiles',
		twitter: 'profiles',
		github: 'profiles',
	},
	// `company` → `name` (2016); `website` → `url` (2016)
	work: {
		company: 'name',
		website: 'url',
	},
	volunteer: {
		website: 'url',
	},
	// `gpa` → `score` (2020)
	education: {
		gpa: 'score',
	},
	// 1.0: name/awardDate/issuer; 2.x: title/date/awarder
	awards: {
		name: 'title',
		awardDate: 'date',
		issuer: 'awarder',
	},
	// 1.x: startDate; 2.x: date
	certificates: {
		startDate: 'date',
	},
	// 1.x: organization (1.0) + website; 2.x: publisher
	publications: {
		organization: 'publisher',
		website: 'url',
	},
	// 2.x deliberately removed reference contact details
	references: {
		email: null,
		phone: null,
	},
	// 1.x projects: position (→ roles), website (→ url), tech (→ keywords), team (removed 2016)
	projects: {
		position: 'roles',
		website: 'url',
		tech: 'keywords',
		team: null,
	},
}

/** 1.x top-level section names, mapping to their stable successor. */
const LEGACY_SECTIONS: Record<string, string> = {
	// 1.0: `bio` renamed to `basics`
	bio: 'basics',
	// 1.0–1.2: `hobbies` renamed to `interests`
	hobbies: 'interests',
}

/**
 * Walk a raw resume document, reporting every known 1.x field found.
 * Pure and side-effect free: `build.ts` owns printing and severity.
 */
export function findLegacyFields(document: unknown): LegacyIssue[] {
	const issues: LegacyIssue[] = []
	if (typeof document !== 'object' || document === null) return issues

	const resume = document as Record<string, unknown>

	for (const [section, successor] of Object.entries(LEGACY_SECTIONS)) {
		if (section in resume) {
			issues.push({ path: section, field: section, successor })
		}
	}

	for (const [section, fields] of Object.entries(LEGACY_FIELDS)) {
		const value = resume[section]
		const entries = Array.isArray(value)
			? value
			: typeof value === 'object' && value !== null
				? [value]
				: []
		entries.forEach((entry, i) => {
			if (typeof entry !== 'object' || entry === null) return
			const prefix = Array.isArray(value) ? `${section}[${i}]` : section
			for (const [field, fieldSuccessor] of Object.entries(fields)) {
				if (field in (entry as Record<string, unknown>)) {
					issues.push({
						path: `${prefix}.${field}`,
						field,
						successor: fieldSuccessor,
					})
				}
			}
		})
	}

	return issues
}

/** The valibot form of the same table: any legacy field present is a failure. */
export const legacySchema = v.custom(
	(doc: unknown): boolean => findLegacyFields(doc).length === 0,
	'resume contains 1.x (legacy) fields',
)

/** Render one legacy issue as a migration hint. */
export function legacyMessage(issue: LegacyIssue): string {
	const hint = issue.successor
		? `"${issue.field}" → "${issue.successor}"`
		: `"${issue.field}" (no stable successor — 2.x dropped it)`
	return `${issue.path}: ${hint}`
}
