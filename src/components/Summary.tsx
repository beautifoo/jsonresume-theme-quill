import { type FC, memo } from 'react'
import { Markdown } from './ui/Markdown'
import { Section } from './ui/Section'

interface SummaryProps {
	summary: string
}

/**
 * The about block: a section title and the narrative, panel-less.
 */
export const Summary: FC<SummaryProps> = memo(({ summary }) => {
	if (!summary) return null

	return (
		<Section
			title='sections.about'
			variant='list'
			contentClassName='max-w-[62ch]'
		>
			<div className='folio-body'>
				<Markdown content={summary} metrics />
			</div>
		</Section>
	)
})
