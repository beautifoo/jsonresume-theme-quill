import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import resume from '../../../resume.json'
import type { ResumeDocument } from '../../types/resume'
import { Resume } from '../Resume'

// Vitest runs without globals, so RTL's automatic cleanup never registers.
afterEach(cleanup)

/** The rendered section titles, in DOM (document) order. */
const sectionTitles = () =>
	screen
		.getAllByRole('heading', { level: 2 })
		.map((heading) => within(heading).getByText(/./).textContent)

// A document with every section non-empty — the full registry order.
const fullResume = {
	basics: { name: 'J. Doe', summary: 'An about paragraph' },
	work: [{ name: 'Co', position: 'Role' }],
	education: [{ area: 'CS', institution: 'Uni' }],
	projects: [{ name: 'Proj' }],
	volunteer: [{ organization: 'Org', position: 'Role' }],
	skills: [{ name: 'Go' }],
	languages: [{ language: 'English' }],
	publications: [{ name: 'Paper' }],
	certificates: [{ name: 'Cert' }],
	awards: [{ title: 'Award' }],
	references: [{ name: 'Ref' }],
	interests: [{ name: 'Typography' }],
} as ResumeDocument

// `Resume` installs its own Folio provider (the Resume date contract
// is enforced behind its interface), so tests render it bare.

describe('Resume — the ATS-safe document order (ADR 0001)', () => {
	it('renders main sections first, sidebar sections after, in registry order', () => {
		render(<Resume resume={fullResume} />)

		expect(sectionTitles()).toEqual([
			'About',
			'Work Experience',
			'Education',
			'Projects',
			'Volunteer',
			'Skills',
			'Languages',
			'Publications',
			'Certificates',
			'Awards',
			'References',
			'Interests',
		])
	})

	it('renders only the non-empty sections — the order does not shift', () => {
		render(
			<Resume
				resume={
					{
						basics: { name: 'J. Doe' },
						education: [{ area: 'CS' }],
						interests: [{ name: 'Typography' }],
					} as ResumeDocument
				}
			/>,
		)

		expect(sectionTitles()).toEqual(['Education', 'Interests'])
	})

	it('renders no sections for a document without any', () => {
		render(<Resume resume={{ basics: { name: 'J. Doe' } } as ResumeDocument} />)

		expect(screen.queryAllByRole('heading', { level: 2 })).toEqual([])
	})

	it('keeps the document order identical in single layout mode', () => {
		render(<Resume resume={fullResume} layout='single' />)

		expect(sectionTitles()).toEqual([
			'About',
			'Work Experience',
			'Education',
			'Projects',
			'Volunteer',
			'Skills',
			'Languages',
			'Publications',
			'Certificates',
			'Awards',
			'References',
			'Interests',
		])
	})

	it('renders nothing without basics', () => {
		const { container } = render(<Resume resume={{}} />)
		expect(container.querySelector('.folio-resume')).toBeNull()
	})

	it('renders the sample resume, with main before sidebar', () => {
		render(<Resume resume={resume} />)

		expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
		const titles = sectionTitles()
		expect(titles.length).toBeGreaterThan(0)
		// Whatever the sample holds, main sections precede sidebar ones.
		const main = new Set([
			'About',
			'Work Experience',
			'Education',
			'Projects',
			'Volunteer',
		])
		const lastMain = titles.map((t) => (main.has(t) ? t : null)).filter(Boolean)
		const firstSidebar = titles.find((t) => !main.has(t))
		if (firstSidebar) {
			expect(titles.indexOf(lastMain.at(-1) as string)).toBeLessThan(
				titles.indexOf(firstSidebar),
			)
		}
	})
})
