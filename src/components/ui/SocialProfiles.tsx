import { type FC, memo } from 'react'
import { useTranslations } from 'use-intl'
import type { ResumeSchema } from '../../types/resumeSchema'
import { cn } from '../../lib/utils'
import { NetworkIcon } from './NetworkIcon'

interface SocialProfilesProps {
	profiles?: NonNullable<ResumeSchema['basics']>['profiles']
	className?: string
}

export const SocialProfiles: FC<SocialProfilesProps> = memo(
	({ profiles, className }) => {
		const t = useTranslations()

		if (!profiles || profiles.length === 0) return null

		return (
			<div className={cn('flex flex-wrap gap-x-4 gap-y-1.5', className)}>
				{profiles.map((profile, index) => {
					if (!profile.network) return null

					return (
						<a
							key={index}
							href={profile.url}
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center gap-1.5 text-[0.9rem] text-ink-3 no-underline hover:text-accent hover:underline hover:decoration-accent/50'
							title={`${profile.network} ${t('common.profile')}`}
						>
							<span className='text-ink-4' aria-hidden='true'>
								<NetworkIcon name={profile.network} />
							</span>
							{profile.username || profile.network}
						</a>
					)
				})}
			</div>
		)
	},
)
