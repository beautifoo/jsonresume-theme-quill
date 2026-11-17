import type { FC } from 'react'
import type { Interest } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface InterestsProps {
	interests?: Interest[]
}

export const Interests: FC<InterestsProps> = ({ interests }) => (
	<Taxonomy
		title='sections.interests'
		entries={(interests ?? []).map((interest) => ({
			name: interest.name ?? '',
			keywords: interest.keywords,
		}))}
	/>
)
