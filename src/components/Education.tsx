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
				// The 2.x schema separates the two: `area` is the field of
				// study (the title); `studyType` is the degree/school type
				// (context). The score stays free text: only prefix bare numbers.
				const gpa = item.score
					? /(GPA|Laude|Honor|Distinction)/i.test(item.score)
						? item.score
						: /^\d/.test(item.score)
							? `GPA: ${item.score}`
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
							subtitle={item.institution}
							url={item.url}
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
		</TimelineSection>
	)
}
