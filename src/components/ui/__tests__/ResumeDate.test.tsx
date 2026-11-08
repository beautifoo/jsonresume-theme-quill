import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { FolioProvider } from '../../FolioProvider'
import { DateRange, DateStamp, dateSpan, parseResumeDate } from '../ResumeDate'

// Pinned "now" — open-ended durations must be pin-able, never the wall
// clock. Local midnight, timezone-immune.
const NOW = new Date(2024, 0, 1)

const wrap = (children: ReactNode) => (
	<FolioProvider now={NOW}>{children}</FolioProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('parseResumeDate', () => {
	it('parses ISO dates as local dates, immune to the viewer timezone', () => {
		// A UTC-midnight parse of the same string would shift the day
		// for viewers west of UTC; the local parse must not.
		const d = parseResumeDate('2021-03-05')
		expect(d?.getFullYear()).toBe(2021)
		expect(d?.getMonth()).toBe(2)
		expect(d?.getDate()).toBe(5)
	})

	it('parses year-month dates to the first of the month', () => {
		const d = parseResumeDate('2021-03')
		expect(d?.getMonth()).toBe(2)
		expect(d?.getDate()).toBe(1)
	})

	it('returns undefined for unparseable values', () => {
		expect(parseResumeDate('someday')).toBeUndefined()
	})
})

describe('DateRange', () => {
	it('renders a closed range with its duration', () => {
		render(wrap(<DateRange start='2018-09-01' end='2021-02-28' />))
		expect(screen.getByText(/Sep 2018/)).toBeInTheDocument()
		expect(screen.getByText(/Feb 2021/)).toBeInTheDocument()
	})

	it('measures an open-ended range from the provider now', () => {
		render(wrap(<DateRange start='2021-03-01' />))
		expect(screen.getByText(/Present/)).toBeInTheDocument()
		expect(screen.getByText(/2 years, 10 months/)).toBeInTheDocument()
	})

	it('renders nothing without a parseable start date', () => {
		const { container } = render(wrap(<DateRange start='someday' />))
		expect(container.querySelector('div')).toBeNull()
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

describe('DateStamp', () => {
	it('renders a month-precision date by default', () => {
		render(wrap(<DateStamp date='2021-03-05' />))
		expect(screen.getByText('Mar 2021')).toBeInTheDocument()
	})

	it('renders a year-precision date when asked', () => {
		render(wrap(<DateStamp date='2021-03-05' precision='year' />))
		expect(screen.getByText('2021')).toBeInTheDocument()
	})

	it('renders nothing for unparseable values', () => {
		const { container } = render(wrap(<DateStamp date='someday' />))
		expect(container.querySelector('time')).toBeNull()
	})
})
