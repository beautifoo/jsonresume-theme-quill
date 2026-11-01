import type { Root } from 'mdast'
import type React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { cn } from '../../lib/utils'

interface MarkdownProps {
	content?: string
	className?: string
	/**
	 * Bold numbers in narrative text (metrics: "3 promotions", "20%",
	 * "$1.2M") so quantified results stand out. Inspired by
	 * jsonresume-theme-data-driven.
	 */
	metrics?: boolean
}

const METRIC_RE = /\d[\d,.]*(?:%|\s?×)?/

const remarkMetrics = () => (tree: Root) => {
	visit(tree, 'text', (node, index, parent) => {
		// Skip text we produced ourselves — visit descends into the
		// spliced nodes and would double-wrap.
		if (!parent || parent.type === 'strong' || !METRIC_RE.test(node.value)) {
			return
		}

		const value = node.value
		const parts: Node[] = []
		const re = /\d[\d,.]*(?:%|\s?×)?/g
		let last = 0
		let match: RegExpExecArray | null = re.exec(value)
		while (match) {
			if (match.index > last) {
				parts.push({ type: 'text', value: value.slice(last, match.index) })
			}
			parts.push({
				type: 'strong',
				children: [{ type: 'text', value: match[0] }],
			})
			last = match.index + match[0].length
			if (match[0].length === 1) re.lastIndex++ // avoid zero-length loops
			match = re.exec(value)
		}
		if (last < value.length) {
			parts.push({ type: 'text', value: value.slice(last) })
		}

		parent.children.splice(index, 1, ...(parts as Parent[]))
	})
}

export const Markdown: React.FC<MarkdownProps> = ({
	content,
	className,
	metrics,
}) => {
	if (!content) return null

	return (
		<div className={cn('markdown', className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, ...(metrics ? [remarkMetrics] : [])]}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
