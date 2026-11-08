import { IconContext } from '@phosphor-icons/react'
import type { FC } from 'react'
import { IntlProvider } from 'use-intl'
import { Resume } from './components/Resume'
import { type Locale, locales } from './i18n/config'
import { resolveLocale } from './i18n/resolveLocale'
import type { Resume as ResumeDocument } from '@jsonresume/types'

interface AppProps {
	resume: ResumeDocument
	/** Defaults to the resume's declared language, when we ship it */
	locale?: Locale
}

const App: FC<AppProps> = ({ resume, locale }) => {
	// Explicitly the viewer's own timezone (same behavior as the
	// library fallback, minus the SSR-mismatch warning).
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const resolvedLocale = locale ?? resolveLocale(resume)

	return (
		<IntlProvider
			messages={locales[resolvedLocale].messages}
			locale={resolvedLocale}
			timeZone={timeZone}
		>
			<IconContext.Provider value={{ weight: 'duotone' }}>
				<Resume resume={resume} />
			</IconContext.Provider>
		</IntlProvider>
	)
}

export { App }
