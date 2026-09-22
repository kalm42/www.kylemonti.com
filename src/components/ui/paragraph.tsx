import { cva, type VariantProps } from "class-variance-authority"

const paragraphVariants = cva("", {
	variants: {
		variant: {
			default: "",
			excerpt: "text-ink-muted mt-3",
			mono: "font-mono text-caption text-ink-subtle mt-1",
			muted: "font-text text-body text-ink-muted",
			eyebrow: "font-text text-eyebrow uppercase text-brass-ink whitespace-nowrap",
			caption: "font-text text-caption text-ink-subtle",
			lede: "font-text text-lede text-ink italic",
		},
	},
	compoundVariants: [{ variant: ["default", "excerpt", "muted"], className: "font-text" }],
	defaultVariants: {
		variant: "default",
	},
})

type ParagraphVariants = VariantProps<typeof paragraphVariants>

interface ParagraphProps extends ParagraphVariants {
	children: React.ReactNode
	className?: string
}

const Paragraph = (props: ParagraphProps) => {
	const { children, variant, className } = props
	return <p className={paragraphVariants({ variant, className })}>{children}</p>
}

export default Paragraph
