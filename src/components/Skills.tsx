import type { FC } from 'react'
import type { Resume as ResumeDocument } from '@jsonresume/types'
import { SidebarSection } from './ui/SidebarSection'

interface SkillsProps {
	skills?: ResumeDocument['skills']
}

/**
 * Taxonomy rows: label, optional level, then keywords as quiet comma
 * text — no tag cloud. (Borrowed from `pro`'s taxonomy treatment.)
 */
export const Skills: FC<SkillsProps> = ({ skills }) => {
	if (!skills?.length) return null

	return (
		<SidebarSection title='sections.skills'>
			<div className='space-y-2.5 print:space-y-2'>
				{skills.map((skill, i) => (
					<div key={i}>
						<h3 className='flex items-baseline justify-between gap-2 text-[0.9rem] font-semibold text-ink'>
							<span className='min-w-0'>{skill.name}</span>
							{skill.level && (
								<span className='folio-meta shrink-0 font-normal'>
									{skill.level}
								</span>
							)}
						</h3>
						{skill.keywords && skill.keywords.length > 0 && (
							<p className='folio-context mt-0.5 leading-relaxed'>
								{skill.keywords.join(', ')}
							</p>
						)}
					</div>
				))}
			</div>
		</SidebarSection>
	)
}
