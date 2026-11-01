import { type FC, memo } from 'react'
import { useFormatter, useTranslations } from 'use-intl'
import type { ResumeSchema } from '../types/resumeSchema'
import { Markdown } from './ui/Markdown'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

interface PublicationsProps {
	publications?: NonNullable<ResumeSchema['publications']>
}

export const Publications: FC<PublicationsProps> = memo(({ publications }) => {
	const f = useFormatter()
	const t = useTranslations()

	if (!publications?.length) return null

	return (
		<SidebarSection title='sections.publications'>
			<div className='space-y-3 print:space-y-2.5'>
				{publications.map((publication, index) => (
					<SidebarEntry
						key={index}
						title={publication.name}
						subtitle={publication.publisher}
						date={
							publication.releaseDate
								? f.dateTime(new Date(publication.releaseDate), {
										year: 'numeric',
									})
								: undefined
						}
						url={publication.url || undefined}
						urlLabel={t('common.viewPublication')}
						content={
							publication.summary ? (
								<Markdown content={publication.summary} />
							) : undefined
						}
					/>
				))}
			</div>
		</SidebarSection>
	)
})
