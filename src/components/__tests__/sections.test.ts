import { describe, expect, it } from 'vitest'
import { MAIN_SECTIONS, SIDEBAR_SECTIONS } from '../sections'

describe('the section registry — the ATS-safe document order (ADR 0001)', () => {
	it('registers the main-column sections in registry order', () => {
		expect(MAIN_SECTIONS.map((s) => s.key)).toEqual([
			'summary',
			'work',
			'education',
			'projects',
			'volunteer',
		])
	})

	it('registers the sidebar sections in registry order', () => {
		expect(SIDEBAR_SECTIONS.map((s) => s.key)).toEqual([
			'skills',
			'languages',
			'publications',
			'certificates',
			'awards',
			'references',
			'interests',
		])
	})
})
