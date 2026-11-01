/**
 * Theme comparison page — a development tool, excluded from dist.
 *
 * Renders the Folio variants (native, with layout/scheme controls)
 * alongside the registry reference themes (in iframes) for the same
 * resume, at full resolution for a human eye.
 */

import * as academicCvLite from 'jsonresume-theme-academic-cv-lite'
import * as dataDriven from 'jsonresume-theme-data-driven'
import * as governmentStandard from 'jsonresume-theme-government-standard'
import * as pro from 'jsonresume-theme-pro'
import * as professional from 'jsonresume-theme-professional'
import * as reference from 'jsonresume-theme-reference'
import { type FC, StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'use-intl'
import resume from '../resume.json'
import rich from './compare/resume-rich.json'
import { type LayoutMode, Resume, type ThemeVariant } from './components/Resume'
import { type Locale, locales } from './i18n/config'
import type { ResumeSchema } from './types/resumeSchema'

type RenderFn = (resume: ResumeSchema) => unknown

const referenceThemes: { name: string; render: RenderFn }[] = [
	{ name: 'academic-cv-lite', render: (r) => pick(academicCvLite)(r) },
	{ name: 'data-driven', render: (r) => pick(dataDriven)(r) },
	{ name: 'government-standard', render: (r) => pick(governmentStandard)(r) },
	{ name: 'pro', render: (r) => pick(pro)(r) },
	{ name: 'professional', render: (r) => pick(professional)(r) },
	{ name: 'reference', render: (r) => pick(reference)(r) },
]

function pick(mod: { render?: RenderFn; default?: { render?: RenderFn } }) {
	const render = mod.render ?? mod.default?.render
	if (!render) throw new Error('theme has no render() export')
	return render
}

/** Normalize a theme's output to a complete document for an iframe. */
function toSrcDoc(out: unknown): string {
	let html = ''
	if (typeof out === 'string') html = out
	else if (out && typeof out === 'object' && 'html' in out) {
		html = String((out as { html?: string }).html ?? '')
	}
	if (!html) return '<p>theme produced no output</p>'
	if (!/<!DOCTYPE|<html/i.test(html)) {
		html = `<!doctype html><html><head><meta charset="utf-8" /><style>body{margin:0}</style></head><body>${html}</body></html>`
	}
	return html
}

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

const FOIL_VARIANTS: ThemeVariant[] = ['folio', 'graphite']

const ComparePage: FC = () => {
	const [resumeName, setResumeName] = useState<'sample' | 'rich'>('rich')
	const [layout, setLayout] = useState<LayoutMode>('double')
	const [scheme, setScheme] = useState<'light' | 'dark'>('light')
	const [variant, setVariant] = useState<ThemeVariant | 'all'>('all')

	const resumeData = (resumeName === 'rich' ? rich : resume) as ResumeSchema
	const folioVariants = FOIL_VARIANTS.filter(
		(v) => variant === 'all' || v === variant,
	)

	const folioPanels = useMemo(
		() =>
			folioVariants.map((v) => (
				<figure key={v} className='m-0'>
					<Caption title={`Folio — ${v}`} sub='this theme' />
					<div
						className={
							'min-h-120 overflow-auto rounded-lg border border-line bg-bg ' +
							(scheme === 'dark' ? 'dark' : '')
						}
					>
						<Resume resume={resumeData} variant={v} layout={layout} />
					</div>
				</figure>
			)),
		[resumeData, layout, scheme, folioVariants],
	)

	const referencePanels = useMemo(
		() =>
			referenceThemes.map((theme) => (
				<figure key={theme.name} className='m-0'>
					<Caption title={theme.name} sub='jsonresume registry' />
					<iframe
						title={`Reference theme: ${theme.name}`}
						srcDoc={toSrcDoc(theme.render(resumeData))}
						className='h-120 w-full rounded-lg border border-line bg-white'
					/>
				</figure>
			)),
		[resumeData],
	)

	return (
		<div className='min-h-dvh bg-[oklch(0.96_0_0)] font-sans text-ink-2'>
			<header className='sticky top-0 z-10 border-b border-line bg-[oklch(0.985_0_0)] px-6 py-3'>
				<div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem]'>
					<span className='text-[1.05rem] font-semibold text-ink'>
						Folio — theme comparison
					</span>
					<Label>resume</Label>
					<div className='flex gap-1.5'>
						<Button
							value='sample (John Doe)'
							active={resumeName === 'sample'}
							onClick={() => setResumeName('sample')}
						/>
						<Button
							value='rich (fixture)'
							active={resumeName === 'rich'}
							onClick={() => setResumeName('rich')}
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
				</div>
			</header>

			<main className='grid gap-6 p-6 [grid-template-columns:repeat(auto-fill,minmax(560px,1fr))]'>
				{folioPanels}
				{referencePanels}
			</main>

			<footer className='px-6 pb-8 text-[0.8rem] text-ink-3'>
				Print target: open the standalone resume page and print — the PDF
				renders the light palette at a denser scale, always.
			</footer>
		</div>
	)
}

export const Compare: FC = () => {
	const lang = (rich as ResumeSchema).language
	const locale: Locale =
		lang && locales[lang as Locale] ? (lang as Locale) : 'en'

	return (
		<IntlProvider locale={locale} messages={locales[locale].messages}>
			<ComparePage />
		</IntlProvider>
	)
}

export default Compare

// Mount when served as a page (compare.html)
if (typeof document !== 'undefined') {
	const el = document.getElementById('compare-root')
	if (el) {
		createRoot(el).render(
			<StrictMode>
				<Compare />
			</StrictMode>,
		)
	}
}
