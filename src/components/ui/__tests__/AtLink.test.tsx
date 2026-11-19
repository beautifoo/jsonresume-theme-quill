import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../../QuillProvider'
import { AtLink } from '../AtLink'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

describe('AtLink — the "at" connector for organization context', () => {
	it('renders the label with the "at" connector, unlinked without a url', () => {
		render(wrap(<AtLink label='Acme' />))
		expect(screen.getByText(/at Acme/)).toBeInTheDocument()
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})

	it('links the label only, not the connector, when a url is given', () => {
		render(wrap(<AtLink label='Acme' url='https://acme.com' />))
		expect(screen.getByRole('link', { name: 'Acme' })).toHaveAttribute(
			'href',
			'https://acme.com',
		)
	})
})
