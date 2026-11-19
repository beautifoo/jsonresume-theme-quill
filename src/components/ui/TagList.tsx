import type { FC } from 'react'
import { cn } from '../../lib/utils'
import { Tag } from './Tag'

interface TagListProps {
	children: string[]
	className?: string
}

export const TagList: FC<TagListProps> = ({ children, className }) => {
	return (
		<div className={cn('flex flex-wrap gap-1.5 print:gap-1', className)}>
			{children.map((tag, i) => (
				<Tag key={i}>{tag}</Tag>
			))}
		</div>
	)
}
