import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'
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
 */
export const TimelineEntry: FC<TimelineEntryProps> = ({
	startDate,
	endDate,
	children,
	className,
}) => (
	<article className={cn('break-inside-avoid', className)}>
		<DateRange start={startDate} end={endDate} />
		{children}
	</article>
)
