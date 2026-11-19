/**
 * The screen color-scheme bootstrap, inlined into the published document
 * before first paint so a page in a dark-system session does not flash
 * light. A forced scheme (localStorage "quill-scheme": "light" | "dark")
 * wins over the system preference; the listener only tracks the system
 * while none is forced. The print palette is always light regardless of
 * this class.
 *
 * Defined once so a rename cannot drift between the two places it is
 * written out: `theme.tsx` inlines it into the published document and
 * `index.html` inlines it into the dev/preview page (a raw string — it
 * cannot import this module). `indexHtml.test.ts` keeps the dev copy
 * byte-equivalent to this one. Edit here, not the copy in `index.html`.
 */
export const schemeBootstrap = `(function () {
	var root = document.documentElement
	var forced = null
	try {
		forced = localStorage.getItem('quill-scheme')
	} catch (e) {
		/* private mode */
	}
	var dark = forced
		? forced === 'dark'
		: window.matchMedia('(prefers-color-scheme: dark)').matches
	if (dark) root.classList.add('dark')
	if (!forced) {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', function (e) {
				root.classList.toggle('dark', e.matches)
			})
	}
})()`
