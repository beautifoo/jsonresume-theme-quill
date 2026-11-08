import { describe, expect, it } from 'vitest'
import resume from '../../../resume.json'
import { validateResume } from '../resume'

describe('validateResume — the resume contract entry', () => {
	it('returns empty issue lists for a stable resume without legacy fields', () => {
		expect(validateResume(resume)).toEqual({ stable: [], legacy: [] })
	})

	it('reports both checks independently', () => {
		const result = validateResume({
			basics: { title: 'X', email: 42 }, // legacy title + malformed email
			work: 'not an array', // stable violation
		})
		expect(result.stable.map((issue) => issue.path)).toContain('basics.email')
		expect(result.stable.map((issue) => issue.path)).toContain('work')
		expect(result.legacy.map((issue) => issue.path)).toContain('basics.title')
	})
})
