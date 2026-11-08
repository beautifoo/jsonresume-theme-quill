import type { FC } from 'react'
import type { ResumeDocument } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface SkillsProps {
	skills?: ResumeDocument['skills']
}

/**
 * Taxonomy rows: label, optional level, then keywords as quiet comma
 * text — no tag cloud. (Borrowed from `pro`'s taxonomy treatment,
 * shared with Languages and Interests in the Taxonomy module.)
 */
export const Skills: FC<SkillsProps> = ({ skills }) => {
	if (!skills?.length) return null

	return (
		<Taxonomy
			title='sections.skills'
			entries={skills.map((skill) => ({
				name: skill.name ?? '',
				value: skill.level,
				keywords: skill.keywords,
			}))}
		/>
	)
}
