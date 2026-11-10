import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../QuillProvider'
import { References } from '../References'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('References — the 2.x field semantics', () => {
	it('falls back through the subtitle chain to the organization', () => {
		render(
			wrap(
				<References
					references={[
						{ name: 'R', relationship: 'Colleague', organization: 'Acme' },
					]}
				/>,
			),
		)
		// No label or position — the relationship wins, the organization does not also render
		expect(screen.getByText('Colleague')).toBeInTheDocument()
		expect(screen.queryByText('Acme')).not.toBeInTheDocument()
	})

	it('prefers the theme label over the stable relationship', () => {
		render(
			wrap(
				<References
					references={[
						{ name: 'R', label: 'Mentor', relationship: 'Colleague' },
					]}
				/>,
			),
		)
		expect(screen.getByText('Mentor')).toBeInTheDocument()
		expect(screen.queryByText('Colleague')).not.toBeInTheDocument()
	})

	it('falls back to the quotation when there is no summary', () => {
		render(
			wrap(
				<References
					references={[{ name: 'R', reference: 'A fine engineer' }]}
				/>,
			),
		)
		expect(screen.getByText(/A fine engineer/)).toBeInTheDocument()
	})

	it('prefers the theme summary over the stable quotation', () => {
		render(
			wrap(
				<References
					references={[
						{ name: 'R', summary: 'A great mentor', reference: 'Old quote' },
					]}
				/>,
			),
		)
		expect(screen.getByText(/A great mentor/)).toBeInTheDocument()
		expect(screen.queryByText(/Old quote/)).not.toBeInTheDocument()
	})

	it('renders nothing when the list is empty', () => {
		const { container } = render(wrap(<References references={[]} />))
		expect(container.querySelector('section')).toBeNull()
	})
})
