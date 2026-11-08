import { describe, expect, it } from 'vitest'
import { type Locale, locales } from '../config'

/**
 * Every shipped locale is a *complete* catalog. This IntlProvider has
 * no per-locale fallback: a missing key renders its raw form (the four
 * 34-key catalogs shipped "common.awardedBy" holes — French and
 * Spanish awards rendered a key, not a sentence). The English catalog
 * is the key set of record, gated in both directions: a missing key is
 * a render hole, an extra one is a stale key or a typo.
 */

function messageKeys(messages: unknown, prefix = ''): string[] {
	if (typeof messages !== 'object' || messages === null) {
		return prefix ? [prefix] : []
	}
	return Object.entries(messages).flatMap(([key, value]) =>
		messageKeys(value, prefix ? `${prefix}.${key}` : key),
	)
}

const enKeys = [...messageKeys(locales.en.messages)].sort()

describe('the locale set', () => {
	it('orders English first, Italian right after it, the rest alphabetical', () => {
		expect(Object.keys(locales)).toEqual([
			'en',
			'it',
			'de',
			'fr',
			'es',
			'pt',
			'ru',
			'zh',
		])
	})

	for (const locale of Object.keys(locales)) {
		if (locale === 'en') continue

		it(`${locale} is a complete catalog (same key set as en)`, () => {
			const keys = [...messageKeys(locales[locale as Locale].messages)].sort()
			expect(keys).toEqual(enKeys)
		})
	}
})
