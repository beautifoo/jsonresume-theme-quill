/**
 * Document metadata for a published resume page: how the page
 * announces itself (`<title>` and the document `lang`), derived from
 * the resume document. Pure derivation plus one side-effecting
 * applier — entries (the standalone page) call the applier; hosts that
 * render the theme inside an existing document keep their own title.
 */

import type { Resume as ResumeDocument } from '@jsonresume/types'
import { resolveLocale } from '../i18n/resolveLocale'

export interface DocumentMetadata {
	/** `Name — Label`, or the name alone; undefined when there is no name */
	title?: string
	/** The rendered language, for the document `lang` attribute */
	lang: string
}

export function resumeDocumentMetadata(
	resume: ResumeDocument,
): DocumentMetadata {
	const name = resume.basics?.name
	const label = resume.basics?.label
	return {
		title: name ? (label != null ? `${name} — ${label}` : name) : undefined,
		lang: resolveLocale(resume),
	}
}

/** Apply the metadata to the current document. */
export function applyDocumentMetadata(resume: ResumeDocument): void {
	const { title, lang } = resumeDocumentMetadata(resume)
	if (title) document.title = title
	document.documentElement.lang = lang
}
