import { afterEach, describe, expect, it, vi } from 'bun:test'
import resumeJson from '../../../resume.json'
import type { ResumeDocument } from '../../types/resume'
import { loadResume } from '../resume'

const demo = resumeJson as ResumeDocument
const local = { basics: { name: 'Local Resume' } } as ResumeDocument

afterEach(() => vi.restoreAllMocks())

describe('loadResume (local dev: resume.local.json, else demo)', () => {
	it('returns resume.local.json when the dev server serves it', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify(local), {
				headers: { 'content-type': 'application/json' },
			}),
		)

		expect(await loadResume()).toEqual(local)
	})

	it('falls back to the demo resume when the file is absent (404)', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, { status: 404 }),
		)

		expect(await loadResume()).toBe(demo)
	})

	it('falls back to the demo resume when the fetch fails', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('no server'))

		expect(await loadResume()).toBe(demo)
	})
})
