import type { ResumeDocument } from '../types/resume'
import { IconContext } from '@phosphor-icons/react'
import type { FC, ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { type Locale, locales } from '../i18n/config'
import { resolveLocale } from '../i18n/resolveLocale'

interface FolioProviderProps {
	/** The resume document — its declared language is the locale default */
	resume?: ResumeDocument
	/** Explicit locale — otherwise the resume's declared language, else English */
	locale?: Locale
	/** Pinned "now" (tests) — otherwise the wall clock */
	now?: Date
	children: ReactNode
}

/**
 * The **Folio provider**: the theme's runtime configuration, owned
 * once — the i18n message catalog, locale resolution, the viewer's
 * timezone, "now", and the duotone icon weight.
 *
 * This is where the **Resume date** contract is enforced: locale,
 * timezone, and "now" all come from this provider — never `new Date()`
 * in a component. `Resume` installs it behind its own interface, so
 * pages and hosts need not know it exists; tests use it directly with
 * a pinned "now". The theme is timezone-immune because dates parse
 * locally and render through the provider's zone.
 */
export const FolioProvider: FC<FolioProviderProps> = ({
	resume,
	locale,
	now,
	children,
}) => {
	const resolvedLocale = locale ?? (resume ? resolveLocale(resume) : 'en')

	// Explicitly the viewer's own timezone (same behavior as the
	// library fallback, minus the SSR-mismatch warning).
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	return (
		<IntlProvider
			messages={locales[resolvedLocale].messages}
			locale={resolvedLocale}
			timeZone={timeZone}
			now={now}
		>
			<IconContext.Provider value={{ weight: 'duotone' }}>
				{children}
			</IconContext.Provider>
		</IntlProvider>
	)
}
