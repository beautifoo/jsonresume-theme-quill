import type { ResumeDocument } from '../../types/resume'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FolioProvider } from '../FolioProvider'
import { DateRange } from '../ui/ResumeDate'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('FolioProvider — the Resume date contract at the seam', () => {
	it('measures an open-ended range from the passed now, never the wall clock', () => {
		render(
			<FolioProvider now={new Date(2024, 0, 1)}>
				<DateRange start='2021-03-01' />
			</FolioProvider>,
		)
		expect(screen.getByText(/Present/)).toBeInTheDocument()
		expect(screen.getByText(/2 years, 10 months/)).toBeInTheDocument()
	})

	it('renders in the declared resume language when no locale is given', () => {
		render(
			<FolioProvider resume={{ language: 'fr' } as ResumeDocument}>
				<DateRange start='2021-03-01' />
			</FolioProvider>,
		)
		expect(screen.getByText(/Présent/)).toBeInTheDocument()
	})

	it('falls back to English for an undeclared or unsupported language', () => {
		render(
			<FolioProvider resume={{ language: 'da' } as ResumeDocument}>
				<DateRange start='2021-03-01' />
			</FolioProvider>,
		)
		expect(screen.getByText(/Present/)).toBeInTheDocument()
	})
})
