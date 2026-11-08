import type { FC } from 'react'
import type { Project } from '../types/resume'
import { Section } from './ui/Section'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'

interface ProjectsProps {
	projects?: Project[]
}

export const Projects: FC<ProjectsProps> = ({ projects }) => {
	if (!projects?.length) return null

	return (
		<Section title='sections.projects' variant='timeline'>
			{projects.map((project, index) => (
				<TimelineEntry
					key={`${project.name ?? 'project'}-${index}`}
					startDate={project.startDate}
					endDate={project.endDate}
				>
					<SectionCard
						title={project.name}
						subtitle={project.roles?.[0] || project.entity}
						url={project.url}
						// The 2.x schema mandates the order: summary wins when both are set (#296)
						summary={project.summary || project.description}
						highlights={project.highlights}
						tags={project.keywords}
						actionUrl={project.url}
						actionLabelKey='common.viewProject'
					/>
				</TimelineEntry>
			))}
		</Section>
	)
}
