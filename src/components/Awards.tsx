import { TrophyIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useFormatter, useTranslations } from 'use-intl'
import type { ResumeSchema } from '../types/resumeSchema'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

type Award = NonNullable<ResumeSchema['awards']>[number]

interface AwardsProps {
	awards?: Award[]
}

export const Awards: FC<AwardsProps> = ({ awards }) => {
	const f = useFormatter()
	const t = useTranslations()

	if (!awards?.length) return null

	return (
		<SidebarSection title='sections.awards'>
			<div className='space-y-3 print:space-y-2.5'>
				{awards.map((award, index) => (
					<SidebarEntry
						key={index}
						icon={<TrophyIcon className='h-3.5 w-3.5' />}
						title={award.title}
						subtitle={
							award.awarder
								? `${t('common.awardedBy')} ${award.awarder}`
								: undefined
						}
						date={
							award.date
								? f.dateTime(new Date(award.date), {
										month: 'short',
										year: 'numeric',
									})
								: undefined
						}
						url={award.url}
						urlLabel={t('common.viewAward')}
						content={award.summary}
					/>
				))}
			</div>
		</SidebarSection>
	)
}
