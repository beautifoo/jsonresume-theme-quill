import en from '../../i18n/locales/en.json'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { describe, expect, it } from 'vitest'
import { WorkExperience } from '../WorkExperience'

const wrap = (children: ReactNode) => {
	return (
		<IntlProvider
			locale='en'
			now={new Date('2024-01-01')}
			timeZone='UTC'
			messages={en}
		>
			{children}
		</IntlProvider>
	)
}

describe('WorkExperience grouping', () => {
	it('shows company header with total duration and role count for grouped roles', () => {
		const work = [
			{
				name: 'Company A',
				position: 'Senior Analyst',
				startDate: '2024-01',
				endDate: '2024-12',
			},
			{
				name: 'Company A',
				position: 'Analyst',
				startDate: '2022-01',
				endDate: '2023-12',
			},
			{
				name: 'Company B',
				position: 'Engineer',
				startDate: '2020-01',
				endDate: '2021-01',
			},
		]

		render(
			wrap(
				<WorkExperience
					work={work as Parameters<typeof WorkExperience>[0]['work']}
				/>,
			),
		)

		// Company A has two contiguous roles, so a group header is rendered
		const header = screen.getByText(/Company A/i)
		expect(header).toBeInTheDocument()
		expect(screen.getByText(/2 roles/i)).toBeInTheDocument()

		// Company B has a single role, so no group header is rendered for it
		expect(screen.queryByText('Company B')).not.toBeInTheDocument()
	})

	it('renders a growth indicator when growth metadata is provided', () => {
		const work = [
			{
				name: 'Company A',
				position: 'Analyst',
				startDate: '2022-01',
				growth: { label: 'Promoted' },
			},
		]

		render(
			wrap(
				<WorkExperience
					work={work as Parameters<typeof WorkExperience>[0]['work']}
				/>,
			),
		)

		expect(screen.getByText('Promoted')).toBeInTheDocument()
	})
})
