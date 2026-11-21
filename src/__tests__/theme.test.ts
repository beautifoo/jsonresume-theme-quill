import { expect, it } from 'bun:test'
import resume from '../../resume.json'
import { render } from '../theme'

// Pinned "now" — open-ended durations measure from it, never the wall
// clock (the vitest config pins the zone to UTC for the same reason),
// so the snapshot is a byte-stable record of the published document.
const NOW = new Date(2024, 0, 1)

it('renders the demo resume to a stable, self-contained document', () => {
	expect(render(resume, { now: NOW })).toMatchSnapshot()
})
