import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'bun:test'
import { Languages } from '../Languages'
import { QuillProvider } from '../QuillProvider'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Languages — the taxonomy treatment over the raw document field', () => {
	it('maps the language name and fluency onto the entry', () => {
		const { container } = render(
			wrap(
				<Languages
					languages={[
						{ language: 'English', fluency: 'Fluent' },
						{ language: 'Spanish' },
					]}
				/>,
			),
		)
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Languages')).toBeInTheDocument()
		expect(screen.getByText('English')).toBeInTheDocument()
		expect(screen.getByText('Fluent')).toBeInTheDocument()
	})

	it('falls back to an empty name when the schema leaves it unset', () => {
		const { container } = render(
			wrap(<Languages languages={[{ fluency: 'Basic' }]} />),
		)
		expect(container.querySelectorAll('section')).toHaveLength(1)
		expect(screen.getByText('Basic')).toBeInTheDocument()
	})

	it('renders nothing when the field is missing or the list is empty', () => {
		const { container } = render(wrap(<Languages />))
		expect(container.querySelector('section')).toBeNull()
	})
})
