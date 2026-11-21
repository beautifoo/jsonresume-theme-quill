// Registers the happy-dom DOM globals for the component tests.
//
// bun test in 1.4.x has no jsdom/happy-dom environment — a preload
// registering the globals is bun's documented Testing Library setup.
//
// This file must stay FIRST in bunfig's [test] preload list: the DOM
// must exist before @testing-library/dom is evaluated, because its
// `screen` object binds to `document.body` once, at module load.
// (test.preload.ts's jest-dom import pulls in @testing-library/dom —
// that would bind `screen` to an undefined document if it ran first.)
import { GlobalRegistrator } from '@happy-dom/global-registrator'
GlobalRegistrator.register()
