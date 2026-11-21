import { describe, expect, it } from 'bun:test'
import { isConferenceTalk } from '../conferenceRouting'

// ADR 0005: the whitelist that re-homes talk-like publications into the
// Conferences section.

describe('isConferenceTalk — the #295 `type` whitelist', () => {
	it.each(['talk', 'presentation', 'speech'])(
		'routes `%s` to Conferences',
		(type) => {
			expect(isConferenceTalk({ name: 'P', type })).toBe(true)
		},
	)

	it('is case-insensitive', () => {
		expect(isConferenceTalk({ name: 'P', type: 'TALK' })).toBe(true)
		expect(isConferenceTalk({ name: 'P', type: 'Presentation' })).toBe(true)
	})

	it.each(['article', 'book', 'patent', 'thesis', 'keynote', 'lecture'])(
		'keeps `%s` in Publications',
		(type) => {
			expect(isConferenceTalk({ name: 'P', type })).toBe(false)
		},
	)

	it('keeps untyped publications in Publications', () => {
		expect(isConferenceTalk({ name: 'P' })).toBe(false)
	})
})
