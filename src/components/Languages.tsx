import type { FC } from 'react'
import type { Language } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface LanguagesProps {
	languages?: Language[]
}

export const Languages: FC<LanguagesProps> = ({ languages }) => (
	<Taxonomy
		title='sections.languages'
		entries={(languages ?? []).map((language) => ({
			name: language.language ?? '',
			value: language.fluency,
		}))}
	/>
)
