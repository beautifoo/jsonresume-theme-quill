import { cn } from '../../lib/utils'

interface GrowthIndicatorProps {
	label?: string
	/** Optional discrete level, 1–5, rendered as dots */
	level?: number
	/** Optional 0–100 percentage, rendered as a tiny bar */
	percent?: number
	className?: string
}

/**
 * A small accent pill hinting at progression (promotions, rapid growth).
 * Screen garnish only — the SectionCard hides addons in print.
 */
export const GrowthIndicator = ({
	label = 'Growth',
	level,
	percent,
	className,
}: GrowthIndicatorProps) => {
	const clampedPercent =
		typeof percent === 'number'
			? Math.max(0, Math.min(100, percent))
			: undefined
	const clampedLevel =
		typeof level === 'number' ? Math.max(1, Math.min(5, level)) : undefined

	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 align-middle text-[0.75rem] leading-none text-accent',
				className,
			)}
		>
			<span aria-hidden='true' className='font-semibold'>
				↑
			</span>
			{label}

			{typeof clampedLevel === 'number' && (
				<span className='flex items-center gap-0.5' aria-hidden='true'>
					{[1, 2, 3, 4, 5].map((i) => (
						<span
							key={i}
							className={cn(
								'h-1 w-1 rounded-full',
								i <= clampedLevel
									? 'bg-accent'
									: 'border border-accent/40',
							)}
						/>
					))}
				</span>
			)}

			{typeof clampedPercent === 'number' && (
				<span
					className='h-1 w-10 overflow-hidden rounded-full bg-accent/20'
					aria-hidden='true'
				>
					<span
						className='block h-full rounded-full bg-accent'
						style={{ width: `${clampedPercent}%` }}
					/>
				</span>
			)}
		</span>
	)
}
