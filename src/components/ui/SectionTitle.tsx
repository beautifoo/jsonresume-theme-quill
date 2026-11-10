import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import type { SectionTitleKey } from '../../i18n/config'
import { cn } from '../../lib/utils'

interface SectionTitleProps {
	/** Translation key, e.g. `sections.work` */
	title: SectionTitleKey
	id?: string
	className?: string
}

/**
 * Section heading: the accent is allowed to appear here, followed by a
 * hairline rule that leads the eye into the section.
 */
export const SectionTitle: FC<SectionTitleProps> = ({
	title,
	id,
	className,
}) => {
	const t = useTranslations()

	return (
		<h2
			id={id}
			className={cn('quill-section-title flex items-center gap-3', className)}
		>
			<span>{t(title)}</span>
			<span aria-hidden='true' className='h-px min-w-4 flex-1 bg-line' />
		</h2>
	)
}
