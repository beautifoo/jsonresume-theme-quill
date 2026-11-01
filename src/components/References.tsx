import type { FC } from 'react'
import type { ResumeSchema } from '../types/resumeSchema'
import { Markdown } from './ui/Markdown'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

type Reference = NonNullable<ResumeSchema['references']>[number]

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
						subtitle={reference.organization}
						content={
							reference.reference ? (
								<Markdown content={reference.reference} />
							) : undefined
						}
					/>
				))}
			</div>
		</SidebarSection>
	)
}
