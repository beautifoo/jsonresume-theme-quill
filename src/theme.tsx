/**
 * The published package's entry (ADR 0004): renders a resume document
 * to a fully self-contained Quill HTML document — stylesheet inlined,
 * markup static, no client JavaScript.
 *
 * resume-cli consumes this as `theme.render(resume) → html`: the
 * exported file opens as a static web page, puppeteer prints it to
 * PDF, and static parsers (`resume audit`'s cheerio) read the real
 * DOM. No client JS means nothing that can fail to hydrate.
 *
 * The build also calls this to emit `dist/demo.html` — the same
 * string resume-cli will get, for a quick look.
 */

import { renderToStaticMarkup } from 'react-dom/server'
import './index.css'
import { Resume } from './components/Resume'
import { resumeDocumentMetadata } from './lib/document'
import { schemeBootstrap } from './lib/schemeBootstrap'
import { STYLESHEET_MARKER } from './lib/stylesheetMarker'
import type { ResumeDocument } from './types/resume'

// resume-cli's PDF export reads these off the theme module
// (its `loadTheme` is the entry itself, not package.json):
// emulate print media, an A4 paper, and the documented print canvas
// (A4 at 96 dpi) as the page viewport.
export const pdfRenderOptions = { format: 'A4', mediaType: 'print' } as const
export const pdfViewport = { width: 794, height: 1123 } as const

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
}

/**
 * Render a resume document to a complete, self-contained HTML
 * document. Duration strings ("3 yrs 2 mos") are measured from the
 * moment of rendering and freeze with the exported file — re-export
 * to refresh. (shortcut: static export freezes "now"; revisit if
 * real client interactivity ever lands)
 *
 * `now` pins the open-ended durations to a fixed instant (tests) —
 * otherwise the wall clock, as for the published file.
 *
 * The column layout is read from the document's own `custom.quill.layout`
 * (resume-cli passes nothing else to `render`); a missing or malformed
 * value falls back to the `double` default. DOM order is identical in
 * both layouts (ADR 0001), so PDF and `resume audit` are unaffected.
 */
export function render(
	resume: ResumeDocument,
	{ now }: { now?: Date } = {},
): string {
	const { title, lang } = resumeDocumentMetadata(resume)

	const layout = resume.custom?.quill?.layout === 'single' ? 'single' : 'double'

	const document = renderToStaticMarkup(
		<Resume resume={resume} layout={layout} now={now} />,
	)

	return `<!doctype html>
<html lang="${lang}">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${escapeHtml(title ?? 'Resume')}</title>
		<style>${STYLESHEET_MARKER}</style>
		<script>${schemeBootstrap()}</script>
	</head>
	<body>${document}</body>
</html>`
}
