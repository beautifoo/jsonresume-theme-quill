import { describe, expect, it } from 'vitest'
import type { Work } from '../../types/resume'
import { groupWork } from '../workGrouping'

// Pinned "now" — group spans must be pin-able, never the wall clock.
// Local midnight, so the assertion is timezone-immune.
const NOW = new Date(2024, 0, 1)

const item = (name: string, startDate?: string, endDate?: string): Work =>
	({ name, startDate, endDate }) as Work

describe('groupWork — the Work group rule', () => {
	it('sorts groups reverse-chronologically, unsorted input included', () => {
		const groups = groupWork(
			[
				item('Old Co', '2019-01'),
				item('New Co', '2021-01', '2023-06'),
				item('Mid Co', '2020-01', '2021-01'),
			],
			NOW,
		)
		expect(groups.map((g) => g.company)).toEqual(['New Co', 'Mid Co', 'Old Co'])
	})

	it('merges a return to a former employer into one block, newest role first', () => {
		const groups = groupWork(
			[
				item('Acme', '2019-01', '2020-01'),
				item('Elsewhere', '2020-01', '2021-01'),
				item('Acme', '2021-01'), // the return, still open
			],
			NOW,
		)
		expect(groups).toHaveLength(2)
		const acme = groups.find((g) => g.company === 'Acme')
		expect(acme?.items).toHaveLength(2)
		expect(acme?.items.map((w) => w.startDate)).toEqual(['2021-01', '2019-01'])
		expect(acme?.grouped).toBe(true)
	})

	it('marks single-role groups as ungrouped', () => {
		const [group] = groupWork([item('Solo Co', '2020-01')], NOW)
		expect(group?.grouped).toBe(false)
	})

	it('spans the group from earliest start, open-ended end as the passed now', () => {
		const [group] = groupWork(
			[item('Acme', '2021-03'), item('Acme', '2019-01', '2020-06')],
			NOW,
		)
		expect(group?.start?.getTime()).toBe(new Date(2019, 0, 1).getTime())
		expect(group?.end?.getTime()).toBe(NOW.getTime())
	})

	it('yields empty dates when nothing parses', () => {
		const [group] = groupWork([item('Mystery Co', 'someday', 'someday')], NOW)
		// "someday" does not parse, and the set endDate is not open-ended,
		// so nothing feeds either end of the span.
		expect(group?.start).toBeUndefined()
		expect(group?.end).toBeUndefined()
	})

	it('buckets nameless items together', () => {
		const [group] = groupWork([item('', '2020-01'), item('', '2019-01')], NOW)
		expect(group?.company).toBe('')
		expect(group?.items).toHaveLength(2)
		expect(group?.grouped).toBe(true)
	})
})
