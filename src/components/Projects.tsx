import type { FC } from 'react'
import type { Project } from '../types/resume'
import { AtLink } from './ui/AtLink'
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
						// The "at" connector means "at an organization": a bare
						// role rides beside the title without it, an entity with.
						// The project URL gets its one link in the action row.
						subtitle={
							project.roles?.[0] ||
							(project.entity ? <AtLink label={project.entity} /> : undefined)
						}
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
