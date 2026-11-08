/**
 * The resume contract as a build-time gate (ADR 0003): the shipped
 * resume must be stable (2.x), and known 1.x fields surface as a
 * migration checklist. Run by the build, or standalone for fast
 * feedback while editing a resume: `bun run validate`.
 *
 * valibot is a devDependency, so this never reaches the published
 * bundle — it is never imported by the app, only by build tooling.
 */

import { existsSync, readFileSync } from 'node:fs'
import { legacyMessage } from './legacy'
import { validateResume } from './resume'

export function checkResumeContract(path: string = 'resume.json'): void {
	if (!existsSync(path)) return // a resume is optional for a build

	try {
		const document = JSON.parse(readFileSync(path, 'utf8'))
		const { stable, legacy } = validateResume(document)

		if (legacy.length > 0) {
			console.log(
				`\n⚠️  ${legacy.length} legacy (1.x) field${legacy.length === 1 ? '' : 's'} — the theme renders 2.x, migrate these:`,
			)
			for (const issue of legacy) console.log(`   • ${legacyMessage(issue)}`)
			console.log()
		}

		if (stable.length > 0) {
			console.error(
				`\n❌ ${path} is not a stable (2.x) resume — ${stable.length} violation${stable.length === 1 ? '' : 's'}:`,
			)
			for (const issue of stable)
				console.error(`   • ${issue.path}: ${issue.message}`)
			process.exit(1)
		}

		console.log(`✅ ${path} is a stable (2.x) resume`)
	} catch (error) {
		console.error(`❌ ${path} is not valid JSON: ${String(error)}`)
		process.exit(1)
	}
}

// Standalone: `bun run validate` (or `bun src/validate/cli.ts [path]`)
if (import.meta.main) {
	checkResumeContract(process.argv[2] ?? 'resume.json')
}
