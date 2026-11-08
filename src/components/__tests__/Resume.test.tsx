import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import resume from '../../../resume.json'
import { Resume } from '../Resume'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

// `Resume` installs its own Folio provider (the Resume date contract
// is enforced behind its interface), so tests render it bare.

describe('Resume — the ATS-safe document order (ADR 0001)', () => {
	it('renders main sections first, sidebar sections after, in registry order', () => {
		render(<Resume resume={resume} />)

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
		render(<Resume resume={resume} layout='single' />)

		const titles = screen
			.getAllByRole('heading', { level: 2 })
			.map((heading) => within(heading).getByText(/./).textContent)

		expect(titles).toContain('About')
		expect(titles.indexOf('Volunteer')).toBeLessThan(titles.indexOf('Skills'))
	})

	it('renders nothing without basics', () => {
		const { container } = render(<Resume resume={{}} />)
		expect(container.querySelector('.folio-resume')).toBeNull()
	})
})
