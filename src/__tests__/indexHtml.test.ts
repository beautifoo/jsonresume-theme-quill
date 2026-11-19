import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, it } from 'vitest'
import { schemeBootstrap } from '../lib/schemeBootstrap'

// The screen-scheme bootstrap is written out twice — into the published file
// (theme.tsx) and the dev page (index.html, a raw string that cannot import
// the module). A byte-exact compare is fragile: the two form to tabs vs spaces
// under their own formatters. So we compare the *logic* — with comments and
// whitespace collapsed, the dev copy must still equal the shared const.
const html = readFileSync(resolve(process.cwd(), 'src', 'index.html'), 'utf8')
const inline = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]
const normalize = (src: string) =>
	src
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\/\/[^\n]*/g, '')
		.replace(/\s+/g, ' ')
		.trim()

it('keeps the dev page scheme bootstrap in sync with the shared const', () => {
	expect(inline).toBeDefined()
	expect(normalize(inline ?? '')).toBe(normalize(schemeBootstrap))
})
