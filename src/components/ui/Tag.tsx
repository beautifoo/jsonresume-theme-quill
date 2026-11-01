import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface TagProps {
	children: ReactNode
	className?: string
}

/**
 * A quiet chip: one step off the page, hairline border.
 */
export const Tag: FC<TagProps> = ({ children, className }) => {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full border border-line bg-surface px-2 py-0.5 text-[0.78rem] leading-tight text-ink-3 print:px-1.5 print:py-0 print:text-[0.68rem]',
				className,
			)}
		>
			{children}
		</span>
	)
}
