/**
 * Print preview — the on-screen stand-in for the print target.
 *
 * A browser cannot switch a document into print media, so the preview
 * derives its ingredients from the published artifacts: the A4 canvas
 * size from `pdfViewport` (`theme.tsx`), and the compiled stylesheet's
 * `@media print` rules re-emitted un-wrapped — from the stylesheet
 * itself, so when the print rules change, the preview follows. Nothing
 * is hand-maintained, and nothing is copied from the published document:
 * its `@page` margins and multi-page flow only appear in the real PDF.
 *
 * Development tooling only — the compare page (compare.tsx) is the sole
 * consumer, and it is excluded from dist.
 */

import { type FC, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { pdfViewport } from './theme'
import { type LayoutMode, Resume, type ThemeVariant } from './components/Resume'
import type { Locale } from './i18n/config'
import { resumeDocumentMetadata } from './lib/document'
import type { ResumeDocument } from './types/resume'

/**
 * The compiled stylesheet's `@media print` rules, re-emitted without the
 * media wrapper, so they apply in an on-screen preview document.
 */
export function unmediaPrintRules(css: string): string {
	const host = document.createElement('style')
	host.textContent = css
	document.head.append(host)
	try {
		const out: string[] = []
		const walk = (rules: CSSRuleList | null, inPrint: boolean) => {
			for (let i = 0; rules && i < rules.length; i++) {
				const rule = rules[i]
				if (!rule) continue
				if (rule instanceof CSSMediaRule) {
					walk(rule.cssRules, inPrint || rule.conditionText === 'print')
				} else if (rule instanceof CSSGroupingRule) {
					// @layer / @supports blocks may nest print rules (Tailwind output)
					walk(rule.cssRules, inPrint)
				} else if (inPrint) {
					out.push(rule.cssText)
				}
			}
		}
		walk(host.sheet?.cssRules ?? null, false)
		return out.join('\n')
	} finally {
		host.remove()
	}
}

/**
 * The preview document: the stylesheet, the un-wrapped print rules, and
 * the rendered resume. Deliberately its own small document — the
 * published file keeps its larger skeleton in `theme.tsx`.
 */
export function printSheetDocument(
	css: string,
	printRules: string,
	markup: string,
	lang: string,
): string {
	return `<!doctype html><html lang="${lang}"><head><meta charset="UTF-8"><style>${css}\n${printRules}</style></head><body>${markup}</body></html>`
}

const PrintSheet: FC<{
	doc: string
	resume: ResumeDocument
	layout: LayoutMode
	variant: ThemeVariant
	locale: Locale
}> = ({ doc, resume, layout, variant, locale }) => {
	// One A4 page at 96 dpi — the print canvas (`pdfViewport`, theme.tsx)
	const [height, setHeight] = useState<number>(pdfViewport.height)
	const printRules = useMemo(() => unmediaPrintRules(doc), [doc])
	const markup = useMemo(
		() =>
			renderToStaticMarkup(
				<Resume resume={resume} layout={layout} variant={variant} locale={locale} />,
			),
		[resume, layout, variant, locale],
	)
	const { lang } = resumeDocumentMetadata(resume)
	return (
		<iframe
			title={`Quill — ${variant} (A4 print)`}
			className='mx-auto block bg-bg'
			style={{ width: pdfViewport.width, height }}
			srcDoc={printSheetDocument(doc, printRules, markup, lang)}
			onLoad={(e) => {
				const d = e.currentTarget.contentDocument
				if (d) setHeight(Math.max(pdfViewport.height, d.documentElement.scrollHeight))
			}}
		/>
	)
}

export { PrintSheet }
