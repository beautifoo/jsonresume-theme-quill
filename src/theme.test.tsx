import { describe, expect, it } from 'bun:test'
import resumeJson from '../resume.json'
import { render } from './theme'
import type { ResumeDocument } from './types/resume'

const resume = resumeJson as ResumeDocument

describe('render (the published theme entry)', () => {
	it('returns a complete, self-contained HTML document', () => {
		const html = render(resume)

		expect(html).toMatch(/^<!doctype html>/)
		expect(html).toContain('<style>')
		expect(html).toContain(resume.basics!.name!)
		// Static markup: the real DOM, readable without executing anything.
		expect(html).toContain(resume.work![0]!.name!)
		// And no client React bundle: only the scheme bootstrap script.
		const scriptTags = html.match(/<script/g) ?? []
		expect(scriptTags).toHaveLength(1)
		expect(html).toContain('quill-scheme')
	})

	it('derives the title and escapes it', () => {
		const html = render({
			basics: { name: 'Annie <Tag> & Co', label: 'Owner' },
		})

		expect(html).toContain('<title>Annie &lt;Tag&gt; &amp; Co — Owner</title>')
	})

	it('marks the document language', () => {
		const html = render({ ...resume, language: 'de' })

		expect(html).toContain('<html lang="de"')
	})

	it('renders a resume without basics to an empty document', () => {
		const html = render({})

		expect(html).toContain('<title>Resume</title>')
		expect(html).toContain('<body>')
	})

	it('collapses to a single column when the document asks for it', () => {
		// resume-cli passes only the resume to render — the document's
		// custom.quill.layout is the layout channel.
		expect(render(resume)).toContain('layout-double')
		expect(
			render({ ...resume, custom: { quill: { layout: 'single' } } }),
		).toContain('layout-single')
		// A malformed value falls back to the default.
		expect(
			render(
				{ ...resume, custom: { quill: { layout: 'diagonal' } } } as unknown as ResumeDocument,
			),
		).toContain('layout-double')
	})
})
