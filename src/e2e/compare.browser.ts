import { expect, test } from '@playwright/test'

test('the A4 target previews the print target', async ({ page }) => {
	await page.goto('/compare')

	// The screen panels are up. (The loaded resume is deliberately
	// local-agnostic — resume.local.json wins when present — so the page
	// chrome and the preview mechanism are what is under test here.)
	await expect(page.getByText('Quill — default')).toBeVisible()

	// Switch to the A4 target — the print preview
	await page.getByRole('button', { name: 'A4', exact: true }).click()

	const sheet = page.frameLocator('iframe').first()
	await expect(sheet.locator('body')).toBeVisible()
	expect((await sheet.locator('body').textContent()) ?? '').not.toMatch(/^\s*$/)

	// The canvas is the print canvas (pdfViewport in theme.tsx), not a copy
	await expect(page.locator('iframe').first()).toHaveCSS('width', '794px')

	// The stylesheet's `@media print` rules are re-emitted un-wrapped into
	// the preview document: the print palette's ink (.24) exists only in the
	// print block of the compiled stylesheet
	const srcDoc = await page.locator('iframe').first().getAttribute('srcdoc')
	expect(srcDoc ?? '').toContain('oklch(.24 0 0)')
})
