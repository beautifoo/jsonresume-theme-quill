import { describe, expect, it } from 'vitest'
import { resumeDocumentMetadata } from '../document'

describe('resumeDocumentMetadata', () => {
	it('announces "name — label" when both are present', () => {
		expect(
			resumeDocumentMetadata({
				basics: { name: 'Johanna K.', label: 'Engineer' },
			}),
		).toEqual({ title: 'Johanna K. — Engineer', lang: 'en' })
	})

	it('falls back to the name alone without a label', () => {
		expect(resumeDocumentMetadata({ basics: { name: 'Johanna K.' } })).toEqual({
			title: 'Johanna K.',
			lang: 'en',
		})
	})

	it('keeps the host title when there is no name', () => {
		expect(resumeDocumentMetadata({})).toEqual({ title: undefined, lang: 'en' })
	})

	it('takes the document language from the resolved locale', () => {
		expect(
			resumeDocumentMetadata({ basics: { name: 'X' }, language: 'fr' }).lang,
		).toBe('fr')
	})
})
