import { type FC, Fragment, memo, type ReactNode } from 'react'
import type { Locale } from '../i18n/config'
import { cn } from '../lib/utils'
import type { ResumeDocument } from '../types/resume'
import { Awards } from './Awards'
import { Certificates } from './Certificates'
import { Education } from './Education'
import { FolioProvider } from './FolioProvider'
import { Header } from './Header'
import { Interests } from './Interests'
import { Languages } from './Languages'
import { Projects } from './Projects'
import { Publications } from './Publications'
import { References } from './References'
import { Skills } from './Skills'
import { Summary } from './Summary'
import { Volunteer } from './Volunteer'
import { WorkExperience } from './WorkExperience'

export type LayoutMode = 'single' | 'double'
export type ThemeVariant = 'folio' | 'folio-monochrome'

/**
 * The **ATS-safe document order** as one table (ADR 0001): main
 * sections first, sidebar sections after, in a flat semantic flow.
 * The `double` layout repositions the sidebar visually, never the DOM.
 * Each section owns its emptiness guard — an empty section renders
 * nothing, the order does not shift.
 */
interface SectionDef {
	key: string
	render: (resume: ResumeDocument) => ReactNode
}

const MAIN_SECTIONS: SectionDef[] = [
	{
		key: 'summary',
		render: (r) => <Summary summary={r.basics?.summary ?? ''} />,
	},
	{ key: 'work', render: (r) => <WorkExperience work={r.work} /> },
	{ key: 'education', render: (r) => <Education education={r.education} /> },
	{ key: 'projects', render: (r) => <Projects projects={r.projects} /> },
	{ key: 'volunteer', render: (r) => <Volunteer volunteer={r.volunteer} /> },
]

const SIDEBAR_SECTIONS: SectionDef[] = [
	{ key: 'skills', render: (r) => <Skills skills={r.skills} /> },
	{ key: 'languages', render: (r) => <Languages languages={r.languages} /> },
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
	{ key: 'interests', render: (r) => <Interests interests={r.interests} /> },
]

interface ResumeProps {
	resume: ResumeDocument
	/**
	 * `double` (default): main column + sidebar. `single`: everything in
	 * one column. Applied as the `layout-*` class on the root, which
	 * presets the `--folio-cols-wide` token — hosts can switch layout
	 * by setting either, without this prop. The DOM order is identical
	 * in both — main sections first, sidebar after — so the output stays
	 * ATS-parseable.
	 */
	layout?: LayoutMode
	/** Visual identity knobs (accent / display face). */
	variant?: ThemeVariant
	/** Explicit locale — otherwise the resume's declared language, else English */
	locale?: Locale
	/** Pinned "now" (tests) — open-ended durations measure from it */
	now?: Date
}

/**
 * A resume document, rendered to the Folio theme. The i18n/icon
 * runtime (the **Folio provider**) is installed behind the interface —
 * callers and tests need only know `resume`, plus the optional
 * `locale` / `now` overrides; the Resume date contract is enforced
 * inside, not by the caller.
 */
export const Resume: FC<ResumeProps> = memo(
	({ resume, layout = 'double', variant = 'folio', locale, now }) => {
		const { basics } = resume

		if (!basics) return null

		return (
			<FolioProvider resume={resume} locale={locale} now={now}>
				<div
					className={cn(
						'folio-resume min-h-dvh bg-bg text-ink-2',
						`layout-${layout}`,
						variant !== 'folio' && `variant-${variant}`,
					)}
				>
					<div className='mx-auto max-w-[850px] px-5 py-10 sm:px-8 print:max-w-none print:px-0 print:py-0'>
						<Header basics={basics} />

						<div className='folio-columns mt-9 print:mt-6'>
							{/* Main column */}
							<div className='min-w-0'>
								{MAIN_SECTIONS.map((section) => (
									<Fragment key={section.key}>
										{section.render(resume)}
									</Fragment>
								))}
							</div>

							{/* Sidebar: after the main column in the DOM in both
							    layout modes (ATS-safe document order);
							    wide-canvas geometry from --folio-cols-wide */}
							<div className='min-w-0'>
								{SIDEBAR_SECTIONS.map((section) => (
									<Fragment key={section.key}>
										{section.render(resume)}
									</Fragment>
								))}
							</div>
						</div>
					</div>
				</div>
			</FolioProvider>
		)
	},
)

export default Resume
