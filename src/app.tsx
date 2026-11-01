import { IconContext } from '@phosphor-icons/react'
import type { FC } from 'react'
import { IntlProvider } from 'use-intl'
import { Resume } from './components/Resume'
import { type Locale, locales } from './i18n/config'
import type { ResumeSchema } from './types/resumeSchema'

interface AppProps {
	resume: ResumeSchema
	locale?: Locale
}

const App: FC<AppProps> = ({ resume, locale = 'en' }) => {
	// Explicitly the viewer's own timezone (same behavior as the
	// library fallback, minus the SSR-mismatch warning).
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	return (
		<IntlProvider
			messages={locales[locale].messages}
			locale={locale}
			timeZone={timeZone}
		>
			<IconContext.Provider value={{ weight: 'duotone' }}>
				<Resume resume={resume} />
			</IconContext.Provider>
		</IntlProvider>
	)
}

export { App }
