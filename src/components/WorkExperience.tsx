import type { FC } from 'react'
import { useFormatter, useNow, useTranslations } from 'use-intl'
import type { Work } from '../types/resume'
import { GrowthIndicator } from './ui/GrowthIndicator'
import { DateRange } from './ui/ResumeDate'
import { Section } from './ui/Section'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { groupWork } from './workGrouping'

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
 * Work history: a presentation over the **Work group** rule — the
 * grouping itself (sort, by employer, regardless of contiguity) is
 * the `workGrouping` module's business. Single-role blocks render a
 * plain date row; grouped blocks get a company header with the total
 * span, and a quiet date row per role.
 */
export const WorkExperience: FC<WorkExperienceProps> = ({ work }) => {
	const now = useNow()

	if (!work || work.length === 0) return null

	return (
		<Section title='sections.work' variant='timeline'>
			{groupWork(work, now).map((group) => {
				const showHeader = group.grouped

				return (
					<TimelineEntry
						key={group.company}
						startDate={
							showHeader && group.start ? undefined : group.items[0]?.startDate
						}
						endDate={showHeader ? undefined : group.items[0]?.endDate}
					>
						{showHeader && (
							<GroupHeader
								company={group.company}
								start={group.start}
								end={group.end}
								roles={group.items.length}
							/>
						)}
						<div className='space-y-5 print:space-y-3.5'>
							{group.items.map((workItem, wi) => (
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
		</Section>
	)
}
