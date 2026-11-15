import { existsSync, readFileSync } from 'node:fs'
import { serve } from 'bun'
import compare from './compare.html'
import index from './index.html'

const server = serve({
	routes: {
		// Dev-only theme comparison tool (excluded from the dist build)
		'/compare': compare,
		// Dev-only resume: read per request so edits show on refresh; 404
		// when absent, and the app falls back to its bundled demo resume.
		'/resume': () => {
			const file = 'resume.local.json'
			if (!existsSync(file)) return new Response(null, { status: 404 })
			return new Response(readFileSync(file, 'utf8'), {
				headers: { 'content-type': 'application/json' },
			})
		},
		// Serve index.html for all unmatched routes.
		'/*': index,
	},

	development: process.env.NODE_ENV !== 'production' && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
})

console.log(`🚀 Server running at ${server.url}`)
console.log(`🔎 Theme comparison at ${server.url}compare`)
