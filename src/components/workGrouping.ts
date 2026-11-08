import { dateSpan, parseResumeDate } from '../lib/dates'
import type { Work } from '../types/resume'

/**
 * A **Work group**: the roles a candidate held at one employer,
 * rendered as a single timeline block.
 */
export interface WorkGroup {
	/** The employer `name`; '' buckets nameless items together */
	company: string
	/** The group's items, reverse-chronological */
	items: Work[]
	/** More than one role — the block gets a company header */
	grouped: boolean
	/** The group span: earliest start */
	start?: Date
	/** The group span: latest end, where an open-ended role counts as `now` */
	end?: Date
}

/**
 * The work-grouping rule: entries are sorted reverse-chronologically
 * and grouped **by company, regardless of contiguity** — a return to
 * a former employer merges into one block, and unsorted input renders
 * correctly either way. Pure: "now" is passed in, never read.
 */
export function groupWork(items: Work[], now: Date): WorkGroup[] {
	const sorted = [...items].sort((a, b) => {
		const as = a.startDate ? parseResumeDate(a.startDate) : undefined
		const bs = b.startDate ? parseResumeDate(b.startDate) : undefined
		if (!as && !bs) return 0
		if (!as) return 1
		if (!bs) return -1
		return bs.getTime() - as.getTime()
	})

	const groups = new Map<string, Work[]>()
	for (const item of sorted) {
		const company = item.name || ''
		const group = groups.get(company)
		if (group) group.push(item)
		else groups.set(company, [item])
	}

	return [...groups.entries()].map(([company, items]) => {
		const span = dateSpan(items, now)
		return {
			company,
			items,
			grouped: items.length > 1,
			start: span.start,
			end: span.end,
		}
	})
}
