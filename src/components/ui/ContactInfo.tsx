import { AtIcon, GlobeIcon, PhoneIcon } from '@phosphor-icons/react'
import type { FC } from 'react'
import { useTranslations } from 'use-intl'
import { cn } from '../../lib/utils'

interface ContactInfoProps {
	email?: string
	phone?: string
	url?: string
	className?: string
}

const Item: FC<{ icon: React.ReactNode; label: string; href?: string; children: React.ReactNode }> = ({
	icon,
	label,
	href,
	children,
}) => {
	const body = (
		<>
			<span className='shrink-0 text-accent' aria-hidden='true'>
				{icon}
			</span>
			{children}
		</>
	)
	return (
		<span className='flex items-center gap-2'>
			{href ? (
				<a
					href={href}
					aria-label={label}
					className='text-ink-3 no-underline hover:text-accent hover:underline hover:decoration-accent/50'
				>
					{body}
				</a>
			) : (
				<span aria-label={label}>{body}</span>
			)}
		</span>
	)
}

/**
 * The header contact row: location is rendered by the Header; this is
 * email / phone / website, with the accent reserved for the icons.
 */
export const ContactInfo: FC<ContactInfoProps> = ({ email, phone, url, className }) => {
	const t = useTranslations()

	if (!email && !phone && !url) return null

	return (
		<div
			className={cn(
				'flex flex-wrap gap-x-6 gap-y-1.5 text-[0.9rem] text-ink-3 print:gap-x-4 print:gap-y-1 print:text-[0.8rem]',
				className,
			)}
		>
			{email && (
				<Item
					icon={<AtIcon className='h-3.5 w-3.5' />}
					label={t('common.email')}
					href={`mailto:${email}`}
				>
					{email}
				</Item>
			)}
			{phone && (
				<Item
					icon={<PhoneIcon className='h-3.5 w-3.5' />}
					label={t('common.phone')}
					href={`tel:${phone.replace(/\s+/g, '')}`}
				>
					{phone}
				</Item>
			)}
			{url && (
				<Item
					icon={<GlobeIcon className='h-3.5 w-3.5' />}
					label={t('common.website')}
					href={url}
				>
					{/* Show the bare hostname, not the protocol */}
					{url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
				</Item>
			)}
		</div>
	)
}
