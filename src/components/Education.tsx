import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import type { Education as EducationItem } from '../types/resume'
import { AtLink } from './ui/AtLink'
import { Section } from './ui/Section'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'

interface EducationProps {
	education?: EducationItem[]
}

export const Education: FC<EducationProps> = ({ education }) => {
	const t = useTranslations()

	if (!education || education.length === 0) return null

	return (
		<Section title='sections.education' variant='timeline'>
			{education.map((item, index) => {
				// The 2.x schema separates the two: `area` is the field of
				// study (the title); `studyType` is the degree/school type
				// (context). The score stays free text: only prefix bare numbers.
				const gpa = item.score
					? /(GPA|Laude|Honor|Distinction)/i.test(item.score)
						? item.score
						: /^\d/.test(item.score)
							? t('common.gpa', { score: item.score })
							: item.score
					: undefined

				return (
					<TimelineEntry
						key={`${item.institution ?? 'education'}-${index}`}
						startDate={item.startDate}
						endDate={item.endDate}
					>
						<SectionCard
							title={item.area || item.studyType || ''}
							subtitle={
								item.institution ? (
									<AtLink label={item.institution} url={item.url} />
								) : undefined
							}
							location={item.location}
							context={item.area ? item.studyType : undefined}
							summary={item.summary || gpa}
							tags={
								item.courses && item.courses.length > 0
									? item.courses
									: undefined
							}
						/>
					</TimelineEntry>
				)
			})}
		</Section>
	)
}
