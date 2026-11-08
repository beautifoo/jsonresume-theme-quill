import type { FC } from 'react'
import type { ResumeDocument } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface InterestsProps {
	interests?: ResumeDocument['interests']
}

/** Taxonomy rows, like Skills: name, then keywords as quiet comma text. */
export const Interests: FC<InterestsProps> = ({ interests }) => {
	if (!interests?.length) return null

	return (
		<Taxonomy
			title='sections.interests'
			entries={interests.map((interest) => ({
				name: interest.name ?? '',
				keywords: interest.keywords,
			}))}
		/>
	)
}
