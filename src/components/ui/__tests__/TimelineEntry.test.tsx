import { cleanup, render, screen } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import { afterEach, describe, expect, it } from 'vitest'
import en from '../../../i18n/locales/en.json'
import { TimelineEntry } from '../TimelineEntry'

const wrap = (children: React.ReactNode) => (
	// No pinned timeZone: the provider falls back to the viewer's own
	// timezone, which pairs with the local date parse — the design is
	// timezone-immune precisely because both sides use the viewer's TZ.
	// `now` is a local midnight: `new Date('2024-01-01')` would be UTC
	// midnight, shifting a month on west-of-UTC machines.
	<IntlProvider locale='en' now={new Date(2024, 0, 1)} messages={en}>
		{children}
	</IntlProvider>
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
