import type { FC, ReactNode } from 'react'
import type { SectionTitleKey } from '../../i18n/config'
import { cn } from '../../lib/utils'
import { SectionTitle } from './SectionTitle'

export type SectionVariant = 'timeline' | 'list'

interface SectionProps {
	/** Translation key, e.g. `sections.work` */
	title: SectionTitleKey
	/**
	 * `timeline`: a hairline rule runs the full height of the entries,
	 * each entry sitting beside it (work, education, projects, volunteer).
	 * `list`: a quiet stack (sidebar entries, taxonomies, the about block).
	 * Each variant owns its entry rhythm — the timeline's rule, the
	 * stack's gutter — so callers never retype it.
	 */
	variant: SectionVariant
	children: ReactNode
	className?: string
	/** Extra classes for the content wrapper (`list` variant) */
	contentClassName?: string
}

/**
 * A resume section: the shared scaffolding — margin rule, `section-*`
 * id, `aria-labelledby`, and the accent SectionTitle — with the content
 * treatment as the only difference. Both variants share the ATS-safe
 * document order; the DOM is a flat semantic flow (ADR 0001).
 */
export const Section: FC<SectionProps> = ({
	title,
	variant,
	children,
	className,
	contentClassName,
}) => {
	const leaf = title.split('.').pop() ?? title
	const sectionId = `section-${leaf}`
	const titleId = `${sectionId}-title`

	return (
		<section
			className={cn('mt-9 first:mt-0 print:mt-6 print:first:mt-0', className)}
			id={sectionId}
			aria-labelledby={titleId}
		>
			<SectionTitle title={title} id={titleId} />
			{variant === 'timeline' ? (
				<div className='mt-4 space-y-6 border-l border-line pl-5 print:mt-3 print:space-y-4 print:pl-4'>
					{children}
				</div>
			) : (
				<div
					className={cn(
						'mt-3 space-y-3 print:mt-2 print:space-y-2.5',
						contentClassName,
					)}
				>
					{children}
				</div>
			)}
		</section>
	)
}
