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
import { STYLESHEET_MARKER } from './lib/stylesheetMarker'
import type { ResumeDocument } from './types/resume'

// resume-cli's PDF export reads these off the theme module
// (its `loadTheme` is the entry itself, not package.json):
// emulate print media, an A4 paper, and the documented print canvas
// (A4 at 96 dpi) as the page viewport.
export const pdfRenderOptions = { format: 'A4', mediaType: 'print' } as const
export const pdfViewport = { width: 794, height: 1123 } as const

// Kept in sync with the inline copy in `src/index.html` — the one
// there boots the dev/preview page, the one here the published file.
const schemeScript = `(function () {
	var root = document.documentElement
	var forced = null
	try {
		forced = localStorage.getItem('quill-scheme')
	} catch (e) {
		/* private mode */
	}
	var dark = forced
		? forced === 'dark'
		: window.matchMedia('(prefers-color-scheme: dark)').matches
	if (dark) root.classList.add('dark')
	if (!forced) {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', function (e) {
				root.classList.toggle('dark', e.matches)
			})
	}
})()`

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
 */
export function render(resume: ResumeDocument): string {
	const { title, lang } = resumeDocumentMetadata(resume)

	const document = renderToStaticMarkup(<Resume resume={resume} />)

	return `<!doctype html>
<html lang="${lang}">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${escapeHtml(title ?? 'Resume')}</title>
		<style>${STYLESHEET_MARKER}</style>
		<script>${schemeScript}</script>
	</head>
	<body>${document}</body>
</html>`
}
