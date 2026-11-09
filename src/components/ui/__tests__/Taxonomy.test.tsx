import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { FolioProvider } from '../../FolioProvider'
import { Taxonomy } from '../Taxonomy'

const wrap = (children: ReactNode) => <FolioProvider>{children}</FolioProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Taxonomy — the shared sidebar list treatment', () => {
	it('renders name, rating, and keywords per entry', () => {
		render(
			wrap(
				<Taxonomy
					title='sections.skills'
					entries={[
						{ name: 'TypeScript', value: 'Expert', keywords: ['ts', 'node'] },
						{ name: 'Figma' },
					]}
				/>,
			),
		)
		expect(screen.getByText('TypeScript')).toBeInTheDocument()
		expect(screen.getByText('Expert')).toBeInTheDocument()
		expect(screen.getByText('ts, node')).toBeInTheDocument()
		// One section for all entries
		expect(screen.getAllByRole('region')).toHaveLength(1)
	})

	it('renders nothing when there are no entries — the order does not shift', () => {
		const { container } = render(
			wrap(<Taxonomy title='sections.interests' entries={[]} />),
		)
		expect(container.querySelector('section')).toBeNull()
	})
})
