import { HouseLineIcon } from '@phosphor-icons/react'
import { type FC, memo } from 'react'
import type { ResumeSchema } from '../types/resumeSchema'
import { ContactInfo } from './ui/ContactInfo'
import { SocialProfiles } from './ui/SocialProfiles'

interface HeaderProps {
	basics: NonNullable<ResumeSchema['basics']>
}

/**
 * Masthead: the name (the one serif moment), label, then a quiet
 * contact/profile block. The headshot — when present — is a real flex
 * participant, never floated over the type.
 */
export const Header: FC<HeaderProps> = memo(({ basics }) => {
	const { name, label, location, summary, image } = basics

	return (
		<header className='flex items-start gap-6 print:gap-4'>
			<div className='min-w-0 flex-1'>
				<h1 className='folio-name break-words'>{name}</h1>
				{label && <p className='folio-label mt-1.5 print:mt-1'>{label}</p>}

				{location && (
					<div className='mt-3 flex items-center gap-2 text-[0.9rem] text-ink-3 print:mt-2 print:text-[0.8rem]'>
						<HouseLineIcon
							className='h-3.5 w-3.5 shrink-0 text-accent'
							aria-hidden='true'
						/>
						<span>
							{[
								location.address,
								location.city,
								location.region,
								location.postalCode,
							]
								.filter(Boolean)
								.join(', ')}
						</span>
					</div>
				)}

				<div className='mt-4 space-y-2 print:mt-2.5 print:space-y-1.5'>
					<ContactInfo {...basics} />
					<SocialProfiles profiles={basics.profiles} />
				</div>
			</div>

			{image && (
				<img
					src={image}
					alt={name}
					className='h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24 print:h-16 print:w-16'
				/>
			)}
		</header>
	)
})
