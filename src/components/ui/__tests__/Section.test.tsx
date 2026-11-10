import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../../QuillProvider'
import { Section } from '../Section'

const wrap = (children: React.ReactNode) => (
	<QuillProvider>{children}</QuillProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Section — the shared section scaffolding', () => {
	it('wires the section id, the title id, and aria-labelledby together', () => {
		render(
			wrap(
				<Section title='sections.work' variant='timeline'>
					content
				</Section>,
			),
		)

		const section = screen.getByRole('region', { name: /Work Experience/ })
		expect(section).toHaveAttribute('id', 'section-work')
		expect(section).toHaveAttribute('aria-labelledby', 'section-work-title')
		const title = screen.getByRole('heading', {
			level: 2,
			name: 'Work Experience',
		})
		expect(title).toHaveAttribute('id', 'section-work-title')
	})

	it('keeps the a11y wiring in the list variant', () => {
		render(
			wrap(
				<Section title='sections.skills' variant='list'>
					content
				</Section>,
			),
		)

		const section = screen.getByRole('region', { name: /Skills/ })
		expect(section).toHaveAttribute('id', 'section-skills')
		expect(section).toHaveAttribute('aria-labelledby', 'section-skills-title')
	})

	it('owns the quiet-stack rhythm in the list variant — callers never retype it', () => {
		render(
			wrap(
				<Section title='sections.skills' variant='list'>
					<div>a</div>
					<div>b</div>
				</Section>,
			),
		)

		const stack = screen
			.getByRole('region', { name: /Skills/ })
			.querySelector('div')
		expect(stack).toHaveClass('space-y-3', 'print:space-y-2.5')
	})
})
