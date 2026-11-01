import type { FC } from 'react'
import type { Project } from '../types/resume'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

interface ProjectsProps {
	projects?: Project[]
}

export const Projects: FC<ProjectsProps> = ({ projects }) => {
	if (!projects?.length) return null

	return (
		<TimelineSection title='sections.projects'>
			{projects.map((project, index) => (
				<TimelineEntry
					key={`${project.name ?? 'project'}-${index}`}
					startDate={project.startDate}
					endDate={project.endDate}
				>
					<SectionCard
						title={project.name}
						subtitle={project.position || project.entity}
						url={project.url}
						// Both names are common: summary (2.1) / description (1.x samples)
						summary={project.description || project.summary}
						highlights={project.highlights}
						tags={project.keywords}
						actionUrl={project.url}
						actionLabelKey='common.viewProject'
					/>
				</TimelineEntry>
			))}
		</TimelineSection>
	)
}
