import { serve } from 'bun'
import compare from './compare.html'
import index from './index.html'

const server = serve({
	routes: {
		// Dev-only theme comparison tool (excluded from the dist build)
		'/compare': compare,
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
