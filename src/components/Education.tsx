import type { FC } from 'react'
import type { Education as EducationItem } from '../types/resume'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

interface EducationProps {
	education?: EducationItem[]
}

export const Education: FC<EducationProps> = ({ education }) => {
	if (!education || education.length === 0) return null

	return (
		<TimelineSection title='sections.education'>
			{education.map((item, index) => {
				const title = item.studyType || item.area || ''
				return (
					<TimelineEntry
						key={`${item.institution ?? 'education'}-${index}`}
						startDate={item.startDate}
						endDate={item.endDate}
					>
						<SectionCard
							title={title}
							subtitle={item.institution}
							url={item.url}
							location={item.location}
							summary={
								// The score field is free text: only prefix bare numbers.
								item.score
									? /(GPA|Laude|Honor|Distinction)/i.test(item.score)
										? item.score
										: /^\d/.test(item.score)
											? `GPA: ${item.score}`
											: item.score
									: undefined
							}
							tags={
								item.courses && item.courses.length > 0
									? item.courses
									: undefined
							}
						/>
					</TimelineEntry>
				)
			})}
		</TimelineSection>
	)
}
