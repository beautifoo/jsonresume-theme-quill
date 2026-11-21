/**
 * Theme comparison page — a development tool, excluded from dist.
 *
 * Renders the theme's variants side by side for the loaded resume —
 * resume.local.json when present, else the repo's demo resume — with
 * target/layout/scheme/variant/language controls, at full resolution for
 * a human eye. The A4 target is the print preview (`printPreview.tsx`):
 * an iframe of the published document at the print canvas, with the
 * stylesheet's `@media print` rules re-emitted un-wrapped — a browser
 * cannot switch a document into print media on screen. Each panel is a
 * self-contained `Resume` (its own Quill
 * provider), so the matrix previews exactly what the published page
 * renders — same icon weight, same date semantics.
 */

import { type FC, StrictMode, Suspense, use, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { pdfViewport } from './theme'
import {
	type LayoutMode,
	Resume,
	THEME_VARIANTS,
	type ThemeVariant,
} from './components/Resume'
import { type Locale, locales } from './i18n/config'
import { resolveLocale } from './i18n/resolveLocale'
import { PrintSheet } from './printPreview'
import { loadResume } from './lib/resume'

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

// Module-level so `use()` receives a stable promise across renders.
const resumePromise = loadResume()

// The page's own stylesheet, for the print preview's iframe: the published
// document inlines this same compiled CSS, so the iframe renders exactly
// what the PDF contains.
const stylesheetPromise = fetch(
	document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href ??
		'index.css',
).then((r) => r.text())

const Compare: FC = () => {
	const resume = use(resumePromise)
	const css = use(stylesheetPromise)
	const [target, setTarget] = useState<'screen' | 'a4'>('screen')
	const [layout, setLayout] = useState<LayoutMode>('double')
	const [scheme, setScheme] = useState<'light' | 'dark'>('light')
	const [variant, setVariant] = useState<ThemeVariant | 'all'>('all')
	const [locale, setLocale] = useState(() => resolveLocale(resume))

	const quillVariants = THEME_VARIANTS.filter(
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
						{THEME_VARIANTS.map((v) => (
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
						? '[grid-template-columns:repeat(auto-fill,minmax(800px,1fr))]' // the A4 sheet (pdfViewport) must fit unclipped
						: '[grid-template-columns:repeat(auto-fill,minmax(560px,1fr))]')
				}
			>
				{quillPanels}
			</main>

			<footer className='px-6 pb-8 text-[0.8rem] text-ink-3'>
				{`The A4 target is the published document at the ${pdfViewport.width}px print canvas (light palette, 12px root, always light); the @page margins and multi-page flow only appear in the real PDF from the standalone resume page.`}
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
