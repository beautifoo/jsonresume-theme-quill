import { cleanup, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { afterEach, describe, expect, it } from 'vitest'
import en from '../../i18n/locales/en.json'
import resume from '../../../resume.json'
import { Resume } from '../Resume'

const wrap = (children: ReactNode) => (
	<IntlProvider locale='en' now={new Date(2024, 0, 1)} messages={en}>
		{children}
	</IntlProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Resume — the ATS-safe document order (ADR 0001)', () => {
	it('renders main sections first, sidebar sections after, in registry order', () => {
		render(wrap(<Resume resume={resume} />))

		const titles = screen
			.getAllByRole('heading', { level: 2 })
			.map((heading) => within(heading).getByText(/./).textContent)

		expect(titles).toEqual([
			'About',
			'Work Experience',
			'Education',
			'Projects',
			'Volunteer',
			'Skills',
			'Languages',
			'Publications',
			'Certificates',
			'Awards',
			'References',
			'Interests',
		])
	})

	it('keeps the document order identical in single layout mode', () => {
		render(wrap(<Resume resume={resume} layout='single' />))

		const titles = screen
			.getAllByRole('heading', { level: 2 })
			.map((heading) => within(heading).getByText(/./).textContent)

		expect(titles).toContain('About')
		expect(titles.indexOf('Volunteer')).toBeLessThan(titles.indexOf('Skills'))
	})

	it('renders nothing without basics', () => {
		const { container } = render(wrap(<Resume resume={{}} />))
		expect(container.querySelector('.folio-resume')).toBeNull()
	})
})
