import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"
import { cn } from "~/shared/cn"

/**
 * Generic flex/grid layout for grouping children with a gap — no width,
 * gutter, or vertical rhythm. For page-section framing, use `Container`.
 */
const stackVariants = cva("", {
	variants: {
		direction: {
			col: "flex flex-col",
			row: "flex flex-row",
			responsive: "flex flex-col md:flex-row",
			wrap: "flex flex-wrap flex-row",
			grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		},
		gap: {
			"0": "",
			"1": "gap-1",
			"2": "gap-2",
			"3": "gap-3",
			"4": "gap-4",
			"6": "gap-6",
		},
	},
	defaultVariants: {
		direction: "col",
		gap: "0",
	},
})

interface StackProps extends VariantProps<typeof stackVariants> {
	children: ReactNode
	className?: string
}

export default function Stack(props: StackProps) {
	const { children, className, direction, gap } = props
	return <div className={cn(stackVariants({ direction, gap }), className)}>{children}</div>
}
