import { type FC, Fragment, memo } from 'react'
import type { Locale } from '../i18n/config'
import { cn } from '../lib/utils'
import type { ResumeDocument } from '../types/resume'
import { QuillProvider } from './QuillProvider'
import { Header } from './Header'
import { MAIN_SECTIONS, SIDEBAR_SECTIONS } from './sections'

export type LayoutMode = 'single' | 'double'
export type ThemeVariant = 'default' | 'monochrome'

interface ResumeProps {
	resume: ResumeDocument
	/**
	 * `double` (default): main column + sidebar. `single`: everything in
	 * one column. Applied as the `layout-*` class on the root, which
	 * presets the `--quill-cols-wide` token — hosts can switch layout
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
 * A resume document, rendered to the Quill theme. The section order
 * comes from the **section registry** (`sections.tsx`) — main column
 * first, sidebar after, in a flat semantic flow (ADR 0001); the i18n
 * and icon runtime (the **Quill provider**) is installed behind the
 * interface, so callers and tests need only know `resume`, plus the
 * optional `layout` / `variant` / `locale` / `now` overrides.
 */
export const Resume: FC<ResumeProps> = memo(
	({ resume, layout = 'double', variant = 'default', locale, now }) => {
		const { basics } = resume

		if (!basics) return null

		return (
			<QuillProvider resume={resume} locale={locale} now={now}>
				<div
					className={cn(
						'quill-resume min-h-dvh bg-bg text-ink-2',
						`layout-${layout}`,
						variant !== 'default' && `variant-${variant}`,
					)}
				>
					<div className='mx-auto max-w-[850px] px-5 py-10 sm:px-8 print:max-w-none print:px-0 print:py-0'>
						<Header basics={basics} />

						<div className='quill-columns mt-9 print:mt-6'>
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
							    wide-canvas geometry from --quill-cols-wide */}
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
			</QuillProvider>
		)
	},
)

export default Resume
