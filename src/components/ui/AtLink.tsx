import { useTranslations } from 'use-intl'

/**
 * The title-row "at" connector — organization context ("at Acme"), with
 * the label linked when a URL is present. Work, education, and volunteer
 * entries use it; a project's bare role does not ("at" means "at an
 * organization"). Lives in the treatment, not in the entry — the
 * SectionCard renders whatever the treatment composed.
 */
export const AtLink = ({ label, url }: { label: string; url?: string }) => {
	const t = useTranslations()

	return (
		<>
			{/* No leading space: SectionCard pads the title-row gap */}
			{`${t('common.at')} `}
			{url ? (
				<a href={url} target='_blank' rel='noopener noreferrer'>
					{label}
				</a>
			) : (
				label
			)}
		</>
	)
}
