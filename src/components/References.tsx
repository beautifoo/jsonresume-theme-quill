import type { FC } from 'react'
import type { Reference } from '../types/resume'
import { Markdown } from './ui/Markdown'
import { Section } from './ui/Section'
import { SidebarEntry } from './ui/SidebarEntry'

interface ReferencesProps {
	references?: Reference[]
}

export const References: FC<ReferencesProps> = ({ references }) => {
	if (!references?.length) return null

	return (
		<Section title='sections.references' variant='list'>
			{references.map((reference, index) => (
				<SidebarEntry
					key={index}
					title={reference.name}
					subtitle={
						reference.label ||
						reference.position ||
						reference.relationship ||
						reference.organization
					}
					content={
						reference.summary || reference.reference ? (
							<Markdown
								content={reference.summary || reference.reference || ''}
							/>
						) : undefined
					}
				/>
			))}
		</Section>
	)
}
