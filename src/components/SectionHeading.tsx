import type { ReactNode } from "react"
import Button from "~/components/Button"
import Heading from "~/components/ui/heading"
import Paragraph from "./ui/paragraph"
import Stack from "./ui/stack"

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
		<Stack direction='responsive' gap='4' className='sm:items-end sm:justify-between'>
			<div>
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
		</Stack>
	)
}

export default SectionHeading
export type { SectionHeadingProps }
