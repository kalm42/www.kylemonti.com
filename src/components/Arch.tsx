import { cva, type VariantProps } from "class-variance-authority"

const archStyles = cva("", {
	variants: {
		tone: {
			brand: "fill-brand",
			"brand-tint": "fill-brand-tint",
			"brass-outline": "fill-none stroke-brass",
		},
		size: {
			// Fills whatever sized element contains it — for placements (cover, empty states, section art) with no fixed size of their own yet.
			fill: "h-full w-full",
			hero: "h-[440px] w-[340px]",
		},
	},
	defaultVariants: {
		tone: "brand",
		size: "fill",
	},
})

type ArchVariants = VariantProps<typeof archStyles>
type ArchTone = NonNullable<ArchVariants["tone"]>
type ArchSize = NonNullable<ArchVariants["size"]>

interface ArchProps {
	tone?: ArchTone
	size?: ArchSize
}

/**
 * The site's single graphic motif: a block whose top is a semicircle,
 * standing on the ground line. Used in the hero and cover, for empty
 * states, and as section art — never a stock photo or illustration.
 *
 * @example <Arch tone="brass-outline" />
 * @example <Arch size="hero" />
 */
function Arch(props: ArchProps) {
	const { tone, size } = props

	return (
		<svg viewBox='0 0 340 440' role='presentation' className={archStyles({ tone, size })}>
			<path className='fill-brand-tint' pathLength='1' d='M20 440V170A150 150 0 0 1 320 170V440Z'></path>
			<path
				className='fill-none stroke-brass stroke-1 mt-draw'
				pathLength='1'
				d='M48 440V170A122 122 0 0 1 292 170V440'
			></path>
			<path className='fill-brand arch--draw' d='M96 440V214A74 74 0 0 1 244 214V440Z'></path>
		</svg>
	)
}

export default Arch
export type { ArchProps, ArchTone }
