/**
 * Theme comparison page — a development tool, excluded from dist.
 *
 * Renders the theme's variants side by side for the loaded resume —
 * resume.local.json when present, else the repo's demo resume — with
 * target/layout/scheme/variant/language controls, at full resolution for
 * a human eye. The A4 target previews the print target: an iframe of
 * the published document at the 794px print canvas (A4 at 96 dpi). A
 * browser cannot switch a document into print media on screen, so the
 * stylesheet's `@media print` rules are re-emitted un-wrapped (derived
 * at runtime — nothing hand-maintained), and the light palette, 12px
 * root scale, and print geometry apply for real. Each panel is a
 * self-contained `Resume` (its own Quill
 * provider), so the matrix previews exactly what the published page
 * renders — same icon weight, same date semantics.
 */

import { type FC, StrictMode, Suspense, use, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { type LayoutMode, Resume, type ThemeVariant } from './components/Resume'
import { type Locale, locales } from './i18n/config'
import { resolveLocale } from './i18n/resolveLocale'
import { resumeDocumentMetadata } from './lib/document'
import { loadResume } from './lib/resume'
import type { ResumeDocument } from './types/resume'

const Button: FC<{ value: string; active: boolean; onClick: () => void }> = ({
	value,
	active,
	onClick,
}) => (
	<button
		type='button'
		onClick={onClick}
		className={
			'rounded-full px-3 py-1 text-[0.8rem] transition-colors ' +
			(active
				? 'bg-ink text-bg'
				: 'border border-line text-ink-3 hover:text-ink')
		}
	>
		{value}
	</button>
)

const Label: FC<{ children: React.ReactNode }> = ({ children }) => (
	<span className='text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-4'>
		{children}
	</span>
)

const Caption: FC<{ title: string; sub: string }> = ({ title, sub }) => (
	<div className='mb-2 flex items-baseline gap-2 text-[0.85rem]'>
		<span className='font-semibold text-ink'>{title}</span>
		<span className='text-ink-4'>{sub}</span>
	</div>
)

const FOIL_VARIANTS: ThemeVariant[] = ['default', 'monochrome']

// One A4 page at 96 dpi — the print canvas (`pdfViewport` in theme.tsx)
const A4_HEIGHT = 1123

// Module-level so `use()` receives a stable promise across renders.
const resumePromise = loadResume()

// The page's own stylesheet, for the A4 preview's iframe: the published
// document inlines this same compiled CSS, so the iframe renders exactly
// what the PDF contains.
const stylesheetPromise = fetch(
	document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href ??
		'index.css',
).then((r) => r.text())

/**
 * The print target, live: the resume rendered to the published document
 * shape, embedded in an A4-sized iframe with the stylesheet's print
 * rules applied (un-wrapped from `@media print` at runtime). The
 * published file's `@page` margins and the multi-page flow only appear
 * in the real PDF.
 */

/**
 * The compiled stylesheet's `@media print` rules, re-emitted without the
 * media wrapper, so they apply in an on-screen preview document. Derived
 * from the stylesheet itself: when the print rules change, the preview
 * follows — no copy to keep in sync.
 */
function unmediaPrintRules(css: string): string {
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
const PrintSheet: FC<{
	doc: string
	resume: ResumeDocument
	layout: LayoutMode
	variant: ThemeVariant
	locale: Locale
}> = ({ doc, resume, layout, variant, locale }) => {
	const [height, setHeight] = useState(A4_HEIGHT)
	const printRules = useMemo(() => unmediaPrintRules(doc), [doc])
	const markup = useMemo(
		() =>
			renderToStaticMarkup(
				<Resume
					resume={resume}
					layout={layout}
					variant={variant}
					locale={locale}
				/>,
			),
		[resume, layout, variant, locale],
	)
	const { lang } = resumeDocumentMetadata(resume)
	return (
		<iframe
			title={`Quill — ${variant} (A4 print)`}
			className='mx-auto block w-[794px] bg-bg'
			style={{ height }}
			srcDoc={`<!doctype html><html lang="${lang}"><head><meta charset="UTF-8"><style>${doc}\n${printRules}</style></head><body>${markup}</body></html>`}
			onLoad={(e) => {
				const d = e.currentTarget.contentDocument
				if (d) setHeight(Math.max(A4_HEIGHT, d.documentElement.scrollHeight))
			}}
		/>
	)
}

const Compare: FC = () => {
	const resume = use(resumePromise)
	const css = use(stylesheetPromise)
	const [target, setTarget] = useState<'screen' | 'a4'>('screen')
	const [layout, setLayout] = useState<LayoutMode>('double')
	const [scheme, setScheme] = useState<'light' | 'dark'>('light')
	const [variant, setVariant] = useState<ThemeVariant | 'all'>('all')
	const [locale, setLocale] = useState(() => resolveLocale(resume))

	const quillVariants = FOIL_VARIANTS.filter(
		(v) => variant === 'all' || v === variant,
	)

	const quillPanels = useMemo(
		() =>
			quillVariants.map((v) => (
				<figure key={v} className='m-0'>
					<Caption
						title={`Quill — ${v}`}
						sub={target === 'a4' ? 'A4 print, always light' : 'screen'}
					/>
					<div
						className={
							'overflow-auto rounded-lg border border-line bg-bg ' +
							(target === 'a4' ? '' : 'min-h-120 ') +
							(scheme === 'dark' && target === 'screen' ? 'dark' : '')
						}
					>
						{target === 'a4' ? (
							<PrintSheet
								doc={css}
								resume={resume}
								variant={v}
								layout={layout}
								locale={locale}
							/>
						) : (
							<Resume
								resume={resume}
								variant={v}
								layout={layout}
								locale={locale}
							/>
						)}
					</div>
				</figure>
			)),
		[resume, css, target, layout, scheme, locale, quillVariants],
	)

	return (
		<div className='min-h-dvh bg-[oklch(0.96_0_0)] font-sans text-ink-2'>
			<header className='sticky top-0 z-10 border-b border-line bg-[oklch(0.985_0_0)] px-6 py-3'>
				<div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem]'>
					<span className='text-[1.05rem] font-semibold text-ink'>
						Quill — theme comparison
					</span>
					<Label>target</Label>
					<div className='flex gap-1.5'>
						<Button
							value='screen'
							active={target === 'screen'}
							onClick={() => setTarget('screen')}
						/>
						<Button
							value='A4'
							active={target === 'a4'}
							onClick={() => setTarget('a4')}
						/>
					</div>
					<Label>layout</Label>
					<div className='flex gap-1.5'>
						<Button
							value='single'
							active={layout === 'single'}
							onClick={() => setLayout('single')}
						/>
						<Button
							value='double'
							active={layout === 'double'}
							onClick={() => setLayout('double')}
						/>
					</div>
					<Label>scheme</Label>
					<div className='flex gap-1.5'>
						<Button
							value='light'
							active={scheme === 'light'}
							onClick={() => setScheme('light')}
						/>
						<Button
							value='dark'
							active={scheme === 'dark'}
							onClick={() => setScheme('dark')}
						/>
					</div>
					<Label>variants</Label>
					<div className='flex gap-1.5'>
						<Button
							value='all'
							active={variant === 'all'}
							onClick={() => setVariant('all')}
						/>
						{FOIL_VARIANTS.map((v) => (
							<Button
								key={v}
								value={v}
								active={variant === v}
								onClick={() => setVariant(v)}
							/>
						))}
					</div>
					<Label>language</Label>
					<div className='flex gap-1.5'>
						{(Object.keys(locales) as Locale[]).map((l) => (
							<Button
								key={l}
								value={locales[l].name}
								active={locale === l}
								onClick={() => setLocale(l)}
							/>
						))}
					</div>
				</div>
			</header>

			<main
				className={
					'grid gap-6 p-6 ' +
					(target === 'a4'
						? '[grid-template-columns:repeat(auto-fill,minmax(800px,1fr))]' // the 794px A4 sheet must fit unclipped
						: '[grid-template-columns:repeat(auto-fill,minmax(560px,1fr))]')
				}
			>
				{quillPanels}
			</main>

			<footer className='px-6 pb-8 text-[0.8rem] text-ink-3'>
				The A4 target is the published document at the 794px print canvas (light
				palette, 12px root, always light); the `@page` margins and multi-page
				flow only appear in the real PDF from the standalone resume page.
			</footer>
		</div>
	)
}

export { Compare }
export default Compare

// Mount when served as a page (compare.html)
if (typeof document !== 'undefined') {
	const el = document.getElementById('compare-root')
	if (el) {
		createRoot(el).render(
			<StrictMode>
				<Suspense fallback={null}>
					<Compare />
				</Suspense>
			</StrictMode>,
		)
	}
}
