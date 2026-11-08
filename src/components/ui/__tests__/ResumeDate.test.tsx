import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { FolioProvider } from '../../FolioProvider'
import { DateRange, DateStamp } from '../ResumeDate'

// Pinned "now" — open-ended durations must be pin-able, never the wall
// clock. Local midnight, timezone-immune.
const NOW = new Date(2024, 0, 1)

const wrap = (children: ReactNode) => (
	<FolioProvider now={NOW}>{children}</FolioProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

// The pure side of the date contract (`parseResumeDate`, `formatDuration`,
// `dateSpan`) is tested directly in `lib/__tests__/dates.test.ts` — this
// file covers the seam: the presenters rendered through the Folio provider,
// including the wiring that resolves the duration words from the catalog.

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
