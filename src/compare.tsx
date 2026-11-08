/**
 * Theme comparison page — a development tool, excluded from dist.
 *
 * Renders the theme's variants side by side for the repo's sample
 * resume, with layout/scheme/variant/language controls, at full
 * resolution for a human eye. Each panel is a self-contained `Resume`
 * (its own Folio provider), so the matrix previews exactly what the
 * published page renders — same icon weight, same date semantics.
 */

import { type FC, StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import resume from '../resume.json'
import { type LayoutMode, Resume, type ThemeVariant } from './components/Resume'
import { type Locale, locales } from './i18n/config'
import { resolveLocale } from './i18n/resolveLocale'
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

const FOIL_VARIANTS: ThemeVariant[] = ['folio', 'folio-monochrome']

const Compare: FC = () => {
	const [layout, setLayout] = useState<LayoutMode>('double')
	const [scheme, setScheme] = useState<'light' | 'dark'>('light')
	const [variant, setVariant] = useState<ThemeVariant | 'all'>('all')
	const [locale, setLocale] = useState<Locale>(
		resolveLocale(resume as ResumeDocument),
	)

	const resumeData = resume as ResumeDocument
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
						<Resume
							resume={resumeData}
							variant={v}
							layout={layout}
							locale={locale}
						/>
					</div>
				</figure>
			)),
		[resumeData, layout, scheme, locale, folioVariants],
	)

	return (
		<div className='min-h-dvh bg-[oklch(0.96_0_0)] font-sans text-ink-2'>
			<header className='sticky top-0 z-10 border-b border-line bg-[oklch(0.985_0_0)] px-6 py-3'>
				<div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem]'>
					<span className='text-[1.05rem] font-semibold text-ink'>
						Folio — theme comparison
					</span>
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

			<main className='grid gap-6 p-6 [grid-template-columns:repeat(auto-fill,minmax(560px,1fr))]'>
				{folioPanels}
			</main>

			<footer className='px-6 pb-8 text-[0.8rem] text-ink-3'>
				Print target: open the standalone resume page and print — the PDF
				renders the light palette at a denser scale, always.
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
				<Compare />
			</StrictMode>,
		)
	}
}
