/**
 * The theme's **stable** (JSON Resume 2.x) schema, as a valibot schema.
 *
 * Transcribed by hand from `@jsonresume/types` (which upstream generates
 * from `@jsonresume/schema`); the type-check gate keeps the two in sync —
 * an upstream schema bump that changes the shape breaks CI until this
 * file catches up.
 *
 * This is a build-time gate (see `resume.ts`), never part of the
 * published bundle: valibot is a devDependency.
 */

import * as v from 'valibot'
import type {
	Resume as ResumeTypes,
	ResumeBasics,
	ResumeLocation,
	ResumeProfile,
	WorkItem,
	VolunteerItem,
	EducationItem,
	AwardItem,
	CertificateItem,
	PublicationItem,
	SkillItem,
	LanguageItem,
	InterestItem,
	ReferenceItem,
	ProjectItem,
	ResumeMeta,
} from '@jsonresume/types'

/**
 * ISO-8601 with each section after the year optional (2023, 2023-04,
 * 2023-04-05). Free text is tolerated — the date module degrades to
 * "unparseable, not rendered".
 */
const iso8601 = v.string()

const locationFields = v.object({
	address: v.optional(v.string()),
	postalCode: v.optional(v.string()),
	city: v.optional(v.string()),
	countryCode: v.optional(v.string()),
	region: v.optional(v.string()),
})

const resumeLocation = v.optional(locationFields)

const resumeProfile = v.object({
	network: v.optional(v.string()),
	username: v.optional(v.string()),
	url: v.optional(v.string()),
})

export const resumeBasics = v.object({
	name: v.optional(v.string()),
	label: v.optional(v.string()),
	pronouns: v.optional(v.string()),
	image: v.optional(v.string()),
	email: v.optional(v.string()),
	phone: v.optional(v.string()),
	url: v.optional(v.string()),
	summary: v.optional(v.string()),
	location: resumeLocation,
	profiles: v.optional(v.array(resumeProfile)),
})

const workLocation = v.optional(v.union([v.string(), locationFields]))

export const workItem = v.object({
	name: v.optional(v.string()),
	location: workLocation,
	description: v.optional(v.string()),
	position: v.optional(v.string()),
	url: v.optional(v.string()),
	startDate: v.optional(iso8601),
	endDate: v.optional(iso8601),
	summary: v.optional(v.string()),
	highlights: v.optional(v.array(v.string())),
	keywords: v.optional(v.array(v.string())),
})

export const volunteerItem = v.object({
	organization: v.optional(v.string()),
	location: workLocation,
	position: v.optional(v.string()),
	url: v.optional(v.string()),
	startDate: v.optional(iso8601),
	endDate: v.optional(iso8601),
	summary: v.optional(v.string()),
	highlights: v.optional(v.array(v.string())),
})

export const educationItem = v.object({
	institution: v.optional(v.string()),
	location: workLocation,
	url: v.optional(v.string()),
	area: v.optional(v.string()),
	studyType: v.optional(v.string()),
	startDate: v.optional(iso8601),
	endDate: v.optional(iso8601),
	score: v.optional(v.string()),
	courses: v.optional(v.array(v.string())),
	summary: v.optional(v.string()),
})

export const awardItem = v.object({
	title: v.optional(v.string()),
	date: v.optional(iso8601),
	awarder: v.optional(v.string()),
	summary: v.optional(v.string()),
})

export const certificateItem = v.object({
	name: v.optional(v.string()),
	date: v.optional(iso8601),
	url: v.optional(v.string()),
	credentialId: v.optional(v.string()),
	issuer: v.optional(v.string()),
	expiryDate: v.optional(iso8601),
	summary: v.optional(v.string()),
})

const publicationIdentifiers = v.object({
	doi: v.optional(v.string()),
	isbn: v.optional(v.string()),
	arxiv: v.optional(v.string()),
})

export const publicationItem = v.object({
	name: v.optional(v.string()),
	authors: v.optional(v.array(v.string())),
	publisher: v.optional(v.string()),
	releaseDate: v.optional(iso8601),
	volume: v.optional(v.string()),
	issue: v.optional(v.string()),
	pages: v.optional(v.string()),
	identifiers: v.optional(publicationIdentifiers),
	url: v.optional(v.string()),
	summary: v.optional(v.string()),
	type: v.optional(v.string()),
})

export const skillItem = v.object({
	name: v.optional(v.string()),
	level: v.optional(v.string()),
	keywords: v.optional(v.array(v.string())),
})

export const languageItem = v.object({
	language: v.optional(v.string()),
	fluency: v.optional(v.string()),
})

export const interestItem = v.object({
	name: v.optional(v.string()),
	keywords: v.optional(v.array(v.string())),
})

export const referenceItem = v.object({
	name: v.optional(v.string()),
	reference: v.optional(v.string()),
	relationship: v.optional(v.string()),
	organization: v.optional(v.string()),
	date: v.optional(iso8601),
	availableOnRequest: v.optional(v.boolean()),
})

export const projectItem = v.object({
	name: v.optional(v.string()),
	summary: v.optional(v.string()),
	description: v.optional(v.string()),
	highlights: v.optional(v.array(v.string())),
	keywords: v.optional(v.array(v.string())),
	startDate: v.optional(iso8601),
	endDate: v.optional(iso8601),
	url: v.optional(v.string()),
	roles: v.optional(v.array(v.string())),
	entity: v.optional(v.string()),
	type: v.optional(v.string()),
})

const resumeMeta = v.object({
	canonical: v.optional(v.string()),
	version: v.optional(v.string()),
	lastModified: v.optional(iso8601),
})

export const resumeSchema = v.object({
	$schema: v.optional(v.string()),
	basics: v.optional(resumeBasics),
	objective: v.optional(v.string()),
	work: v.optional(v.array(workItem)),
	volunteer: v.optional(v.array(volunteerItem)),
	education: v.optional(v.array(educationItem)),
	awards: v.optional(v.array(awardItem)),
	certificates: v.optional(v.array(certificateItem)),
	publications: v.optional(v.array(publicationItem)),
	skills: v.optional(v.array(skillItem)),
	languages: v.optional(v.array(languageItem)),
	interests: v.optional(v.array(interestItem)),
	references: v.optional(v.array(referenceItem)),
	projects: v.optional(v.array(projectItem)),
	meta: v.optional(resumeMeta),
})

/**
 * The shape of a stable resume document, as the theme consumes it.
 */
export type Resume = v.InferOutput<typeof resumeSchema>

// The type-check gate: mutual assignability with the generated
// `@jsonresume/types`. An upstream schema bump that changes the shape
// breaks these assertions (and therefore CI) until the transcription
// above catches up. Mutual (not `Equals`) because the generated types
// additionally carry `custom` and a free-form index signature.
type Bidirectional<A, B> = [A] extends [B]
	? [B] extends [A]
		? true
		: false
	: false
type Expect<T extends true> = T

declare const _gate: [
	Expect<Bidirectional<Resume, ResumeTypes>>,
	Expect<Bidirectional<v.InferOutput<typeof resumeBasics>, ResumeBasics>>,
	Expect<Bidirectional<v.InferOutput<typeof locationFields>, ResumeLocation>>,
	Expect<Bidirectional<v.InferOutput<typeof resumeProfile>, ResumeProfile>>,
	Expect<Bidirectional<v.InferOutput<typeof workItem>, WorkItem>>,
	Expect<Bidirectional<v.InferOutput<typeof volunteerItem>, VolunteerItem>>,
	Expect<Bidirectional<v.InferOutput<typeof educationItem>, EducationItem>>,
	Expect<Bidirectional<v.InferOutput<typeof awardItem>, AwardItem>>,
	Expect<Bidirectional<v.InferOutput<typeof certificateItem>, CertificateItem>>,
	Expect<Bidirectional<v.InferOutput<typeof publicationItem>, PublicationItem>>,
	Expect<Bidirectional<v.InferOutput<typeof skillItem>, SkillItem>>,
	Expect<Bidirectional<v.InferOutput<typeof languageItem>, LanguageItem>>,
	Expect<Bidirectional<v.InferOutput<typeof interestItem>, InterestItem>>,
	Expect<Bidirectional<v.InferOutput<typeof referenceItem>, ReferenceItem>>,
	Expect<Bidirectional<v.InferOutput<typeof projectItem>, ProjectItem>>,
	Expect<Bidirectional<v.InferOutput<typeof resumeMeta>, ResumeMeta>>,
]
