import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, it } from 'bun:test'
import { schemeBootstrap } from '../lib/schemeBootstrap'

// The compare page inlines the forced-light variant of the screen-scheme
// bootstrap (the page is judged by hand, so it never follows the system
// preference or a stored scheme). The HTML copy is a raw string that
// cannot import the module, so the same logic-equality gate as
// indexHtml.test.ts keeps it from drifting.
const html = readFileSync(resolve(process.cwd(), 'src', 'compare.html'), 'utf8')
const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]
const normalize = (src: string) =>
	src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\/\/[^\n]*/g, '')
		.replace(/\s+/g, ' ')
		.trim()

it('keeps the compare page scheme bootstrap in sync with the forced-light variant', () => {
	expect(inline).toBeDefined()
	expect(normalize(inline ?? '')).toBe(normalize(schemeBootstrap('light')))
})
