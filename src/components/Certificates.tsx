import { CertificateIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useFormatter, useTranslations } from 'use-intl'
import type { ResumeSchema } from '../types/resumeSchema'
import { SidebarEntry } from './ui/SidebarEntry'
import { SidebarSection } from './ui/SidebarSection'

type Certificate = NonNullable<ResumeSchema['certificates']>[number]

interface CertificatesProps {
	certificates?: Certificate[]
}

export const Certificates: FC<CertificatesProps> = ({ certificates }) => {
	const f = useFormatter()
	const t = useTranslations()

	if (!certificates?.length) return null

	return (
		<SidebarSection title='sections.certificates'>
			<div className='space-y-3 print:space-y-2.5'>
				{certificates.map((certificate, index) => (
					<SidebarEntry
						key={index}
						icon={<CertificateIcon className='h-3.5 w-3.5' />}
						title={certificate.name}
						subtitle={
							certificate.issuer
								? `${t('common.issuedBy')} ${certificate.issuer}`
								: undefined
						}
						date={
							certificate.startDate || certificate.date
								? f.dateTime(
										new Date(certificate.startDate || certificate.date || ''),
										{ month: 'short', year: 'numeric' },
									)
								: undefined
						}
						url={certificate.url}
						urlLabel={t('common.viewCertificate')}
					/>
				))}
			</div>
		</SidebarSection>
	)
}
