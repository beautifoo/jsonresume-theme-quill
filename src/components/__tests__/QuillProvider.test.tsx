import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { ResumeDocument } from '../../types/resume'
import { QuillProvider } from '../QuillProvider'
import { DateRange } from '../ui/ResumeDate'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('QuillProvider — the Resume date contract at the seam', () => {
	it('measures an open-ended range from the passed now, never the wall clock', () => {
		render(
			<QuillProvider now={new Date(2024, 0, 1)}>
				<DateRange start='2021-03-01' />
			</QuillProvider>,
		)
		expect(screen.getByText(/Present/)).toBeInTheDocument()
		expect(screen.getByText(/2 years, 10 months/)).toBeInTheDocument()
	})

	it('renders in the declared resume language when no locale is given', () => {
		render(
			<QuillProvider resume={{ language: 'fr' } as ResumeDocument}>
				<DateRange start='2021-03-01' />
			</QuillProvider>,
		)
		expect(screen.getByText(/Présent/)).toBeInTheDocument()
	})

	it('falls back to English for an undeclared or unsupported language', () => {
		render(
			<QuillProvider resume={{ language: 'da' } as ResumeDocument}>
				<DateRange start='2021-03-01' />
			</QuillProvider>,
		)
		expect(screen.getByText(/Present/)).toBeInTheDocument()
	})
})
