import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'use-intl'
import { describe, expect, it } from 'vitest'
import en from '../../../i18n/locales/en.json'
import { TimelineEntry } from '../TimelineEntry'

const wrap = (children: React.ReactNode) => (
	<IntlProvider locale='en' messages={en}>
		{children}
	</IntlProvider>
)

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
})
