import { ArrowSquareOutIcon, MapPinIcon } from '@phosphor-icons/react'
import { type FC, memo, type ReactNode } from 'react'
import { useTranslations } from 'use-intl'
import { cn } from '../../lib/utils'
import { Markdown } from './Markdown'
import { TagList } from './TagList'

interface SectionCardProps {
	title?: string
	subtitle?: string | ReactNode
	url?: string
	location?: string
	tags?: string[]
	highlights?: string[]
	summary?: string
	actionUrl?: string
	actionLabelKey?: string
	/** Screen-only garnish rendered beside the title (e.g. growth pill) */
	addonAfterTitle?: ReactNode
	className?: string
}

/**
 * A main-column entry: title + linked context, metadata row, then
 * narrative and highlights. Deliberately panel-less — the typographic
 * roles carry the structure (see `pro`'s rule: a treatment changes only
 * when the meaning changes).
 */
export const SectionCard: FC<SectionCardProps> = memo(
	({
		title,
		subtitle,
		url,
		location,
		tags,
		highlights,
		summary,
		actionUrl,
		actionLabelKey,
		addonAfterTitle,
		className,
	}) => {
		const t = useTranslations()

		return (
			<article className={cn('break-inside-avoid', className)}>
				<div className='flex flex-col gap-1 print:gap-0.5'>
					{title && (
						<div className='flex items-start justify-between gap-3'>
							<h3 className='folio-entry-title min-w-0 flex-1'>
								{title}
								{subtitle && (
									<span className='font-normal text-ink-3'>
										{` ${t('common.at')} `}
										{url ? (
											<a href={url} target='_blank' rel='noopener noreferrer'>
												{subtitle}
											</a>
										) : (
											subtitle
										)}
									</span>
								)}
							</h3>
							{addonAfterTitle && (
								<div className='shrink-0 print:hidden'>{addonAfterTitle}</div>
							)}
						</div>
					)}

					{location && (
						<div className='folio-context flex items-center gap-1.5'>
							<MapPinIcon
								className='h-3.5 w-3.5 shrink-0 text-ink-4'
								aria-hidden='true'
							/>
							{location}
						</div>
					)}

					{tags && tags.length > 0 && (
						<TagList className='mt-1.5 print:mt-1'>{tags}</TagList>
					)}

					{summary && (
						<div className='folio-body mt-2 print:mt-1.5'>
							<Markdown content={summary} metrics />
						</div>
					)}

					{highlights && highlights.length > 0 && (
						<ul className='mt-2 space-y-1.5 pl-4 print:mt-1.5 print:space-y-1 print:pl-3'>
							{highlights.map((highlight, i) => (
								<li
									key={i}
									className='folio-body list-disc marker:text-accent/70'
								>
									<Markdown content={highlight} metrics />
								</li>
							))}
						</ul>
					)}

					{actionUrl && actionLabelKey && (
						<a
							href={actionUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-2 inline-flex items-center gap-1 text-[0.85rem] no-underline print:hidden'
						>
							{t(actionLabelKey)}
							<ArrowSquareOutIcon className='h-3 w-3' aria-hidden='true' />
						</a>
					)}
				</div>
			</article>
		)
	},
)
