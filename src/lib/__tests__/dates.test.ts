import { describe, expect, it } from 'vitest'
import {
	type DurationMessages,
	dateSpan,
	formatDuration,
	parseResumeDate,
} from '../dates'

// The English duration words, the way the rendering seam resolves them
// from the i18n catalog — the pure module only ever sees data.
const en: DurationMessages = {
	year: 'year',
	years: 'years',
	month: 'month',
	months: 'months',
	lessThanMonth: 'Less than a month',
}

const d = (...args: number[]) => new Date(...(args as [number, number, number]))

describe('parseResumeDate', () => {
	it('parses ISO dates as local dates, immune to the viewer timezone', () => {
		// A UTC-midnight parse of the same string would shift the day
		// for viewers west of UTC; the local parse must not.
		const dt = parseResumeDate('2021-03-05')
		expect(dt?.getFullYear()).toBe(2021)
		expect(dt?.getMonth()).toBe(2)
		expect(dt?.getDate()).toBe(5)
	})

	it('parses year-month dates to the first of the month', () => {
		const dt = parseResumeDate('2021-03')
		expect(dt?.getMonth()).toBe(2)
		expect(dt?.getDate()).toBe(1)
	})

	it('returns undefined for unparseable values', () => {
		expect(parseResumeDate('someday')).toBeUndefined()
	})
})

describe('formatDuration', () => {
	it('formats years and months', () => {
		expect(formatDuration(d(2021, 2, 1), d(2024, 4, 15), en)).toBe(
			'3 years, 2 months',
		)
	})

	it('uses the singular forms', () => {
		expect(formatDuration(d(2023, 0, 1), d(2024, 0, 1), en)).toBe('1 year')
		expect(formatDuration(d(2023, 0, 1), d(2023, 1, 1), en)).toBe('1 month')
	})

	it('formats years or months alone', () => {
		expect(formatDuration(d(2021, 0, 1), d(2023, 0, 1), en)).toBe('2 years')
		expect(formatDuration(d(2023, 0, 1), d(2023, 3, 1), en)).toBe('3 months')
	})

	it('reports sub-month spans', () => {
		expect(formatDuration(d(2023, 4, 10), d(2023, 4, 20), en)).toBe(
			'Less than a month',
		)
	})

	it('clamps an end before the start to the sub-month case', () => {
		expect(formatDuration(d(2023, 5, 1), d(2023, 0, 1), en)).toBe(
			'Less than a month',
		)
	})

	it('is language-agnostic — the words come from the record', () => {
		const it: DurationMessages = {
			year: 'anno',
			years: 'anni',
			month: 'mese',
			months: 'mesi',
			lessThanMonth: 'Meno di un mese',
		}
		expect(formatDuration(d(2021, 2, 1), d(2024, 4, 15), it)).toBe(
			'3 anni, 2 mesi',
		)
	})
})

describe('dateSpan', () => {
	it('spans a group from the earliest start to the latest end', () => {
		const { start, end } = dateSpan(
			[
				{ startDate: '2022-01', endDate: '2023-12' },
				{ startDate: '2024-01', endDate: '2024-12' },
			],
			new Date(2024, 0, 1),
		)
		expect(start?.getFullYear()).toBe(2022)
		expect(end?.getFullYear()).toBe(2024)
	})

	it('treats open-ended items as the provider now, never the wall clock', () => {
		const now = new Date(2024, 0, 1)
		const { end } = dateSpan([{ startDate: '2021-03' }], now)
		expect(end?.getTime()).toBe(now.getTime())
	})

	it('returns empty dates when nothing parses', () => {
		expect(
			dateSpan(
				[{ startDate: 'someday', endDate: 'someday' }],
				new Date(2024, 0, 1),
			),
		).toEqual({ start: undefined, end: undefined })
	})
})
