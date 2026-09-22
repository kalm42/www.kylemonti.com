import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface TextLinkProps {
	href: string
	external?: boolean
	children: ReactNode
}

const sharedClassName = "group relative inline-flex items-center gap-1 text-brand"

/**
 * An inline link for use within body text. A brass rule sits under it at
 * rest; an evergreen rule draws left-to-right over it on hover or focus —
 * never remove the rule, it's what tells this apart from plain text.
 * Renders Next.js `Link` for same-site paths, or a new-tab anchor when
 * `external` is set (shown with an outbound arrow).
 *
 * @example <TextLink href="/about">About</TextLink>
 * @example <TextLink href="https://example.com" external>Example</TextLink>
 */
function TextLink(props: TextLinkProps) {
	const { href, external = false, children } = props
	const content = (
		<>
			{children}
			{external && (
				<ArrowUpRight
					size={14}
					strokeWidth={1.5}
					aria-hidden
					className='transition-transform duration-base ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
				/>
			)}
			<span aria-hidden className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brass' />
			<span
				aria-hidden
				className='pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand transition-transform duration-base ease-glide group-hover:scale-x-100 group-focus-visible:scale-x-100'
			/>
		</>
	)

	if (external) {
		return (
			<a href={href} target='_blank' rel='noopener noreferrer' className={sharedClassName}>
				{content}
			</a>
		)
	}

	return (
		<Link href={href} className={sharedClassName}>
			{content}
		</Link>
	)
}

export default TextLink
export type { TextLinkProps }
