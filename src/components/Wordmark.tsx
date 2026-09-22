import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

const wordmarkStyles = cva("group inline-flex whitespace-nowrap font-display text-ink tracking-[-0.015em]", {
	variants: {
		size: {
			sm: "text-[1.125rem]",
			md: "text-[1.5rem]",
			lg: "text-[2.5rem]",
		},
	},
	defaultVariants: {
		size: "md",
	},
})

type WordmarkVariants = VariantProps<typeof wordmarkStyles>
type WordmarkSize = NonNullable<WordmarkVariants["size"]>

interface WordmarkProps {
	size?: WordmarkSize
	href?: string
}

/**
 * The site's only logo, set in type: "Kyle" upright, "Monti" italic, both
 * `display` weight 420/360. Never draw a mark, bold it, or stack it on two
 * lines. `sm` for subdomain headers, `md` for the site header, `lg` for
 * the footer.
 *
 * @example <Wordmark size="md" href="/" />
 */
function Wordmark(props: WordmarkProps) {
	const { size, href } = props
	const mark = (
		<span className={wordmarkStyles({ size })}>
			<span className='font-[420]'>Kyle</span>
			<span className='font-[360] italic transition-colors duration-base ease-glide group-hover:text-brand'>
				&nbsp;Monti
			</span>
		</span>
	)

	if (href === undefined) {
		return mark
	}

	return (
		<Link href={href} aria-label='Kyle Monti — home'>
			{mark}
		</Link>
	)
}

export default Wordmark
export type { WordmarkProps, WordmarkSize }
