import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../../QuillProvider'
import { SectionCard } from '../SectionCard'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

describe('SectionCard — the main-column entry contract, one prop per test', () => {
	it('renders the title as the entry heading', () => {
		render(wrap(<SectionCard title='Staff Engineer' />))
		expect(
			screen.getByRole('heading', { level: 3, name: /Staff Engineer/ }),
		).toBeInTheDocument()
	})

	it('renders the subtitle as an "at" context, linked when a url is given', () => {
		render(
			wrap(
				<SectionCard title='Engineer' subtitle='Acme' url='https://acme.com' />,
			),
		)
		// The link wraps the subtitle only; the "at" sits beside it in the heading.
		expect(screen.getByRole('link', { name: 'Acme' })).toHaveAttribute(
			'href',
			'https://acme.com',
		)
		expect(
			screen.getByRole('heading', { level: 3, name: /Engineer at Acme/ }),
		).toBeInTheDocument()
	})

	it('renders the subtitle unlinked without a url', () => {
		render(wrap(<SectionCard title='Engineer' subtitle='Acme' />))
		expect(screen.getByText(/at Acme/)).toBeInTheDocument()
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})

	it('renders a string location in the context row', () => {
		render(wrap(<SectionCard title='Engineer' location='Berlin' />))
		expect(screen.getByText(/Berlin/)).toBeInTheDocument()
	})

	it('renders a 2.x location object as a compact line, like a string', () => {
		render(
			wrap(
				<SectionCard
					title='Engineer'
					location={{ address: 'Baker Street 21', city: 'London' }}
				/>,
			),
		)
		expect(screen.getByText(/Baker Street 21, London/)).toBeInTheDocument()
	})

	it('renders the postal code in the location line, like the masthead does', () => {
		render(
			wrap(
				<SectionCard
					title='Engineer'
					location={{ city: 'Copenhagen', postalCode: '2000' }}
				/>,
			),
		)
		expect(screen.getByText('Copenhagen, 2000')).toBeInTheDocument()
	})

	it('renders the context beside the location, separated', () => {
		render(
			wrap(<SectionCard title='Engineer' location='London' context='MSc' />),
		)
		expect(screen.getByText(/London/)).toBeInTheDocument()
		expect(screen.getByText(/MSc/)).toBeInTheDocument()
	})

	it('renders keywords as tags', () => {
		render(wrap(<SectionCard title='Engineer' tags={['Go', 'Kubernetes']} />))
		expect(screen.getAllByText('Go').length).toBeGreaterThan(0)
		expect(screen.getAllByText('Kubernetes').length).toBeGreaterThan(0)
	})

	it('renders the summary as markdown, bolding metric numbers', () => {
		render(wrap(<SectionCard title='Engineer' summary='Shipped 12 releases' />))
		// The metrics rule bolds the number, splitting the summary text.
		const bold = screen.getByText('12')
		expect(bold.tagName).toBe('STRONG')
		expect(bold.closest('p')).toHaveTextContent('Shipped 12 releases')
	})

	it('renders highlights as a list, one item each', () => {
		render(
			wrap(
				<SectionCard
					title='Engineer'
					highlights={['Cut p95 latency 40%', 'Led the migration']}
				/>,
			),
		)
		const items = screen.getAllByRole('listitem')
		expect(items).toHaveLength(2)
		expect(items[0]).toHaveTextContent('Cut p95 latency 40%')
	})

	it('renders the action link from actionUrl + actionLabelKey', () => {
		render(
			wrap(
				<SectionCard
					title='Project'
					actionUrl='https://github.com/acme'
					actionLabelKey='common.viewProject'
				/>,
			),
		)
		expect(screen.getByRole('link', { name: /View Project/ })).toHaveAttribute(
			'href',
			'https://github.com/acme',
		)
	})

	it('does not render an action link without a label key', () => {
		render(
			wrap(<SectionCard title='Project' actionUrl='https://github.com/acme' />),
		)
		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})

	it('renders a title addon beside the title, screen-only', () => {
		render(
			wrap(
				<SectionCard
					title='Engineer'
					addonAfterTitle={<span>3 Promotions</span>}
				/>,
			),
		)
		const addon = screen.getByText('3 Promotions')
		expect(addon.closest('.print\\:hidden')).not.toBeNull()
	})

	it('renders no heading without a title', () => {
		render(wrap(<SectionCard location='Berlin' />))
		expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
	})
})
