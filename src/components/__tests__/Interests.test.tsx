import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'bun:test'
import { Interests } from '../Interests'
import { QuillProvider } from '../QuillProvider'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Interests — the taxonomy treatment over the raw document field', () => {
	it('renders each interest with its keywords', () => {
		const { container } = render(
			wrap(
				<Interests
					interests={[
						{ name: 'Philosophy', keywords: ['logic', 'ethics'] },
						{ name: 'Jazz' },
					]}
				/>,
			),
		)
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Interests')).toBeInTheDocument()
		expect(screen.getByText('Philosophy')).toBeInTheDocument()
		expect(screen.getByText('logic, ethics')).toBeInTheDocument()
	})

	it('falls back to an empty name when the schema leaves it unset', () => {
		const { container } = render(
			wrap(<Interests interests={[{ keywords: ['one'] }]} />),
		)
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('one')).toBeInTheDocument()
	})

	it('renders nothing when the field is missing or the list is empty', () => {
		const { container } = render(wrap(<Interests />))
		expect(container.querySelector('section')).toBeNull()
	})
})
