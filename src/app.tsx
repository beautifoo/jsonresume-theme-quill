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
	return (
		// No timeZone: a resume viewed on screen should show dates in the
		// viewer's own timezone. (The print canvas renders in UTC anyway.)
		<IntlProvider messages={locales[locale].messages} locale={locale}>
			<IconContext.Provider value={{ weight: 'duotone' }}>
				<Resume resume={resume} />
			</IconContext.Provider>
		</IntlProvider>
	)
}

export { App }
