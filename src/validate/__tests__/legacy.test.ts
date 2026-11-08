import { describe, expect, it } from 'vitest'
import resume from '../../../resume.json'
import { findLegacyFields, legacyMessage } from '../legacy'
import { validateResume } from '../resume'

/**
 * A 1.0-era resume in the style of the famous 2013 sample: the fields
 * the 1.x era put in the wild, section by section.
 */
const legacyResume = {
	basics: {
		title: 'Software Engineer',
		bio: 'A bio',
		picture: 'http://example.com/picture.jpg',
		website: 'http://example.com',
		twitter: 'example',
		github: 'example',
		links: [{ network: 'LinkedIn', url: 'http://example.com/linkedin' }],
	},
	work: [{ company: 'Example', website: 'http://example.com' }],
	education: [{ institution: 'Example University', gpa: '3.8' }],
	awards: [{ name: 'Award', awardDate: '2014', issuer: 'Example' }],
	certificates: [{ name: 'Cert', startDate: '2014' }],
	publications: [{ name: 'Paper', organization: 'Example' }],
	references: [{ name: 'Ref', email: 'ref@example.com' }],
	projects: [{ name: 'Proj', position: 'Lead', team: ['a', 'b'] }],
}

describe('legacy (1.x) field detection', () => {
	it('finds every known 1.x field, naming its stable successor', () => {
		const issues = findLegacyFields(legacyResume)
		const byPath = new Map(issues.map((issue) => [issue.path, issue]))

		expect(byPath.get('basics.title')?.successor).toBe('label')
		expect(byPath.get('basics.bio')?.successor).toBe('summary')
		expect(byPath.get('basics.picture')?.successor).toBe('image')
		expect(byPath.get('basics.website')?.successor).toBe('url')
		expect(byPath.get('basics.twitter')?.successor).toBe('profiles')
		expect(byPath.get('basics.github')?.successor).toBe('profiles')
		expect(byPath.get('basics.links')?.successor).toBe('profiles')
		expect(byPath.get('work[0].company')?.successor).toBe('name')
		expect(byPath.get('work[0].website')?.successor).toBe('url')
		expect(byPath.get('education[0].gpa')?.successor).toBe('score')
		expect(byPath.get('awards[0].name')?.successor).toBe('title')
		expect(byPath.get('awards[0].awardDate')?.successor).toBe('date')
		expect(byPath.get('awards[0].issuer')?.successor).toBe('awarder')
		expect(byPath.get('certificates[0].startDate')?.successor).toBe('date')
		expect(byPath.get('publications[0].organization')?.successor).toBe(
			'publisher',
		)
		expect(byPath.get('references[0].email')?.successor).toBeNull()
		expect(byPath.get('projects[0].position')?.successor).toBe('roles')
		expect(byPath.get('projects[0].team')?.successor).toBeNull()
	})

	it('reports renamed top-level sections', () => {
		const issues = findLegacyFields({
			bio: { name: 'A' },
			hobbies: [{ name: 'X' }],
		})
		const paths = new Map(issues.map((issue) => [issue.path, issue]))
		expect(paths.get('bio')?.successor).toBe('basics')
		expect(paths.get('hobbies')?.successor).toBe('interests')
	})

	it('finds nothing in a stable (2.x) resume', () => {
		expect(validateResume(resume).legacy).toEqual([])
	})

	it('never warns on a deprecated 2.x alias — deprecated is not legacy', () => {
		// `projects.description` is a deprecated *stable* alias of
		// `summary` (#296): it is in the 2.x schema, so no warning.
		expect(
			findLegacyFields({ projects: [{ name: 'P', description: 'd' }] }),
		).toEqual([])
	})

	it('renders a migration hint per issue', () => {
		const [renamed, dropped] = [
			legacyMessage({
				path: 'basics.title',
				field: 'title',
				successor: 'label',
			}),
			legacyMessage({
				path: 'references[0].email',
				field: 'email',
				successor: null,
			}),
		]
		expect(renamed).toBe('basics.title: "title" → "label"')
		expect(dropped).toContain('no stable successor')
	})

	it('tolerates non-resume input', () => {
		expect(findLegacyFields(null)).toEqual([])
		expect(findLegacyFields('nope')).toEqual([])
	})
})
