import { TrophyIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import type { Award } from '../types/resume'
import { DateStamp } from './ui/ResumeDate'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

interface AwardsProps {
	awards?: Award[]
}

export const Awards: FC<AwardsProps> = ({ awards }) => {
	const t = useTranslations()

	if (!awards?.length) return null

	return (
		<SidebarSection title='sections.awards'>
			<div className='space-y-3 print:space-y-2.5'>
				{awards.map((award, index) => (
					<SidebarEntry
						key={index}
						icon={<TrophyIcon className='h-3.5 w-3.5' />}
						title={award.title || award.name}
						subtitle={
							award.awarder || award.issuer
								? `${t('common.awardedBy')} ${award.awarder || award.issuer}`
								: undefined
						}
						date={
							award.date || award.awardDate || award.startDate ? (
								<DateStamp
									date={award.date || award.awardDate || award.startDate}
								/>
							) : undefined
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
