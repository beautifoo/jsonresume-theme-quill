import {
	GithubLogoIcon,
	LinkedinLogoIcon,
	MediumLogoIcon,
	StackOverflowLogoIcon,
	XLogoIcon,
} from '@phosphor-icons/react'

interface NetworkIconProps {
	name: string
}

/**
 * Social network glyphs, decorative only — they inherit the current
 * color so they sit quietly in both schemes (brand colors would fight
 * the palette and vanish in dark mode).
 */
export const NetworkIcon = ({ name }: NetworkIconProps) => {
	const lowercased = name.toLowerCase()

	const props = {
		className: 'h-3.5 w-3.5',
		'aria-hidden': true as const,
	}

	switch (lowercased) {
		case 'github':
			return <GithubLogoIcon {...props} />
		case 'linkedin':
			return <LinkedinLogoIcon {...props} />
		case 'twitter':
		case 'x':
			return <XLogoIcon {...props} />
		case 'medium':
			return <MediumLogoIcon {...props} />
		case 'stackoverflow':
			return <StackOverflowLogoIcon {...props} />
		default:
			return null
	}
}
