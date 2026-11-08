import type { FC } from 'react'
import type { ResumeDocument } from '../types/resume'
import { Taxonomy } from './ui/Taxonomy'

interface LanguagesProps {
	languages?: ResumeDocument['languages']
}

/** Taxonomy rows: language with its fluency right-aligned. */
export const Languages: FC<LanguagesProps> = ({ languages }) => {
	if (!languages?.length) return null

	return (
		<Taxonomy
			title='sections.languages'
			entries={languages.map((language) => ({
				name: language.language ?? '',
				value: language.fluency,
			}))}
		/>
	)
}
