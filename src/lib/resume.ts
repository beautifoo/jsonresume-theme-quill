/**
 * Local-dev resume selection: the dev server (src/index.tsx) serves
 * resume.local.json when that file is present, and this falls back to
 * the repo's demo resume — statically imported, so the personal file
 * is never bundled into the page, the dist build, or the npm package.
 */

import demo from '../../resume.json'
import type { ResumeDocument } from '../types/resume'

export async function loadResume(): Promise<ResumeDocument> {
	try {
		const res = await fetch('/resume')
		if (res.ok) return (await res.json()) as ResumeDocument
	} catch {
		// No dev server (page opened without it) — use the demo resume.
	}

	return demo as ResumeDocument
}
