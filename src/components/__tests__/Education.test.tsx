import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Education } from '../Education'
import { QuillProvider } from '../QuillProvider'
import { Projects } from '../Projects'

// Pinned "now" — open-ended durations must be pin-able, never the wall
// clock. Local midnight, timezone-immune.
const NOW = new Date(2024, 0, 1)

const wrap = (children: ReactNode) => (
	<QuillProvider now={NOW}>{children}</QuillProvider>
)

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Education — the 2.x field semantics', () => {
	it('titles the entry with the field of study, not the degree type', () => {
		render(
			wrap(
				<Education
					education={[
						{
							institution: 'Aarhus University',
							area: 'Computer Science',
							studyType: 'MSc',
						},
					]}
				/>,
			),
		)
		// `area` is the title; `studyType` is quiet context, not the title
		expect(screen.getByText(/Computer Science/)).toBeInTheDocument()
		expect(screen.getByText(/MSc/)).toBeInTheDocument()
	})

	it('falls back to the study type when no area is given', () => {
		render(
			wrap(
				<Education
					education={[
						{ institution: 'A High School', studyType: 'Baccalaureate' },
					]}
				/>,
			),
		)
		expect(screen.getByText(/Baccalaureate/)).toBeInTheDocument()
	})

	it('prefers the 2.x summary over the score line', () => {
		render(
			wrap(
				<Education
					education={[
						{
							institution: 'X',
							area: 'Y',
							summary: 'Thesis on typography',
							score: '12.4',
						},
					]}
				/>,
			),
		)
		expect(screen.getByText(/Thesis on typography/)).toBeInTheDocument()
		expect(screen.queryByText(/GPA: 12.4/)).not.toBeInTheDocument()
	})

	it('prefixes a bare score with a "GPA:" label for readability', () => {
		render(
			wrap(
				<Education
					education={[{ institution: 'X', area: 'Y', score: '12.4' }]}
				/>,
			),
		)
		// The metrics rule bolds the score, splitting the summary text.
		const bold = screen.getByText('12.4')
		expect(bold.tagName).toBe('STRONG')
		expect(bold.closest('p')).toHaveTextContent('GPA: 12.4')
	})

	it('passes a non-numeric score through untouched', () => {
		render(
			wrap(
				<Education
					education={[{ institution: 'X', area: 'Y', score: 'Laude' }]}
				/>,
			),
		)
		expect(screen.getByText('Laude')).toBeInTheDocument()
		expect(screen.queryByText(/GPA: Laude/)).not.toBeInTheDocument()
	})
})

describe('Projects — the schema-mandated summary precedence (#296)', () => {
	it('renders summary over the deprecated description alias', () => {
		render(
			wrap(
				<Projects
					projects={[
						{
							name: 'P',
							summary: 'The short summary',
							description: 'The deprecated alias',
						},
					]}
				/>,
			),
		)
		expect(screen.getByText(/The short summary/)).toBeInTheDocument()
		expect(screen.queryByText(/The deprecated alias/)).not.toBeInTheDocument()
	})

	it('renders the description when summary is absent', () => {
		render(
			wrap(
				<Projects projects={[{ name: 'P', description: 'Only the alias' }]} />,
			),
		)
		expect(screen.getByText(/Only the alias/)).toBeInTheDocument()
	})

	it('maps the first role to the subtitle, falling back to the entity', () => {
		render(
			wrap(
				<Projects
					projects={[
						{ name: 'P', roles: ['Maintainer', 'Author'], entity: 'Acme' },
					]}
				/>,
			),
		)
		expect(screen.getByText(/Maintainer/)).toBeInTheDocument()
		expect(screen.queryByText(/Author/)).not.toBeInTheDocument()

		render(wrap(<Projects projects={[{ name: 'Q', entity: 'Acme' }]} />))
		expect(screen.getByText(/Acme/)).toBeInTheDocument()
	})
})
