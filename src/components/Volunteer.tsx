import type { FC } from 'react'
import type { Volunteer as VolunteerItem } from '../types/resume'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

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
						location={item.location}
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
