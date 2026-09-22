import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import type { ReactNode } from "react"

const tagStyles = cva(
	"inline-flex items-center rounded-pill px-3 py-1 font-text text-ui transition-colors duration-base hover:bg-brand-tint hover:text-ink",
	{
		variants: {
			tone: {
				neutral: "bg-paper-sunken text-ink-muted",
				brass: "bg-brass-tint text-brass-ink",
			},
		},
		defaultVariants: {
			tone: "neutral",
		},
	},
)

type TagVariants = VariantProps<typeof tagStyles>
type TagTone = NonNullable<TagVariants["tone"]>

interface TagProps {
	tone?: TagTone
	href?: string
	children: ReactNode
}

/**
 * A small pill naming a topic or technology — never a sentence. `neutral`
 * for topics/skills; `brass` for at most one "Featured" flag. Keep to
 * three per post.
 *
 * @example <Tag>React</Tag>
 * @example <Tag tone="brass" href="/tag/featured">Featured</Tag>
 */
function Tag(props: TagProps) {
	const { tone, href, children } = props
	const classes = tagStyles({ tone })

	if (href === undefined) {
		return <span className={classes}>{children}</span>
	}

	return (
		<Link href={href} className={classes}>
			{children}
		</Link>
	)
}

export default Tag
export type { TagProps, TagTone }
