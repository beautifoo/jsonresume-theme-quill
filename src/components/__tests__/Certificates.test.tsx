import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { Certificates } from '../Certificates'
import { QuillProvider } from '../QuillProvider'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Certificates — the 2.x field semantics', () => {
	it('titles with the name and subtitles with the issuer', () => {
		render(
			wrap(
				<Certificates
					certificates={[{ name: 'AWS Solutions Architect', issuer: 'Amazon' }]}
				/>,
			),
		)
		expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument()
		expect(screen.getByText(/Issued by Amazon/)).toBeInTheDocument()
	})

	it('stamps the date through the date seam', () => {
		render(
			wrap(<Certificates certificates={[{ name: 'C', date: '2021-11-02' }]} />),
		)
		expect(screen.getByText('Nov 2021')).toBeInTheDocument()
	})

	it('links the URL with the view label', () => {
		render(
			wrap(
				<Certificates
					certificates={[{ name: 'C', url: 'https://cred.dev/c' }]}
				/>,
			),
		)
		expect(
			screen.getByRole('link', { name: /View Certificate/i }),
		).toHaveAttribute('href', 'https://cred.dev/c')
	})

	it('renders nothing when the list is empty', () => {
		const { container } = render(wrap(<Certificates certificates={[]} />))
		expect(container.querySelector('section')).toBeNull()
	})
})
