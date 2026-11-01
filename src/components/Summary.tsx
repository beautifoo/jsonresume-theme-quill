import { type FC, memo } from 'react'
import { Markdown } from './ui/Markdown'
import { SectionTitle } from './ui/SectionTitle'

interface SummaryProps {
	summary: string
}

/**
 * The about block: a section title and the narrative, panel-less.
 */
export const Summary: FC<SummaryProps> = memo(({ summary }) => {
	if (!summary) return null

	return (
		<section
			className='mt-9 first:mt-0 print:mt-6 print:first:mt-0'
			aria-labelledby='section-title-about'
		>
			<SectionTitle title='sections.about' id='section-title-about' />
			<div className='folio-body mt-3 max-w-[62ch] print:mt-2'>
				<Markdown content={summary} metrics />
			</div>
		</section>
	)
})
