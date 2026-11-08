import type { FC } from 'react'
import { useFormatter, useNow, useTranslations } from 'use-intl'
import type { Work } from '../types/resume'
import { GrowthIndicator } from './ui/GrowthIndicator'
import { DateRange, dateSpan, parseResumeDate } from './ui/ResumeDate'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

interface WorkExperienceProps {
	work?: Work[]
}

const GroupHeader: FC<{
	company: string
	start?: Date
	end?: Date
	roles: number
}> = ({ company, start, end, roles }) => {
	const f = useFormatter()
	const t = useTranslations()

	const total =
		start && end
			? f.dateTimeRange(start, end, { month: 'short', year: 'numeric' })
			: ''

	return (
		<div className='mb-3 flex items-baseline justify-between gap-3 print:mb-2'>
			<span className='text-[0.9rem] font-semibold text-ink'>{company}</span>
			<span className='folio-meta shrink-0'>
				{total}
				{roles > 1 ? ` • ${t('common.roleCount', { count: roles })}` : ''}
			</span>
		</div>
	)
}

/**
 * Work history. Entries are sorted reverse-chronologically and grouped
 * **by company, regardless of contiguity** — a return to a former
 * employer merges into one block, and unsorted input renders correctly
 * either way. All date rendering (rows, spans, durations) is the
 * ResumeDate module's business; this component only groups.
 */

export const WorkExperience: FC<WorkExperienceProps> = ({ work }) => {
	const now = useNow()

	if (!work || work.length === 0) return null

	const sorted = [...work].sort((a, b) => {
		const as = a.startDate ? parseResumeDate(a.startDate) : undefined
		const bs = b.startDate ? parseResumeDate(b.startDate) : undefined
		if (!as && !bs) return 0
		if (!as) return 1
		if (!bs) return -1
		return bs.getTime() - as.getTime()
	})

	const groups = new Map<string, Work[]>()
	for (const item of sorted) {
		const company = item.name || ''
		const group = groups.get(company)
		if (group) group.push(item)
		else groups.set(company, [item])
	}

	return (
		<TimelineSection title='sections.work'>
			{[...groups.entries()].map(([company, items]) => {
				const showHeader = items.length > 1
				// Span of the whole group for the header metadata:
				// earliest start, latest end, open-ended roles count as "now".
				const span = dateSpan(items, now)

				return (
					<TimelineEntry
						key={company}
						startDate={showHeader && span.start ? undefined : items[0]?.startDate}
						endDate={showHeader ? undefined : items[0]?.endDate}
					>
						{showHeader && (
							<GroupHeader
								company={company}
								start={span.start}
								end={span.end}
								roles={items.length}
							/>
						)}
						<div className='space-y-5 print:space-y-3.5'>
							{items.map((workItem, wi) => (
								<div key={wi}>
									{showHeader && (
										<DateRange
											start={workItem.startDate}
											end={workItem.endDate}
											className='mb-1.5 print:mb-1'
											rangeClassName='folio-meta'
										/>
									)}
									<SectionCard
										title={workItem.position}
										subtitle={showHeader ? undefined : workItem.name}
										url={workItem.url}
										location={workItem.location}
										summary={workItem.summary}
										highlights={workItem.highlights}
										tags={workItem.keywords}
										addonAfterTitle={
											workItem.growth ? (
												<GrowthIndicator {...workItem.growth} />
											) : undefined
										}
									/>
								</div>
							))}
						</div>
					</TimelineEntry>
				)
			})}
		</TimelineSection>
	)
}
