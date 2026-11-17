import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		// The date seam serializes local-midnight dates as UTC
		// (`dateTime={start.toISOString()}`) — the snapshot test pins the
		// zone so the document's bytes are machine-independent.
		env: { TZ: 'UTC' },
	},
})
