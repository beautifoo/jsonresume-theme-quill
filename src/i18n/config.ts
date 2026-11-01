import deTranslations from './locales/de.json'
import en from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import itTranslations from './locales/it.json'
import ptTranslations from './locales/pt.json'
import ruTranslations from './locales/ru.json'
import zhTranslations from './locales/zh.json'

export type Locale = 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'ru' | 'zh'

export const locales = {
	en: {
		messages: en,
		name: 'English',
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
	it: {
		messages: itTranslations,
		name: 'Italiano',
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
