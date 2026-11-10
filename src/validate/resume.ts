/**
 * The **resume contract** (ADR 0003): the theme's typed commitment to
 * the resume document, checked at build time.
 *
 * Two checks, one entry:
 *
 * - **stable** — the 2.x schema (`schema.ts`), checked with valibot.
 *   Violations are a broken document; `build.ts` fails the build.
 * - **legacy** — known 1.x field names (`legacy.ts`), a direct table
 *   walk. A valid but outdated document; `build.ts` prints a migration
 *   checklist.
 *
 * The module returns issues; it never prints and never exits. valibot
 * is a devDependency, so nothing in this module reaches the published
 * bundle.
 */

import * as v from 'valibot'
import { getDotPath } from 'valibot'
import { findLegacyFields, type LegacyIssue } from './legacy'
import { resumeSchema } from './schema'

type StableIssue = {
	/** Dot path of the offending value, e.g. `basics.email` or `work[0].startDate` */
	path: string
	message: string
}

export interface ValidationResult {
	/** Stable (2.x) violations — the caller fails on these */
	stable: StableIssue[]
	/** Legacy (1.x) findings — the caller warns on these */
	legacy: LegacyIssue[]
}

function collectIssues(
	schema: v.GenericSchema,
	value: unknown,
): v.BaseIssue<unknown>[] {
	return v.safeParse(schema, value).issues ?? []
}

/**
 * Run the resume contract against a raw resume document.
 * Pure: returns issues; severity (fail vs warn) belongs to the caller.
 */
export function validateResume(document: unknown): ValidationResult {
	const stable = collectIssues(resumeSchema, document).map((issue) => ({
		path: getDotPath(issue) ?? '(root)',
		message: issue.message,
	}))

	// The table walk is the legacy check itself — the table knows whether
	// there are findings; no gate-and-rewrite double pass.

	return {
		stable,
		legacy: findLegacyFields(document),
	}
}
