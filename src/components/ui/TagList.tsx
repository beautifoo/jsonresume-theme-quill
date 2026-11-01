import type { FC, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Tag } from './Tag'

interface TagListProps {
	/** Either `string[]` (rendered as tags) or pre-built elements */
	children: string[] | ReactNode
	className?: string
}

export const TagList: FC<TagListProps> = ({ children, className }) => {
	return (
		<div
			className={cn(
				'flex flex-wrap gap-1.5 print:gap-1',
				className,
			)}
		>
			{Array.isArray(children)
				? children.map((tag, i) => <Tag key={i}>{tag}</Tag>)
				: children}
		</div>
	)
}
