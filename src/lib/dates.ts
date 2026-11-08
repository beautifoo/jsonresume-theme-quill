/**
 * Resume dates, the theme-wide way — the pure side: a JSON Resume
 * date field (ISO-8601 with optional month/day, or free text) is
 * parsed as a *local* date — a UTC-midnight parse would shift the day
 * for viewers west of UTC.
 *
 * Rendering happens through the i18n provider
 * (`DateRange` / `DateStamp` in `components/ui/ResumeDate.tsx`), so
 * locale and timezone come from it; "now" is always *passed in*
 * (never `new Date()`), which keeps open-ended durations pin-able in
 * tests and consumers like work grouping deterministic.
 */

import type { useTranslations } from 'use-intl'

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
 * A localized, approximate duration ("3 years, 2 months") built from
 * the i18n duration messages instead of date-fns' hardwired English.
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

export interface DatedItem {
	startDate?: string
	endDate?: string
}

/**
 * The date span of a group of dated items, the theme-wide way:
 * the earliest start, and the latest end where an *open-ended*
 * item counts as the passed "now" (never the wall clock).
 */
export function dateSpan(
	items: DatedItem[],
	now: Date,
): { start?: Date; end?: Date } {
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
