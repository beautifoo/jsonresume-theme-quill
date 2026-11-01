import type { FC } from 'react'
import type { ResumeSchema } from '../types/resumeSchema'
import { SectionCard } from './ui/SectionCard'
import { TimelineEntry } from './ui/TimelineEntry'
import { TimelineSection } from './ui/TimelineSection'

type Project = NonNullable<ResumeSchema['projects']>[number]

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
						subtitle={project.entity}
						url={project.url}
						summary={project.description}
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
