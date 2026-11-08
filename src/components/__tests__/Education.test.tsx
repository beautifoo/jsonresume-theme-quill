import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Education } from '../Education'
import { Projects } from '../Projects'
import { IntlTestProvider } from '../../test/intl'

const wrap = (children: ReactNode) => (
	<IntlTestProvider>{children}</IntlTestProvider>
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
					education={[{ institution: 'A High School', studyType: 'Baccalaureate' }]}
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
						{ institution: 'X', area: 'Y', summary: 'Thesis on typography', score: '12.4' },
					]}
				/>,
			),
		)
		expect(screen.getByText(/Thesis on typography/)).toBeInTheDocument()
		expect(screen.queryByText(/GPA: 12.4/)).not.toBeInTheDocument()
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
			wrap(<Projects projects={[{ name: 'P', description: 'Only the alias' }]} />),
		)
		expect(screen.getByText(/Only the alias/)).toBeInTheDocument()
	})
})
