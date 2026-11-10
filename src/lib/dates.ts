/**
 * Resume dates, the theme-wide way — the pure side: a JSON Resume
 * date field (ISO-8601 with optional month/day, or free text) is
 * parsed as a *local* date — a UTC-midnight parse would shift the day
 * for viewers west of UTC.
 *
 * Rendering happens through the i18n provider
 * (`DateRange` / `DateStamp` in `components/ui/ResumeDate.tsx`), so
 * locale and timezone come from it. The two values the presenters
 * need are always *passed in* rather than read: "now" (never
 * `new Date()`) keeps open-ended durations pin-able in tests and
 * consumers like work grouping deterministic, and the duration words
 * (the `DurationMessages` record, resolved from the catalog at the
 * seam) keep this module free of the i18n adapter.
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
 * The localized duration words — resolved from the i18n catalog at the
 * rendering seam and passed in as data. The module never imports the
 * i18n adapter; a locale missing one of these surfaces as a wrong word,
 * policed by the catalog key-parity test, not here.
 */
export interface DurationMessages {
	year: string
	years: string
	month: string
	months: string
	/** The whole span is under a month */
	lessThanMonth: string
}

/**
 * An approximate duration ("3 years, 2 months"), localized through the
 * passed-in words instead of date-fns' hardwired English.
 */
export function formatDuration(
	start: Date,
	end: Date,
	messages: DurationMessages,
): string {
	let months =
		(end.getFullYear() - start.getFullYear()) * 12 +
		(end.getMonth() - start.getMonth())
	if (end.getDate() < start.getDate()) months -= 1
	months = Math.max(0, months)
	const years = Math.floor(months / 12)
	const rest = months % 12

	if (months === 0) return messages.lessThanMonth

	const parts: string[] = []
	if (years > 0) {
		parts.push(`${years} ${years === 1 ? messages.year : messages.years}`)
	}
	if (rest > 0) {
		parts.push(`${rest} ${rest === 1 ? messages.month : messages.months}`)
	}
	return parts.join(', ')
}

export interface DatedItem {
	startDate?: string
	endDate?: string
}

/**
 * The date span of a group of dated items, the theme-wide way:
 * the earliest start, the latest end — where an *open-ended* item
 * counts as the passed "now" (never the wall clock) — plus whether
 * any item is still ongoing. The flag is data, not inference: the
 * presenters render "Present" from it, never from comparing the end
 * against "now".
 */
export interface DateSpan {
	start?: Date
	end?: Date
	/** Any item has no end date — the span is ongoing */
	open: boolean
}

export function dateSpan(items: DatedItem[], now: Date): DateSpan {
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
		open: items.some((i) => !i.endDate),
	}
}
