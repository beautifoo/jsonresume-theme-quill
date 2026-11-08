import type { FC, ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { type Locale, locales } from '../i18n/config'

interface IntlTestProviderProps {
	children: ReactNode
	/** Defaults to English, the theme's fallback */
	locale?: Locale
	/**
	 * Defaults to a pinned local midnight — open-ended durations must be
	 * pin-able in tests. `new Date('2024-01-01')` would be UTC midnight,
	 * shifting a month on west-of-UTC machines.
	 */
	now?: Date
}

/**
 * The i18n provider for tests, mirroring the app's own configuration:
 * the viewer's *own* timezone, explicitly (the app does the same —
 * same behavior as the library fallback, minus the SSR-mismatch
 * warning), and a pinned "now". The theme is timezone-immune because
 * dates parse locally and render through the provider's zone; testing
 * with the viewer's zone exercises exactly that path.
 */
export const IntlTestProvider: FC<IntlTestProviderProps> = ({
	children,
	locale = 'en',
	now = new Date(2024, 0, 1),
}) => (
	<IntlProvider
		locale={locale}
		messages={locales[locale].messages}
		now={now}
		timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
	>
		{children}
	</IntlProvider>
)
