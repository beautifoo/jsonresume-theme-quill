import { TrophyIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import type { Award } from '../types/resume'
import { DateStamp } from './ui/ResumeDate'
import { Section } from './ui/Section'
import { SidebarEntry } from './ui/SidebarEntry'

interface AwardsProps {
	awards?: Award[]
}

export const Awards: FC<AwardsProps> = ({ awards }) => {
	const t = useTranslations()

	if (!awards?.length) return null

	return (
		<Section title='sections.awards' variant='list'>
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
						date={award.date ? <DateStamp date={award.date} /> : undefined}
						url={award.url}
						urlLabel={t('common.viewAward')}
						content={award.summary}
					/>
				))}
			</div>
		</Section>
	)
}
