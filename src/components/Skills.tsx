import type { FC } from 'react'
import type { Skill } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface SkillsProps {
	skills?: Skill[]
}

export const Skills: FC<SkillsProps> = ({ skills }) => (
	<Taxonomy
		title='sections.skills'
		entries={(skills ?? []).map((skill) => ({
			name: skill.name ?? '',
			value: skill.level,
			keywords: skill.keywords,
		}))}
	/>
)
