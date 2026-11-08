/**
 * The Resume date rendering seam: the i18n-backed presenters of the
 * date contract — `DateRange` (a row with range + duration) and
 * `DateStamp` (a single localized date). The pure side of the contract
 * (parsing, durations, spans) lives in the `dates` module, framework-free:
 * the duration words are resolved from the i18n catalog here, at the seam,
 * and passed to it as data.
 */

import type { FC } from 'react'
import { useFormatter, useNow, useTranslations } from 'use-intl'
import { formatDuration, parseResumeDate } from '../../lib/dates'
import { cn } from '../../lib/utils'

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
	const duration = formatDuration(parsedStart, parsedEnd ?? now, {
		year: t('common.duration.year'),
		years: t('common.duration.years'),
		month: t('common.duration.month'),
		months: t('common.duration.months'),
		lessThanMonth: t('common.duration.lessThanMonth'),
	})

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
