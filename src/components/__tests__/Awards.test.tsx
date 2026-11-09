import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Awards } from '../Awards'
import { FolioProvider } from '../FolioProvider'

const wrap = (children: ReactNode) => <FolioProvider>{children}</FolioProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Awards — the 2.x field semantics', () => {
	it('renders each award with its i18n subtitle', () => {
		const { container } = render(
			wrap(
				<Awards
					awards={[
						{
							title: 'Best New Engineer',
							awarder: 'Acme',
							date: '2022-03-15',
							summary: 'For the release',
						},
						{ title: 'Award Two' },
					]}
				/>,
			),
		)
		// One section for both awards — each is an entry, not its own section
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Best New Engineer')).toBeInTheDocument()
		expect(screen.getByText(/Awarded by Acme/)).toBeInTheDocument()
	})

	it('stamps the date through the date seam', () => {
		render(wrap(<Awards awards={[{ title: 'A', date: '2022-03-15' }]} />))
		expect(screen.getByText('Mar 2022')).toBeInTheDocument()
	})

	it('links the theme url extension with the view label', () => {
		render(
			wrap(<Awards awards={[{ title: 'A', url: 'https://awards.dev/a' }]} />),
		)
		expect(screen.getByRole('link', { name: /View Award/i })).toHaveAttribute(
			'href',
			'https://awards.dev/a',
		)
	})

	it('renders nothing when the list is empty', () => {
		const { container } = render(wrap(<Awards awards={[]} />))
		expect(container.querySelector('section')).toBeNull()
	})
})
