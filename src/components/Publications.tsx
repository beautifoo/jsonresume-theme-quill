import { type FC, memo } from 'react'
import { useTranslations } from 'use-intl'
import type { SectionTitleKey } from '../i18n/config'
import type { Publication } from '../types/resume'
import { Markdown } from './ui/Markdown'
import { DateStamp } from './ui/ResumeDate'
import { Section } from './ui/Section'
import { SidebarEntry } from './ui/SidebarEntry'

interface PublicationsProps {
	publications?: Publication[]
	/**
	 * Section heading — the **Conferences** section reuses this treatment
	 * for the talk-like publications (ADR 0005), so it is a prop.
	 */
	title?: SectionTitleKey
	/** Translation key for the entry link, e.g. `common.viewTalk` */
	urlLabelKey?: string
}

export const Publications: FC<PublicationsProps> = memo(
	({
		publications,
		title = 'sections.publications',
		urlLabelKey = 'common.viewPublication',
	}) => {
		const t = useTranslations()

		if (!publications?.length) return null

		return (
			<Section title={title} variant='list'>
				{publications.map((publication, index) => (
					<SidebarEntry
						key={index}
						title={publication.name}
						subtitle={publication.publisher}
						date={
							publication.releaseDate ? (
								<DateStamp precision='year' date={publication.releaseDate} />
							) : undefined
						}
						url={publication.url || undefined}
						urlLabel={t(urlLabelKey)}
						content={
							publication.summary ? (
								<Markdown content={publication.summary} />
							) : publication.authors?.length ? (
								<span className='text-ink-3'>
									{publication.authors.join(', ')}
								</span>
							) : undefined
						}
					/>
				))}
			</Section>
		)
	},
)
