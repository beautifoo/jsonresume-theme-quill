import type { Publication } from '../types/resume'

/**
 * The talk-like `type` values (#295) that route a publication to the
 * **Conferences** section instead of Publications (ADR 0005).
 * Case-insensitive exact match; a novel or misspelled `type`
 * (`keynote`, `lecture`, …) deliberately stays in Publications.
 */
const TALK_TYPES = new Set(['talk', 'presentation', 'speech'])

export function isConferenceTalk(publication: Publication): boolean {
	return TALK_TYPES.has((publication.type ?? '').toLowerCase())
}
