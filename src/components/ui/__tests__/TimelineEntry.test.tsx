import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { TimelineEntry } from '../TimelineEntry'
import { IntlTestProvider } from '../../../test/intl'

const wrap = (children: ReactNode) => (
	<IntlTestProvider>{children}</IntlTestProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('TimelineEntry dates', () => {
	it('renders a closed range as a localized interval', () => {
		render(
			wrap(
				<TimelineEntry startDate='2018-09-01' endDate='2021-02-28'>
					body
				</TimelineEntry>,
			),
		)
		expect(screen.getByText(/Sep 2018/)).toBeInTheDocument()
		expect(screen.getByText(/Feb 2021/)).toBeInTheDocument()
	})

	it('renders open-ended roles with the localized present label', () => {
		render(wrap(<TimelineEntry startDate='2021-03-01'>body</TimelineEntry>))
		expect(screen.queryByText(/Present/)).toBeInTheDocument()
		expect(screen.queryByText('date.present')).not.toBeInTheDocument()
	})

	it('measures an open-ended duration from the provider now, not the wall clock', () => {
		// 2021-03-01 → 2024-01-01 (the provider `now`)
		render(wrap(<TimelineEntry startDate='2021-03-01'>body</TimelineEntry>))
		expect(screen.getByText(/2 years, 10 months/)).toBeInTheDocument()
	})
})
