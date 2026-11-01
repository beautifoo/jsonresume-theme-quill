import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { SectionTitle } from './SectionTitle'

interface SidebarSectionProps {
	/** Translation key, e.g. `sections.skills` */
	title: string
	children: ReactNode
	className?: string
	contentClassName?: string
	id?: string
}

/**
 * A sidebar section: title, then free-form content. In the `single`
 * layout mode these follow the main column at full width.
 */
export const SidebarSection: FC<SidebarSectionProps> = ({
	title,
	children,
	className,
	contentClassName,
	id,
}) => {
	const sectionId = id || `section-${title.replace(/\s+/g, '-').toLowerCase()}`
	const titleId = `${sectionId}-title`

	return (
		<section
			className={cn('mt-9 first:mt-0 print:mt-6 print:first:mt-0', className)}
			id={sectionId}
			aria-labelledby={titleId}
		>
			<SectionTitle title={title} id={titleId} />
			<div className={cn('mt-3 print:mt-2', contentClassName)}>{children}</div>
		</section>
	)
}
