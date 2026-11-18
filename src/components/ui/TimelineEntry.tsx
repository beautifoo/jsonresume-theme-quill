import type { FC, ReactNode } from 'react'
import { DateRange } from './ResumeDate'

interface TimelineEntryProps {
	startDate?: string
	endDate?: string
	children: ReactNode
	className?: string
}

/**
 * One dated entry on a timeline: the date range row (with duration)
 * above, the entry content below. Open-ended roles read `… – Present`.
 *
 * Entries may break across pages in print (a block that merely does
 * not fit would otherwise push whole entries onto the next page and
 * leave big gaps); the date row keeps its content with it, though.
 */
export const TimelineEntry: FC<TimelineEntryProps> = ({
	startDate,
	endDate,
	children,
	className,
}) => (
	<article className={className}>
		<DateRange
			start={startDate}
			end={endDate}
			className='print:break-after-avoid'
		/>
		{children}
	</article>
)
