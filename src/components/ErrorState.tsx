import type { ReactNode } from "react"
import Arch from "~/components/Arch"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
import Stack from "~/components/ui/stack"

interface ErrorStateProps {
	eyebrow: string
	title: string
	description: string
	children: ReactNode
}

/**
 * The centred content block for a full-page error state (404, 500): the
 * arch motif above an eyebrow status code, heading, description, and a row
 * of actions. Pages still supply their own `NavBar`/`Main`/`SiteFooter`.
 *
 * @example
 * <ErrorState eyebrow="404" title="This page isn't here." description={DESCRIPTION}>
 *   <Button href="/" arrow>Go home</Button>
 * </ErrorState>
 */
function ErrorState(props: ErrorStateProps) {
	const { eyebrow, title, description, children } = props

	return (
		<Stack gap='6' className='items-center px-gutter py-10 text-center md:px-gutter-wide'>
			<div className='h-44 w-36 md:h-56 md:w-44'>
				<Arch tone='brass-outline' size='fill' />
			</div>
			<div>
				<p className='font-text text-eyebrow text-brass-ink uppercase mt-reveal'>{eyebrow}</p>
				<Heading variant='display' size='lg' className='mt-reveal'>
					{title}
				</Heading>
			</div>
			<Paragraph variant='muted' className='max-w-prose mt-reveal'>
				{description}
			</Paragraph>
			<Stack direction='wrap' gap='4' className='mt-reveal items-center justify-center'>
				{children}
			</Stack>
		</Stack>
	)
}

export default ErrorState
export type { ErrorStateProps }
