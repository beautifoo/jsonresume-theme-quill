import type { FC } from 'react'
import type { ResumeSchema } from '../types/resumeSchema'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

type VolunteerItem = NonNullable<ResumeSchema['volunteer']>[number]

interface VolunteerProps {
	volunteer?: VolunteerItem[]
}

export const Volunteer: FC<VolunteerProps> = ({ volunteer }) => {
	if (!volunteer?.length) return null

	return (
		<TimelineSection title='sections.volunteer'>
			{volunteer.map((item, index) => (
				<TimelineEntry
					key={`${item.organization ?? 'volunteer'}-${index}`}
					startDate={item.startDate}
					endDate={item.endDate}
				>
					<SectionCard
						title={item.position}
						subtitle={item.organization}
						url={item.url}
						location={item.location as string | undefined}
						summary={item.summary}
						highlights={item.highlights}
						actionUrl={item.url}
						actionLabelKey='common.visitWebsite'
					/>
				</TimelineEntry>
			))}
		</TimelineSection>
	)
}
