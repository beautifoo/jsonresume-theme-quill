import type { FC } from 'react'
import type { Resume as ResumeDocument } from '@jsonresume/types'
import { SidebarSection } from './ui/SidebarSection'

interface LanguagesProps {
	languages?: ResumeDocument['languages']
}

/**
 * Taxonomy rows: language with its fluency right-aligned.
 */
export const Languages: FC<LanguagesProps> = ({ languages }) => {
	if (!languages?.length) return null

	return (
		<SidebarSection title='sections.languages'>
			<div className='space-y-1.5 print:space-y-1'>
				{languages.map((language, i) => (
					<div key={i} className='flex items-baseline justify-between gap-3'>
						<span className='min-w-0 text-[0.9rem] text-ink'>
							{language.language}
						</span>
						{language.fluency && (
							<span className='folio-context shrink-0 font-normal'>
								{language.fluency}
							</span>
						)}
					</div>
				))}
			</div>
		</SidebarSection>
	)
}
