import type { ResumeDocument } from '../types/resume'
import { type Locale, locales } from './config'

/**
 * The supported locale for a resume document: its declared
 * `language` when we ship one, otherwise English. The `language`
 * field predates the current JSON Resume schema, so it arrives as
 * `unknown` via the top-level index signature.
 */
export function resolveLocale(resume: ResumeDocument): Locale {
	const lang = resume.language
	return typeof lang === 'string' && locales[lang as Locale]
		? (lang as Locale)
		: 'en'
}
