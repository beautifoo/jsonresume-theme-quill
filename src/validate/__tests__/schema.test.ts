import { describe, expect, it } from 'vitest'
import careerChanger from '../../../node_modules/@jsonresume/schema/examples/career-changer.resume.json'
import newGrad from '../../../node_modules/@jsonresume/schema/examples/new-grad.resume.json'
import seniorEngineer from '../../../node_modules/@jsonresume/schema/examples/senior-engineer.resume.json'
import resume from '../../../resume.json'
import { validateResume } from '../resume'

describe('the stable (2.x) schema', () => {
	it('passes the official 2.x example resumes', () => {
		for (const example of [careerChanger, newGrad, seniorEngineer]) {
			expect(
				validateResume(example).stable,
				JSON.stringify(example).slice(0, 80),
			).toEqual([])
		}
	})

	it('passes the repo sample resume', () => {
		expect(validateResume(resume).stable).toEqual([])
	})

	it('fails a malformed document, with paths', () => {
		const { stable } = validateResume({
			basics: { email: 42 },
			work: 'not an array',
		})
		const paths = stable.map((issue) => issue.path)
		expect(paths).toContain('basics.email')
		expect(paths).toContain('work')
	})

	it('passes a minimal document (everything is optional)', () => {
		expect(validateResume({ basics: { name: 'A' } }).stable).toEqual([])
	})

	it('ignores unknown properties (the 2.x schema allows them)', () => {
		expect(
			validateResume({ basics: { name: 'A', someToolingField: { x: 1 } } })
				.stable,
		).toEqual([])
	})
})
