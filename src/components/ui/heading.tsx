import { cva, VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"

import { cn } from "~/shared/cn"

const headingVariants = cva("", {
	variants: {
		variant: {
			heading: "",
			display: "",
			eyebrow: "font-text text-eyebrow uppercase",
		},
		size: {
			"2xl": "",
			xl: "",
			lg: "",
			md: "",
		},
		tone: {
			ink: "text-ink",
			"brass-ink": "text-brass-ink",
		},
	},
	compoundVariants: [
		{ variant: "heading", size: ["2xl", "xl", "lg"], className: "font-display" },
		{ variant: "heading", size: "2xl", className: "text-heading-1" },
		{ variant: "heading", size: "xl", className: "text-heading-2" },
		{ variant: "heading", size: "lg", className: "text-heading-3" },
		{ variant: "heading", size: "md", className: "font-text text-heading-4" },
		{ variant: "display", size: ["2xl", "xl", "lg", "md"], className: "font-display" },
		{ variant: "display", size: "2xl", className: "text-display-2xl" },
		{ variant: "display", size: "xl", className: "text-display-xl" },
		{ variant: "display", size: "lg", className: "text-display-lg" },
		{ variant: "display", size: "md", className: "text-display-md" },
	],
	defaultVariants: {
		variant: "heading",
		tone: "ink",
	},
})

type HeadingVariants = VariantProps<typeof headingVariants>
type DisplaySize = NonNullable<HeadingVariants["size"]>
type HeadingTone = NonNullable<HeadingVariants["tone"]>
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "span"
type HeadingVariant = NonNullable<HeadingVariants["variant"]>

/** Tag a `variant="heading"` heading renders as when `as` is omitted — same semantic level as `size` (`2xl`→`h1` … `md`→`h4`). */
const TAG_BY_HEADING_SIZE = {
	"2xl": "h1",
	xl: "h2",
	lg: "h3",
	md: "h4",
} satisfies Record<DisplaySize, HeadingTag>

/** Tag a `variant="display"` heading renders as when `as` is omitted — DESIGN.md's type scale usage (hero vs. section titles). */
const TAG_BY_DISPLAY_SIZE = {
	"2xl": "h1",
	xl: "h1",
	lg: "h1",
	md: "h2",
} satisfies Record<DisplaySize, HeadingTag>

interface HeadingProps {
	tone?: HeadingTone
	/** Overrides the rendered tag when the semantic level should differ from the visual size. Defaults per `size` (see TAG_BY_HEADING_SIZE / TAG_BY_DISPLAY_SIZE). */
	as?: HeadingTag
	id?: string
	children: ReactNode
	size: DisplaySize
	variant?: HeadingVariant
	className?: string
}

/**
 * Heading-scale text. `variant="heading"` (the default) renders DESIGN.md's
 * `heading-1`–`heading-4` article/section scale; `variant="display"` renders
 * its `display-2xl`–`display-md` statement scale for hero headlines and home
 * section titles. `size` picks the visual scale within that variant; `as`
 * picks the rendered tag when it should differ from `size`'s default — e.g.
 * `PostCard`'s title adds its own `mt-underline w-fit` via `className` since
 * only a link-wrapped title draws on hover.
 *
 * @example <Heading size="lg">Small useful things</Heading>
 * @example <Heading variant="display" size="md">Latest writing</Heading>
 * @example <Heading size="lg" className="mt-underline w-fit">{title}</Heading>
 */
function Heading(props: HeadingProps) {
	const { tone, as, id, size, variant, className, children } = props
	const Tag = as ?? (variant === "display" ? TAG_BY_DISPLAY_SIZE[size] : TAG_BY_HEADING_SIZE[size])

	return (
		<Tag id={id} className={cn(headingVariants({ tone, size, variant }), className)}>
			{children}
		</Tag>
	)
}

export default Heading
export { headingVariants }
export type { HeadingProps }
