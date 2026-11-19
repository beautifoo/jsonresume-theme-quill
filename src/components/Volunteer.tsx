import type { FC } from 'react'
import type { Volunteer as VolunteerItem } from '../types/resume'
import { AtLink } from './ui/AtLink'
import { Section } from './ui/Section'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'

interface VolunteerProps {
	volunteer?: VolunteerItem[]
}

export const Volunteer: FC<VolunteerProps> = ({ volunteer }) => {
	if (!volunteer?.length) return null

	return (
		<Section title='sections.volunteer' variant='timeline'>
			{volunteer.map((item, index) => (
				<TimelineEntry
					key={`${item.organization ?? 'volunteer'}-${index}`}
					startDate={item.startDate}
					endDate={item.endDate}
				>
					<SectionCard
						title={item.position}
						subtitle={
							item.organization ? (
								<AtLink label={item.organization} url={item.url} />
							) : undefined
						}
						location={item.location}
						summary={item.summary}
						highlights={item.highlights}
					/>
				</TimelineEntry>
			))}
		</Section>
	)
}
