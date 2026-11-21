/**
 * The screen color-scheme bootstrap, inlined into a document before first
 * paint so a page in a dark-system session does not flash light. The
 * effective scheme is the forced argument, else the stored scheme
 * (localStorage "quill-scheme": "light" | "dark"), else the system
 * preference — and the listener only tracks the system while no scheme is
 * forced or stored. The print palette is always light regardless of this
 * class.
 *
 * Defined once so a rename cannot drift between the three places it is
 * written out: `theme.tsx` inlines it into the published document,
 * `index.html` into the dev/preview page, and `compare.html` as the
 * forced-light variant (the page is judged by hand, so it never follows
 * the system or a stored preference). Both HTML copies are raw strings —
 * they cannot import this module — so `indexHtml.test.ts` and
 * `compareHtml.test.ts` keep them byte-equivalent. Edit here, not the
 * copies in the HTML files.
 */
export const schemeBootstrap = (forced: 'light' | 'dark' | null = null) => `(function () {
	var root = document.documentElement
	var scheme = ${forced ? `'${forced}'` : 'null'}
	try {
		scheme = scheme || localStorage.getItem('quill-scheme')
	} catch (e) {
		/* private mode */
	}
	var dark = scheme
		? scheme === 'dark'
		: window.matchMedia('(prefers-color-scheme: dark)').matches
	if (dark) root.classList.add('dark')
	if (!scheme) {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', function (e) {
				root.classList.toggle('dark', e.matches)
			})
	}
})()`
