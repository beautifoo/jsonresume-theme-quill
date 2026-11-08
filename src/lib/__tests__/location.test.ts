import { describe, expect, it } from 'vitest'
import { formatLocation } from '../location'

describe('formatLocation — the compact location line', () => {
	it('passes a string location through unchanged', () => {
		expect(formatLocation('Copenhagen')).toBe('Copenhagen')
	})

	it('joins a location object in a fixed order: address, city, region, postal code', () => {
		expect(
			formatLocation({
				address: 'Stadsporten 10',
				city: 'Oslo',
				region: 'Norway',
				postalCode: '0150',
			}),
		).toBe('Stadsporten 10, Oslo, Norway, 0150')
	})

	it('omits missing parts, without leaving stray separators', () => {
		expect(formatLocation({ city: 'Oslo', postalCode: '0150' })).toBe(
			'Oslo, 0150',
		)
	})

	it('returns undefined for an empty object or an empty string', () => {
		expect(formatLocation({})).toBeUndefined()
		expect(formatLocation('')).toBeUndefined()
		expect(formatLocation(undefined)).toBeUndefined()
	})
})
