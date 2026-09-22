import type { ReactNode } from "react"
import Button from "~/components/Button"
import Heading from "~/components/ui/heading"
import Paragraph from "./ui/paragraph"

interface SectionHeadingProps {
	eyebrow?: string
	title: string
	action?: string
	actionHref?: string
	children?: ReactNode
}

/**
 * Opens every home-page section. Follow with a hairline and content.
 *
 * @example <SectionHeading eyebrow="Writing" title="Latest writing" action="Read the writing" actionHref="/blog" />
 */
function SectionHeading(props: SectionHeadingProps) {
	const { eyebrow, title, action, actionHref, children } = props

	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div className=''>
				{eyebrow && <p className='font-text text-eyebrow text-brass-ink uppercase mb-3'>{eyebrow}</p>}
				<Heading variant='display' size='md'>
					{title}
				</Heading>
				{children && (
					<Paragraph variant='muted' className='max-w-prose mt-1'>
						{children}
					</Paragraph>
				)}
			</div>
			{action && actionHref && (
				<Button variant='quiet' size='sm' padding='sm' href={actionHref} arrow>
					{action}
				</Button>
			)}
		</div>
	)
}

export default SectionHeading
export type { SectionHeadingProps }
