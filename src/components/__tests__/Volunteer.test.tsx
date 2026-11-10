import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../QuillProvider'
import { Volunteer } from '../Volunteer'

// Pinned "now" — open-ended durations must be pin-able, never the wall
// clock. Local midnight, timezone-immune.
const NOW = new Date(2024, 0, 1)

const wrap = (children: ReactNode) => (
	<QuillProvider now={NOW}>{children}</QuillProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Volunteer — the field→role mapping', () => {
	it('maps position to the title and organization to the subtitle', () => {
		render(
			wrap(
				<Volunteer
					volunteer={[
						{
							position: 'Mentor',
							organization: 'Code Club',
							startDate: '2020-01',
						},
					]}
				/>,
			),
		)
		expect(
			screen.getByRole('heading', { level: 3, name: /Mentor/ }),
		).toBeInTheDocument()
		expect(screen.getByText(/Code Club/)).toBeInTheDocument()
	})

	it('links the organization to the url', () => {
		render(
			wrap(
				<Volunteer
					volunteer={[
						{
							position: 'Mentor',
							organization: 'Code Club',
							url: 'https://codeclub.example',
						},
					]}
				/>,
			),
		)
		expect(screen.getByRole('link', { name: /Code Club/ })).toHaveAttribute(
			'href',
			'https://codeclub.example',
		)
	})

	it('offers the visit-website action for a linked organization', () => {
		render(
			wrap(
				<Volunteer
					volunteer={[
						{
							position: 'Mentor',
							organization: 'Code Club',
							url: 'https://codeclub.example',
						},
					]}
				/>,
			),
		)
		expect(screen.getByRole('link', { name: /Visit Website/ })).toHaveAttribute(
			'href',
			'https://codeclub.example',
		)
	})
})
