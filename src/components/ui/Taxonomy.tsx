import type { FC } from 'react'
import type { SectionTitleKey } from '../../i18n/config'
import { Section } from './Section'

export interface TaxonomyEntry {
	name: string
	/** Optional right-aligned rating (a skill level, a language fluency) */
	value?: string
	/** Quiet comma-separated keywords, the theme's taxonomy treatment */
	keywords?: string[]
}

interface TaxonomyProps {
	/** Translation key, e.g. `sections.skills` */
	title: SectionTitleKey
	entries: TaxonomyEntry[]
}

/**
 * A sidebar taxonomy list — the shared treatment for skills, languages,
 * and interests: name, optional right-aligned rating, then keywords as
 * quiet comma text (no tag cloud, borrowed from `pro`). One fact per
 * typographic role: the treatment is identical because the meaning is
 * identical, per the theme's own rule.
 */
export const Taxonomy: FC<TaxonomyProps> = ({ title, entries }) => {
	// An empty taxonomy renders nothing — the order does not shift (ADR 0001).
	if (entries.length === 0) return null

	return (
		<Section title={title} variant='list'>
			<div className='space-y-2.5 print:space-y-2'>
				{entries.map((entry, i) => (
					<div key={i}>
						<h3 className='flex items-baseline justify-between gap-2 text-[0.9rem] font-semibold text-ink'>
							<span className='min-w-0'>{entry.name}</span>
							{entry.value && (
								<span className='folio-meta shrink-0 font-normal'>
									{entry.value}
								</span>
							)}
						</h3>
						{entry.keywords && entry.keywords.length > 0 && (
							<p className='folio-context mt-0.5 leading-relaxed'>
								{entry.keywords.join(', ')}
							</p>
						)}
					</div>
				))}
			</div>
		</Section>
	)
}
