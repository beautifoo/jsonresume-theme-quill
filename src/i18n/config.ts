import deTranslations from './locales/de.json'
import en from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import itTranslations from './locales/it.json'
import ptTranslations from './locales/pt.json'
import ruTranslations from './locales/ru.json'
import zhTranslations from './locales/zh.json'

export type Locale = 'en' | 'it' | 'de' | 'fr' | 'es' | 'pt' | 'ru' | 'zh'

/**
 * The closed set of section-title translation keys (`sections.*`),
 * derived from the English catalog — a mistyped key is a type error.
 */
export type SectionTitleKey = `sections.${keyof typeof en.sections}`

// The locale set is deliberately ordered, not alphabetical: English
// first, Italian right after it, the rest alphabetical.
export const locales = {
	en: {
		messages: en,
		name: 'English',
	},
	it: {
		messages: itTranslations,
		name: 'Italiano',
	},
	de: {
		messages: deTranslations,
		name: 'Deutsch',
	},
	fr: {
		messages: frTranslations,
		name: 'Français',
	},
	es: {
		messages: esTranslations,
		name: 'Español',
	},
	pt: {
		messages: ptTranslations,
		name: 'Português',
	},
	ru: {
		messages: ruTranslations,
		name: 'Русский',
	},
	zh: {
		messages: zhTranslations,
		name: '中文',
	},
}
