import * as jestDom from '@testing-library/jest-dom/matchers'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'bun:test'

// The DOM globals are registered in test.dom.ts, listed first in
// bunfig: the DOM must exist before any @testing-library module loads
// (its screen object binds to document.body at module load).

// The date seam serializes local-midnight dates as UTC
// (`dateTime={start.toISOString()}`) - the snapshot test pins the
// zone so the document's bytes are machine-independent.
// (Carried over from the old vitest.config.ts `env` section.)
process.env.TZ = 'UTC'

// Register the jest-dom assertions the component tests use
// (replaces the old `import '@testing-library/jest-dom/vitest'` setup).
// The cast only silences bun's generic `extend` signature - the runtime
// matcher shapes predate it and are compatible.
// SAFETY: jest-dom's matcher signatures are runtime-compatible with bun's
// ExpectExtendMatchers; only its generic signature is stricter.
expect.extend(jestDom as unknown as Parameters<typeof expect.extend>[0])

// Unmount the tree after every test, like the framework's auto-cleanup
// does under vitest/jest (bun's auto-detection of the test framework is
// not reliable).
afterEach(() => cleanup())

// Type support for the registered matchers. jest-dom ships a
// `types/bun.d.ts` for exactly this, but it is not reachable through
// the package's exports map, so we merge the same shape here.
declare module 'bun:test' {
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<ReturnType<typeof expect.stringContaining>, T> {}
}
