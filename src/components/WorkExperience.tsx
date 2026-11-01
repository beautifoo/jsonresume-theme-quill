import type { FC } from 'react'
import { useFormatter, useTranslations } from 'use-intl'
import type { ResumeSchema } from '../types/resumeSchema'
import { formatDuration, parseResumeDate } from './ui/TimelineEntry'
import { GrowthIndicator } from './ui/GrowthIndicator'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

// Extend the work item with optional custom growth metadata.
// These are non-standard JSONResume additions but harmless to consumers.
type Work = NonNullable<ResumeSchema['work']>[number] & {
	keywords?: string[]
	growth?: {
		label?: string // e.g., "3 Promotions" or "Rapid Growth"
		level?: number // 1-5 discrete representation
		percent?: number // 0-100 percentage bar
	}
}

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
 * either way.
 */
export const WorkExperience: FC<WorkExperienceProps> = ({ work }) => {
	const f = useFormatter()
	const t = useTranslations()

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

				// Span of the whole group for the header metadata
				const starts = items
					.map((i) => (i.startDate ? parseResumeDate(i.startDate) : undefined))
					.filter((d): d is Date => Boolean(d))
				const ends = items
					.map((i) => (i.endDate ? parseResumeDate(i.endDate) : undefined))
					.filter((d): d is Date => Boolean(d))
				const earliest = starts.length
					? starts.reduce((a, b) => (a < b ? a : b))
					: undefined
				// Latest end, treating open-ended (current) roles as "now"
				const now = new Date()
				const latest = [...ends, ...items.filter((i) => !i.endDate).map(() => now)]
					.reduce((a, b) => (a > b ? a : b))

				return (
					<TimelineEntry
						key={company}
						startDate={
							showHeader && earliest
								? undefined
								: items[0]?.startDate
						}
						endDate={showHeader ? undefined : items[0]?.endDate}
					>
						{showHeader && (
							<GroupHeader
								company={company}
								start={earliest}
								end={latest}
								roles={items.length}
							/>
						)}
						<div className='space-y-5 print:space-y-3.5'>
							{items.map((workItem, wi) => (
								<div key={wi}>
									{/* Individual dates only within a multi-role group */}
									{showHeader && workItem.startDate && (
										<div className='mb-1.5 flex items-baseline gap-2 print:mb-1'>
											<time
												dateTime={workItem.startDate}
												className='folio-meta'
											>
												{f.dateTime(
													parseResumeDate(workItem.startDate)!,
													{ month: 'short', year: 'numeric' },
												)}
												{workItem.endDate && (
													<>
														{' – '}
														{f.dateTime(
															parseResumeDate(workItem.endDate)!,
															{ month: 'short', year: 'numeric' },
														)}
													</>
												)}
												{workItem.endDate ? (
													''
												) : (
													<> – {t('common.present')}</>
												)}
											</time>
											{workItem.startDate && (
												<span className='folio-meta opacity-80'>
													(
													{formatDuration(
														parseResumeDate(workItem.startDate)!,
														workItem.endDate
															? parseResumeDate(workItem.endDate)!
															: now,
														t,
													)}
													)
												</span>
											)}
										</div>
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
