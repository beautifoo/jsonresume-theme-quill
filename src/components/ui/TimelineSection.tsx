import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { SectionTitle } from './SectionTitle'

interface TimelineSectionProps {
	/** Translation key, e.g. `sections.work` */
	title: string
	children: ReactNode
	className?: string
}

/**
 * A dated section (work, education, …): one hairline rule runs the full
 * height of the entries; each entry sits beside it.
 */
export const TimelineSection: FC<TimelineSectionProps> = ({
	title,
	children,
	className,
}) => {
	const titleId = `section-title-${title.toLowerCase().replace(/\s+/g, '-')}`

	return (
		<section
			className={cn('mt-9 first:mt-0 print:mt-6 print:first:mt-0', className)}
			aria-labelledby={titleId}
		>
			<SectionTitle title={title} id={titleId} />
			<div className='mt-4 space-y-6 border-l border-line pl-5 print:mt-3 print:space-y-4 print:pl-4'>
				{children}
			</div>
		</section>
	)
}
