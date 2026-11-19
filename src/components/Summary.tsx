import { type FC, memo } from 'react'
import { Markdown } from './ui/Markdown'
import { Section } from './ui/Section'

interface SummaryProps {
	summary?: string
}

/**
 * The about block: a section title and the narrative, panel-less.
 */
export const Summary: FC<SummaryProps> = memo(({ summary }) => {
	if (!summary) return null

	return (
		<Section title='sections.about' variant='list'>
			<div className='quill-body max-w-[62ch]'>
				<Markdown content={summary} metrics />
			</div>
		</Section>
	)
})
