import type { ResumeBasics } from '../../types/resume'
import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { FolioProvider } from '../FolioProvider'
import { Header } from '../Header'

const wrap = (children: ReactNode) => <FolioProvider>{children}</FolioProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Header — the masthead', () => {
	it('renders the name as the document heading', () => {
		render(wrap(<Header basics={{ name: 'Johanna K.' } as ResumeBasics} />))
		expect(
			screen.getByRole('heading', { level: 1, name: 'Johanna K.' }),
		).toBeInTheDocument()
	})

	it('renders a location object as one compact line, postal code included', () => {
		render(
			wrap(
				<Header
					basics={
						{
							name: 'Johanna K.',
							location: {
								address: 'Stadsporten 10',
								city: 'Oslo',
								postalCode: '0150',
							},
						} as ResumeBasics
					}
				/>,
			),
		)
		expect(screen.getByText('Stadsporten 10, Oslo, 0150')).toBeInTheDocument()
	})

	it('renders no location row when the location is absent', () => {
		const { container } = render(
			wrap(<Header basics={{ name: 'Johanna K.' } as ResumeBasics} />),
		)
		expect(container.querySelector('svg')).toBeNull()
	})
})
