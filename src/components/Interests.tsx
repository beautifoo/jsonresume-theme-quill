import type { FC } from 'react'
import type { ResumeSchema } from '../types/resumeSchema'
import { SidebarSection } from './ui/SidebarSection'

interface InterestsProps {
	interests?: ResumeSchema['interests']
}

/**
 * Taxonomy rows, like Skills: name, then keywords as quiet comma text.
 */
export const Interests: FC<InterestsProps> = ({ interests }) => {
	if (!interests?.length) return null

	return (
		<SidebarSection title='sections.interests'>
			<div className='space-y-2.5 print:space-y-2'>
				{interests.map((interest, i) => (
					<div key={i}>
						<h3 className='text-[0.9rem] font-semibold text-ink'>
							{interest.name}
						</h3>
						{interest.keywords && interest.keywords.length > 0 && (
							<p className='folio-context mt-0.5 leading-relaxed'>
								{interest.keywords.join(', ')}
							</p>
						)}
					</div>
				))}
			</div>
		</SidebarSection>
	)
}
