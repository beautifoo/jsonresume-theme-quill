import { type FC, memo } from 'react'
import { cn } from '../lib/utils'
import type { ResumeSchema } from '../types/resumeSchema'
import { Awards } from './Awards'
import { Certificates } from './Certificates'
import { Education } from './Education'
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
export type ThemeVariant = 'folio' | 'graphite'

interface ResumeProps {
	resume: ResumeSchema
	/**
	 * `double` (default): main column + sidebar. `single`: everything in
	 * one column. The DOM order is identical in both — main sections
	 * first, sidebar after — so the output stays ATS-parseable.
	 */
	layout?: LayoutMode
	/** Visual identity knobs (accent / display face). */
	variant?: ThemeVariant
}

export const Resume: FC<ResumeProps> = memo(
	({ resume, layout = 'double', variant = 'folio' }) => {
		const {
			basics,
			work,
			education,
			skills,
			projects,
			awards,
			certificates,
			publications,
			languages,
			interests,
			references,
			volunteer,
		} = resume

		if (!basics) return null

		return (
			<div
				className={cn(
					'min-h-dvh bg-bg text-ink-2',
					variant !== 'folio' && `variant-${variant}`,
				)}
			>
				<div className='mx-auto max-w-[850px] px-5 py-10 sm:px-8 print:max-w-none print:px-0 print:py-0'>
					<Header basics={basics} />

					<div
						className={cn(
							'mt-9 flex flex-col gap-8 print:mt-6 print:gap-6',
							layout === 'double' && 'md:flex-row md:gap-9',
						)}
					>
						{/* Main column */}
						<div className={cn('min-w-0', layout === 'double' && 'md:w-[60%]')}>
							{basics.summary && <Summary summary={basics.summary} />}
							{work && work.length > 0 && <WorkExperience work={work} />}
							{education && education.length > 0 && (
								<Education education={education} />
							)}
							{projects && projects.length > 0 && (
								<Projects projects={projects} />
							)}
							{volunteer && volunteer.length > 0 && (
								<Volunteer volunteer={volunteer} />
							)}
						</div>

						{/* Sidebar: after the main column in the DOM in
						    both layout modes (ATS-safe document order) */}
						<div
							className={cn(
								'min-w-0',
								layout === 'double' && 'md:w-[36%] md:pl-1',
							)}
						>
							{skills && skills.length > 0 && <Skills skills={skills} />}
							{languages && languages.length > 0 && (
								<Languages languages={languages} />
							)}
							{publications && publications.length > 0 && (
								<Publications publications={publications} />
							)}
							{certificates && certificates.length > 0 && (
								<Certificates certificates={certificates} />
							)}
							{awards && awards.length > 0 && <Awards awards={awards} />}
							{references && references.length > 0 && (
								<References references={references} />
							)}
							{interests && interests.length > 0 && (
								<Interests interests={interests} />
							)}
						</div>
					</div>
				</div>
			</div>
		)
	},
)

export default Resume
