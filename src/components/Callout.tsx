import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"

const calloutStyles = cva("flex flex-col gap-2 rounded-md p-5", {
	variants: {
		kind: {
			note: "bg-brand-tint",
			tip: "bg-brass-tint",
			caution: "bg-danger-tint",
		},
	},
	defaultVariants: {
		kind: "note",
	},
})

const calloutLabelStyles = cva("flex items-center gap-2 font-text text-ui font-semibold", {
	variants: {
		kind: {
			note: "text-brand",
			tip: "text-brass-ink",
			caution: "text-danger",
		},
	},
	defaultVariants: {
		kind: "note",
	},
})

type CalloutVariants = VariantProps<typeof calloutStyles>
type CalloutKind = NonNullable<CalloutVariants["kind"]>

const DEFAULT_LABELS: Record<CalloutKind, string> = {
	note: "Note",
	tip: "Tip",
	caution: "Caution",
}

interface CalloutProps {
	kind?: CalloutKind
	title?: string
	children: ReactNode
}

/**
 * A short aside inside an article. The label is always a word with a
 * diamond — never colour alone. Max 2 per article, 2 sentences each.
 *
 * @example <Callout kind="tip">Use the keyboard shortcut instead.</Callout>
 */
function Callout(props: CalloutProps) {
	const { kind = "note", title, children } = props

	return (
		<div className={calloutStyles({ kind })}>
			<p className={calloutLabelStyles({ kind })}>
				<span className='h-1.5 w-1.5 rotate-45 bg-current' />
				{title ?? DEFAULT_LABELS[kind]}
			</p>
			<div className='font-text text-body text-ink'>{children}</div>
		</div>
	)
}

export default Callout
export type { CalloutKind, CalloutProps }
