import { defineConfig } from '@playwright/test'

// Browser-side verification that the DOM tests cannot give: the compare
// page's print preview must actually apply the compiled stylesheet's
// `@media print` rules in a real browser. Serves the dev page on bun.
export default defineConfig({
	testDir: './src/e2e',
	// The spec is named *.browser.ts — not *.spec.ts — so bun test's file
	// discovery skips it; only `playwright test` (bun run test:browser) runs it.
	testMatch: '**/*.browser.ts',
	use: { baseURL: 'http://localhost:3000' },
	webServer: {
		command: 'bun run dev',
		url: 'http://localhost:3000/compare',
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
})
