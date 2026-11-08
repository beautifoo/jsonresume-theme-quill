import { CertificateIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import type { Certificate } from '../types/resume'
import { DateStamp } from './ui/ResumeDate'
import { Section } from './ui/Section'
import { SidebarEntry } from './ui/SidebarEntry'

interface CertificatesProps {
	certificates?: Certificate[]
}

export const Certificates: FC<CertificatesProps> = ({ certificates }) => {
	const t = useTranslations()

	if (!certificates?.length) return null

	return (
		<Section title='sections.certificates' variant='list'>
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
							certificate.date ? (
								<DateStamp date={certificate.date} />
							) : undefined
						}
						url={certificate.url}
						urlLabel={t('common.viewCertificate')}
					/>
				))}
			</div>
		</Section>
	)
}
