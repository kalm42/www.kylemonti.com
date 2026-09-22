import type { ReactNode } from "react"
import { cn } from "~/shared/cn"

interface ProseProps {
	dropCap?: boolean
	className?: string
	children: ReactNode
}

/**
 * The article column. Styles plain HTML from MDX (`p`, `h2`, `h3`, `ul`,
 * `ol`, `blockquote`, `hr`, `figure`, inline `code`) so writers add no
 * classes — see `src/styles/prose.css`. Put `CodeBlock` and `Callout`
 * inside as siblings of the paragraphs.
 *
 * @example <Prose>{mdxContent}</Prose>
 * @example <Prose dropCap>{longEssayContent}</Prose>
 */
function Prose(props: ProseProps) {
	const { dropCap = false, className, children } = props

	return <div className={cn("mt-prose", dropCap && "mt-prose-dropcap", className)}>{children}</div>
}

export default Prose
export type { ProseProps }
