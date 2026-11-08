/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the Resume to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import resume from '../resume.json'
import { Resume } from './components/Resume'
import { applyDocumentMetadata } from './lib/document'

function start() {
	const rootEl = document.getElementById('root')
	if (!rootEl) return

	// A published resume page should announce itself properly.
	applyDocumentMetadata(resume)

	const root = createRoot(rootEl)
	root.render(
		<StrictMode>
			<Resume resume={resume} />
		</StrictMode>,
	)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', start)
} else {
	start()
}
