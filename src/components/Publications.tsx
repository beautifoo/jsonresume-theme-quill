import { type FC, memo } from 'react'
import { useTranslations } from 'use-intl'
import type { Publication } from '../types/resume'
import { Markdown } from './ui/Markdown'
import { DateStamp } from './ui/ResumeDate'
import { Section } from './ui/Section'
import { SidebarEntry } from './ui/SidebarEntry'

interface PublicationsProps {
	publications?: Publication[]
}

export const Publications: FC<PublicationsProps> = memo(({ publications }) => {
	const t = useTranslations()

	if (!publications?.length) return null

	return (
		<Section title='sections.publications' variant='list'>
			<div className='space-y-3 print:space-y-2.5'>
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
						urlLabel={t('common.viewPublication')}
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
			</div>
		</Section>
	)
})
