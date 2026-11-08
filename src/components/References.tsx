import type { FC } from 'react'
import type { Reference } from '../types/resume'
import { Markdown } from './ui/Markdown'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

interface ReferencesProps {
	references?: Reference[]
}

export const References: FC<ReferencesProps> = ({ references }) => {
	if (!references?.length) return null

	return (
		<SidebarSection title='sections.references'>
			<div className='space-y-3 print:space-y-2.5'>
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
			</div>
		</SidebarSection>
	)
}
