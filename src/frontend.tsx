/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import resume from '../resume.json'
import { App } from './app'

function start() {
	const rootEl = document.getElementById('root')
	if (!rootEl) return

	// A published resume page should announce itself properly.
	if (resume.basics?.name) {
		document.title =
			resume.basics.label != null
				? `${resume.basics.name} — ${resume.basics.label}`
				: resume.basics.name
	}
	if (resume.language) {
		document.documentElement.lang = resume.language
	}

	const root = createRoot(rootEl)
	root.render(
		<StrictMode>
			<App resume={resume} />
		</StrictMode>,
	)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', start)
} else {
	start()
}
