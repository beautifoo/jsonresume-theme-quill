import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'bun:test'
import { QuillProvider } from '../QuillProvider'
import { Skills } from '../Skills'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Skills — the taxonomy treatment over the raw document field', () => {
	it('renders each skill with its level and keywords', () => {
		const { container } = render(
			wrap(
				<Skills
					skills={[
						{ name: 'TypeScript', level: 'Expert', keywords: ['ts', 'dx'] },
						{ name: 'Go' },
					]}
				/>,
			),
		)
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Skills')).toBeInTheDocument()
		expect(screen.getByText('TypeScript')).toBeInTheDocument()
		expect(screen.getByText('Expert')).toBeInTheDocument()
		expect(screen.getByText('ts, dx')).toBeInTheDocument()
	})

	it('falls back to an empty name when the schema leaves it unset', () => {
		const { container } = render(wrap(<Skills skills={[{ level: 'Pro' }]} />))
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Pro')).toBeInTheDocument()
	})

	it('renders nothing when the field is missing or the list is empty', () => {
		const { container } = render(wrap(<Skills />))
		expect(container.querySelector('section')).toBeNull()
	})
})
