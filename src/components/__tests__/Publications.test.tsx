import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { QuillProvider } from '../QuillProvider'
import { Publications } from '../Publications'

const wrap = (children: ReactNode) => <QuillProvider>{children}</QuillProvider>

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

describe('Publications — the 2.x field semantics', () => {
	it('titles with the name and subtitles with the publisher', () => {
		render(
			wrap(
				<Publications
					publications={[{ name: 'A Study of Typesetting', publisher: 'ACM' }]}
				/>,
			),
		)
		expect(screen.getByText('A Study of Typesetting')).toBeInTheDocument()
		expect(screen.getByText('ACM')).toBeInTheDocument()
	})

	it('stamps the release date at year precision', () => {
		render(
			wrap(
				<Publications
					publications={[{ name: 'P', releaseDate: '2021-06-12' }]}
				/>,
			),
		)
		expect(screen.getByText('2021')).toBeInTheDocument()
	})

	it('prefers the summary over the authors for the content', () => {
		render(
			wrap(
				<Publications
					publications={[
						{ name: 'P', authors: ['Jane Doe'], summary: 'A study' },
					]}
				/>,
			),
		)
		expect(screen.getByText(/A study/)).toBeInTheDocument()
		expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
	})

	it('falls back to the authors when there is no summary', () => {
		render(
			wrap(
				<Publications
					publications={[{ name: 'P', authors: ['Jane Doe', 'Joe Bloggs'] }]}
				/>,
			),
		)
		expect(screen.getByText('Jane Doe, Joe Bloggs')).toBeInTheDocument()
	})

	it('renders nothing when the list is empty', () => {
		const { container } = render(wrap(<Publications publications={[]} />))
		expect(container.querySelector('section')).toBeNull()
	})
})
