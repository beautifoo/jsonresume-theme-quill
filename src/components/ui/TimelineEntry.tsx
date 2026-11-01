import type { FC, ReactNode } from 'react'
import { useFormatter, useTranslations } from 'use-intl'
import { cn } from '../../lib/utils'

interface TimelineEntryProps {
	startDate?: string
	endDate?: string
	children: ReactNode
	className?: string
}

/**
 * Parse a JSON Resume date (`YYYY-MM-DD` or `YYYY-MM`) as a *local* date,
 * so formatting is immune to the viewer's timezone (a UTC-midnight parse
 * would shift the day in western timezones).
 */
export function parseResumeDate(value: string): Date | undefined {
	const match = value.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/)
	if (!match) {
		const fallback = new Date(value)
		return Number.isNaN(fallback.getTime()) ? undefined : fallback
	}
	const [, year, month, day] = match
	return new Date(
		Number(year),
		Number(month ?? '1') - 1,
		Number(day ?? '1'),
	)
}

/**
 * A localized, approximate duration ("3 yrs, 2 mos") built from the
 * i18n duration messages instead of date-fns' hardwired English.
 */
export function formatDuration(
	start: Date,
	end: Date,
	t: ReturnType<typeof useTranslations>,
): string {
	let months =
		(end.getFullYear() - start.getFullYear()) * 12 +
		(end.getMonth() - start.getMonth())
	if (end.getDate() < start.getDate()) months -= 1
	months = Math.max(0, months)
	const years = Math.floor(months / 12)
	const rest = months % 12

	if (months === 0) return t('common.duration.lessThanMonth')

	const parts: string[] = []
	if (years > 0) {
		parts.push(
			`${years} ${years === 1 ? t('common.duration.year') : t('common.duration.years')}`,
		)
	}
	if (rest > 0) {
		parts.push(
			`${rest} ${rest === 1 ? t('common.duration.month') : t('common.duration.months')}`,
		)
	}
	return parts.join(', ')
}

/**
 * One dated entry on a timeline: the date range (with duration) above,
 * the entry content below. Open-ended roles read `… – Present`.
 */
export const TimelineEntry: FC<TimelineEntryProps> = ({
	startDate,
	endDate,
	children,
	className,
}) => {
	const f = useFormatter()
	const t = useTranslations()

	let range = ''
	let duration = ''
	const start = startDate ? parseResumeDate(startDate) : undefined
	const end = endDate ? parseResumeDate(endDate) : undefined

	if (start) {
		const startLabel = f.dateTime(start, {
			month: 'short',
			year: 'numeric',
		})
		range = end
			? f.dateTimeRange(start, end, {
					month: 'short',
					year: 'numeric',
				})
			: t('date.present', { start: startLabel })
		duration = formatDuration(start, end ?? new Date(), t)
	}

	return (
		<article className={cn('break-inside-avoid', className)}>
			{range && (
				<div className='mb-2 flex items-baseline gap-2 print:mb-1.5'>
					<time dateTime={startDate} className='folio-meta font-medium text-ink-3'>
						{range}
					</time>
					{duration && (
						<time className='folio-meta opacity-80'>({duration})</time>
					)}
				</div>
			)}
			{children}
		</article>
	)
}
