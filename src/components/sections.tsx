import type { ReactNode } from 'react'
import type { ResumeDocument } from '../types/resume'
import { Awards } from './Awards'
import { Certificates } from './Certificates'
import { isConferenceTalk } from './conferenceRouting'
import { Education } from './Education'
import { Interests } from './Interests'
import { Languages } from './Languages'
import { Projects } from './Projects'
import { Publications } from './Publications'
import { References } from './References'
import { Skills } from './Skills'
import { Summary } from './Summary'
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
		render: (r) => <Summary summary={r.basics?.summary} />,
	},
	{ key: 'work', render: (r) => <WorkExperience work={r.work} /> },
	{ key: 'education', render: (r) => <Education education={r.education} /> },
	{ key: 'volunteer', render: (r) => <Volunteer volunteer={r.volunteer} /> },
	{ key: 'projects', render: (r) => <Projects projects={r.projects} /> },
]

export const SIDEBAR_SECTIONS: SectionDef[] = [
	{
		key: 'skills',
		render: (r) => <Skills skills={r.skills} />,
	},
	{
		key: 'languages',
		render: (r) => <Languages languages={r.languages} />,
	},
	// ADR 0005: publications split by `type` — talk-like items render in
	// Conferences, everything else (incl. untyped) in Publications.
	// Each publication renders exactly once; both entries may empty out.
	{
		key: 'conferences',
		render: (r) => (
			<Publications
				title='sections.conferences'
				urlLabelKey='common.viewTalk'
				publications={r.publications?.filter(isConferenceTalk)}
			/>
		),
	},
	{
		key: 'publications',
		render: (r) => (
			<Publications
				publications={r.publications?.filter((p) => !isConferenceTalk(p))}
			/>
		),
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
		render: (r) => <Interests interests={r.interests} />,
	},
]
