/**
 * A 2.x location as a compact line — the one rule for the whole theme.
 * A string location passes through; a location object joins its parts in
 * a fixed order (address, city, region, postal code), missing parts
 * omitted. The masthead and the main-column entries render locations
 * this way, so they can never drift apart.
 */
import type { Location } from '@jsonresume/types'

export function formatLocation(location?: string | Location): string | undefined {
	if (!location) return undefined
	if (typeof location === 'string') return location || undefined

	const line = [location.address, location.city, location.region, location.postalCode]
		.filter(Boolean)
		.join(', ')
	return line || undefined
}
