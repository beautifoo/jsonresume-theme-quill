import type { ReactNode } from 'react'
import type { ResumeDocument } from '../types/resume'
import { Awards } from './Awards'
import { Certificates } from './Certificates'
import { Education } from './Education'
import { Projects } from './Projects'
import { Publications } from './Publications'
import { References } from './References'
import { Summary } from './Summary'
import { Taxonomy } from './ui/Taxonomy'
import { Volunteer } from './Volunteer'
import { WorkExperience } from './WorkExperience'

/**
 * The **section registry**: the **ATS-safe document order** (ADR 0001)
 * as one table — main sections first, sidebar sections after, in a flat
 * semantic flow. `Resume` consumes it; the `double` layout repositions
 * the sidebar visually, never this order.
 *
 * Each def is a key plus the section's treatment. The emptiness guard
 * stays with the treatment (each section renders nothing when empty —
 * the order does not shift), so the registry holds the contract's
 * other half: which sections exist, and in what order.
 */
interface SectionDef {
	/** Registry key, e.g. `work` */
	key: string
	/** The section's treatment — renders nothing when the section is empty */
	render: (resume: ResumeDocument) => ReactNode
}

export const MAIN_SECTIONS: SectionDef[] = [
	{
		key: 'summary',
		render: (r) => <Summary summary={r.basics?.summary ?? ''} />,
	},
	{ key: 'work', render: (r) => <WorkExperience work={r.work} /> },
	{ key: 'education', render: (r) => <Education education={r.education} /> },
	{ key: 'projects', render: (r) => <Projects projects={r.projects} /> },
	{ key: 'volunteer', render: (r) => <Volunteer volunteer={r.volunteer} /> },
]

export const SIDEBAR_SECTIONS: SectionDef[] = [
	{
		key: 'skills',
		render: (r) => (
			<Taxonomy
				title='sections.skills'
				entries={(r.skills ?? []).map((skill) => ({
					name: skill.name ?? '',
					value: skill.level,
					keywords: skill.keywords,
				}))}
			/>
		),
	},
	{
		key: 'languages',
		render: (r) => (
			<Taxonomy
				title='sections.languages'
				entries={(r.languages ?? []).map((language) => ({
					name: language.language ?? '',
					value: language.fluency,
				}))}
			/>
		),
	},
	{
		key: 'publications',
		render: (r) => <Publications publications={r.publications} />,
	},
	{
		key: 'certificates',
		render: (r) => <Certificates certificates={r.certificates} />,
	},
	{ key: 'awards', render: (r) => <Awards awards={r.awards} /> },
	{
		key: 'references',
		render: (r) => <References references={r.references} />,
	},
	{
		key: 'interests',
		render: (r) => (
			<Taxonomy
				title='sections.interests'
				entries={(r.interests ?? []).map((interest) => ({
					name: interest.name ?? '',
					keywords: interest.keywords,
				}))}
			/>
		),
	},
]
