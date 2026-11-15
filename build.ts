#!/usr/bin/env bun
import { existsSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import plugin from 'bun-plugin-tailwind'
import { checkResumeContract } from './src/validate/cli'
import { STYLESHEET_MARKER } from './src/lib/stylesheetMarker'

if (process.argv.includes('--help') || process.argv.includes('-h')) {
	console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --sourcemap <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
`)
	process.exit(0)
}

const toCamelCase = (str: string): string =>
	str.replace(/-[a-z]/g, (g) => g.slice(1).toUpperCase())

const parseValue = (value: string): boolean | number | string | string[] => {
	if (value === 'true') return true
	if (value === 'false') return false

	if (/^\d+$/.test(value)) return parseInt(value, 10)
	if (/^\d*\.\d+$/.test(value)) return parseFloat(value)

	if (value.includes(',')) return value.split(',').map((v) => v.trim())

	return value
}

function parseArgs(): Partial<Bun.BuildConfig> {
	// The CLI accepts any Bun build flag, so keys are dynamic — build
	// through a string-indexed view, typed at the return.
	const config: Record<string, unknown> = {}
	const args = process.argv.slice(2)

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]
		if (arg === undefined) continue
		if (!arg.startsWith('--')) continue

		if (arg.startsWith('--no-')) {
			const key = toCamelCase(arg.slice(5))
			config[key] = false
			continue
		}

		if (
			!arg.includes('=') &&
			(i === args.length - 1 || args[i + 1]?.startsWith('--'))
		) {
			const key = toCamelCase(arg.slice(2))
			config[key] = true
			continue
		}

		let key: string
		let value: string

		if (arg.includes('=')) {
			;[key, value] = arg.slice(2).split('=', 2) as [string, string]
		} else {
			key = arg.slice(2)
			value = args[++i] ?? ''
		}

		key = toCamelCase(key)

		if (key.includes('.')) {
			const [parentKey, childKey] = key.split('.')
			if (parentKey === undefined || childKey === undefined) continue
			if (typeof config[parentKey] !== 'object' || config[parentKey] === null) {
				config[parentKey] = {}
			}
			;(config[parentKey] as Record<string, unknown>)[childKey] =
				parseValue(value)
		} else {
			config[key] = parseValue(value)
		}
	}

	return config as Partial<Bun.BuildConfig>
}

const formatFileSize = (bytes: number): string => {
	const units = ['B', 'KB', 'MB', 'GB']
	let size = bytes
	let unitIndex = 0

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024
		unitIndex++
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`
}

console.log('\n🚀 Starting build process...\n')

// The resume contract (ADR 0003): the shipped resume must be stable
// (2.x), with a legacy migration checklist. See src/validate/cli.ts.
checkResumeContract()

const cliConfig = parseArgs()
const outdir = cliConfig.outdir || path.join(process.cwd(), 'dist')

if (existsSync(outdir)) {
	console.log(`🗑️ Cleaning previous build at ${outdir}`)
	await rm(outdir, { recursive: true, force: true })
}

const start = performance.now()

// The theme is a Node module (ADR 0004): one ESM entry exporting
// render(resume) → a self-contained HTML document. The stylesheet
// builds as a sibling asset, then inlines into it.
const result = await Bun.build({
	entrypoints: [path.resolve('src/theme.tsx')],
	outdir,
	plugins: [plugin],
	minify: true,
	target: 'node',
	format: 'esm',
	sourcemap: 'none',
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
	},
	...cliConfig,
})

if (!result.success) {
	for (const log of result.logs) console.error(log.message)
	process.exit(1)
}

// Inline the compiled stylesheet: the marker in src/theme.tsx sits
// inside a string literal in the bundle, so the JSON-escaped (but
// unquoted) CSS text drops straight in.
const cssOutput = result.outputs.find((o) => o.path.endsWith('.css'))
if (!cssOutput)
	throw new Error('Expected a CSS output — is src/index.css imported?')
const css = await Bun.file(cssOutput.path).text()

const entryPath = path.join(outdir, 'theme.js')
let entry = await readFile(entryPath, 'utf8')
if (!entry.includes(STYLESHEET_MARKER)) {
	throw new Error('Stylesheet marker not found in the bundle')
}
entry = entry.replaceAll(STYLESHEET_MARKER, JSON.stringify(css).slice(1, -1))

const finalEntryPath = path.join(outdir, 'index.js')
await writeFile(finalEntryPath, entry)
await rm(entryPath, { force: true })
await rm(cssOutput.path, { force: true })

// The published file, with the repo's demo resume — for a quick look.
const { render } = await import(finalEntryPath)
const demoResume = JSON.parse(
	await readFile(path.resolve('resume.json'), 'utf8'),
)
const demoPath = path.join(outdir, 'demo.html')
await writeFile(demoPath, render(demoResume))

const end = performance.now()

const outputTable = [finalEntryPath, demoPath].map((file) => {
	const size = Bun.file(file).size
	return {
		File: path.relative(process.cwd(), file),
		Type: path.extname(file),
		Size: formatFileSize(size),
	}
})

console.table(outputTable)
const buildTime = (end - start).toFixed(2)

console.log(`\n✅ Build completed in ${buildTime}ms\n`)
