import type { FC } from 'react'
import { useFormatter, useNow, useTranslations } from 'use-intl'
import { cn } from '../../lib/utils'

/**
 * A resume date, the theme-wide way: a JSON Resume date field
 * (ISO-8601 with optional month/day, or free text) is parsed as a
 * *local* date — a UTC-midnight parse would shift the day for viewers
 * west of UTC — and rendered through the i18n provider, so locale,
 * timezone, and "now" all come from it. "Now" from the provider (not
 * `new Date()`) keeps open-ended durations pin-able in tests.
 */

export function parseResumeDate(value: string): Date | undefined {
	const match = value.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/)
	if (!match) {
		const fallback = new Date(value)
		return Number.isNaN(fallback.getTime()) ? undefined : fallback
	}
	const [, year, month, day] = match
	return new Date(Number(year), Number(month ?? '1') - 1, Number(day ?? '1'))
}

/**
 * A localized, approximate duration ("3 years, 2 months") built from the
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

interface DatedItem {
	startDate?: string
	endDate?: string
}

/**
 * The date span of a group of dated items, the theme-wide way:
 * the earliest start, and the latest end where an *open-ended*
 * item counts as the provider's "now" (never the wall clock).
 */
export function dateSpan(items: DatedItem[], now: Date): { start?: Date; end?: Date } {
	const starts = items
		.map((i) => (i.startDate ? parseResumeDate(i.startDate) : undefined))
		.filter((d): d is Date => Boolean(d))
	const ends = [
		...items
			.map((i) => (i.endDate ? parseResumeDate(i.endDate) : undefined))
			.filter((d): d is Date => Boolean(d)),
		...items.filter((i) => !i.endDate).map(() => now),
	]
	return {
		start: starts.length ? starts.reduce((a, b) => (a < b ? a : b)) : undefined,
		end: ends.length ? ends.reduce((a, b) => (a > b ? a : b)) : undefined,
	}
}

interface DateRangeProps {
	start?: string
	end?: string
	className?: string
	/**
	 * Styling of the range itself — the default is the timeline row
	 * (emphasized); grouped entries use the quiet `folio-meta` form.
	 */
	rangeClassName?: string
}

/**
 * One row of entry metadata: the localized range ("Mar 2021 –
 * Present") with an approximate duration. Open-ended ranges read
 * `… – Present` and measure their duration from the provider's "now".
 */
export const DateRange: FC<DateRangeProps> = ({
	start,
	end,
	className,
	rangeClassName = 'folio-meta font-medium text-ink-3',
}) => {
	const f = useFormatter()
	const t = useTranslations()
	const now = useNow()

	const parsedStart = start ? parseResumeDate(start) : undefined
	const parsedEnd = end ? parseResumeDate(end) : undefined

	if (!parsedStart) return null

	const startLabel = f.dateTime(parsedStart, {
		month: 'short',
		year: 'numeric',
	})
	const range = parsedEnd
		? f.dateTimeRange(parsedStart, parsedEnd, {
				month: 'short',
				year: 'numeric',
			})
		: t('date.present', { start: startLabel })
	const duration = formatDuration(parsedStart, parsedEnd ?? now, t)

	return (
		<div
			className={cn('mb-2 flex items-baseline gap-2 print:mb-1.5', className)}
		>
			<time dateTime={start} className={rangeClassName}>
				{range}
			</time>
			{duration && <time className='folio-meta opacity-80'>({duration})</time>}
		</div>
	)
}

interface DateStampProps {
	date?: string
	/** `month` (default) renders "Mar 2021"; `year` renders "2021" */
	precision?: 'month' | 'year'
	className?: string
}

/**
 * A single localized date (awards, certificates, publications).
 * Deliberately unstyled — it inherits the surrounding metadata row.
 */
export const DateStamp: FC<DateStampProps> = ({
	date,
	precision = 'month',
	className,
}) => {
	const f = useFormatter()

	if (!date) return null
	const parsed = parseResumeDate(date)
	if (!parsed) return null

	return (
		<time dateTime={date} className={className}>
			{f.dateTime(
				parsed,
				precision === 'year'
					? { year: 'numeric' }
					: { month: 'short', year: 'numeric' },
			)}
		</time>
	)
}
