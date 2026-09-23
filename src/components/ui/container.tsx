import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"
import { cn } from "~/shared/cn"

/**
 * Frames a page section: max-width + centering, horizontal gutter, and the
 * vertical rhythm between sections. For internal flex/grid layout with no
 * width or gutter concerns (card columns, button rows, grids), use `Stack`.
 */
const containerVariants = cva("flex", {
	variants: {
		width: {
			page: "w-full mx-auto max-w-page",
			prose: "mx-auto max-w-prose",
			full: "",
		},
		gutter: {
			true: "px-gutter md:px-gutter-wide",
			false: "",
		},
		direction: {
			col: "flex-col",
			row: "flex-row",
			responsive: "flex-col md:flex-row",
		},
		gap: {
			"0": "",
			"4": "gap-4",
			"6": "gap-6",
			"8": "gap-8",
			"9": "gap-9",
		},
		space: {
			none: "",
			hero: "pt-10 pb-9",
			section: "py-9",
			tail: "pb-9",
			"tail-lg": "pb-10",
			article: "pt-10 pb-5 md:pb-10",
			feature: "py-5 md:py-10",
			divider: "mb-6",
		},
		print: {
			true: "",
			false: "",
		},
	},
	compoundVariants: [
		{ gutter: true, print: true, class: "print:px-0" },
		{ space: "hero", print: true, class: "print:pt-0" },
		{ space: "section", print: true, class: "print:py-6" },
		{ space: "tail-lg", print: true, class: "print:py-6" },
	],
	defaultVariants: {
		width: "page",
		gutter: true,
		direction: "col",
		gap: "0",
		space: "none",
		print: false,
	},
})

interface ContainerProps extends VariantProps<typeof containerVariants> {
	children: ReactNode
	as?: "div" | "section" | "article"
	className?: string
}

export default function Container(props: ContainerProps) {
	const { children, as: Component = "div", className, width, gutter, direction, gap, space, print } = props
	return (
		<Component className={cn(containerVariants({ width, gutter, direction, gap, space, print }), className)}>
			{children}
		</Component>
	)
}
