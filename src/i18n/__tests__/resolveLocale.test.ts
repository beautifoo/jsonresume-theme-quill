import { describe, expect, it } from 'vitest'
import type { ResumeDocument } from '../../types/resume'
import { resolveLocale } from '../resolveLocale'

describe('resolveLocale', () => {
	it('uses the resume language when we ship it', () => {
		expect(resolveLocale({ language: 'fr' })).toBe('fr')
		expect(resolveLocale({ language: 'zh' })).toBe('zh')
	})

	it('falls back to English for unsupported or missing languages', () => {
		expect(resolveLocale({ language: 'xx' })).toBe('en')
		expect(resolveLocale({ language: 'Danish' })).toBe('en')
		expect(resolveLocale({})).toBe('en')
		expect(resolveLocale({ language: 42 } as unknown as ResumeDocument)).toBe(
			'en',
		)
	})
})
