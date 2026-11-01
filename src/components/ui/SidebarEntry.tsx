import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface SidebarEntryProps {
	title: ReactNode
	/** e.g. "Awarded by Acme" / "Issued by …" / publisher */
	subtitle?: ReactNode
	/** Formatted date, rendered as metadata */
	date?: ReactNode
	url?: string
	urlLabel?: string
	/** Optional icon (e.g. trophy) — decorative, accent-tinted */
	icon?: ReactNode
	/** e.g. a reference quotation */
	content?: ReactNode
	className?: string
}

/**
 * One quiet entry in a sidebar list (awards, certificates, publications,
 * references): icon + title, context, metadata, optional note.
 */
export const SidebarEntry: FC<SidebarEntryProps> = ({
	title,
	subtitle,
	date,
	url,
	urlLabel,
	icon,
	content,
	className,
}) => {
	return (
		<article className={cn('break-inside-avoid', className)}>
			<div className='flex items-start gap-2.5'>
				{icon && (
					<div className='mt-0.5 shrink-0 text-accent' aria-hidden='true'>
						{icon}
					</div>
				)}
				<div className='min-w-0 flex-1'>
					<h3 className='text-[0.9rem] font-semibold leading-snug text-ink'>
						{title}
					</h3>
					{subtitle && (
						<div className='folio-context mt-0.5'>{subtitle}</div>
					)}
					{(date || url) && (
						<div className='folio-meta mt-1 flex flex-wrap gap-x-2.5 gap-y-0.5'>
							{date}
							{url && (
								<a href={url} target='_blank' rel='noopener noreferrer'>
									{urlLabel || url}
								</a>
							)}
						</div>
					)}
					{content && (
						<div className='folio-body mt-1.5 text-[0.9rem]'>{content}</div>
					)}
				</div>
			</div>
		</article>
	)
}
