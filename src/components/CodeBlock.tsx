import { createHighlightedCodeBlockProps } from "@tanstack/highlight/react"
import { useState } from "react"
import { cn } from "~/shared/cn"
import { highlighter } from "~/shared/highlighter"
import Icon from "~/components/Icon"

interface CodeBlockProps {
	code: string
	lang?: string
	filename?: string
	highlight?: number[]
	lineNumbers?: boolean
}

const COPIED_LABEL_MS = 1800

/**
 * A code figure for articles: JetBrains Mono on `code-ground`, dark in
 * both themes. Highlighted with TanStack Highlight, mapped to the
 * `code-*` tokens (see `src/styles/code-theme.css`) — filename bar and
 * copy button included. Never scrolls vertically — break the code
 * instead.
 *
 * @example <CodeBlock code="const a = 1" lang="ts" filename="a.ts" />
 * @example <CodeBlock code={code} lang="ts" highlight={[2, 3]} lineNumbers />
 */
function CodeBlock(props: CodeBlockProps) {
	const { code, lang, filename, highlight = [], lineNumbers = false } = props
	const [copied, setCopied] = useState(false)
	const block = createHighlightedCodeBlockProps({
		highlighter,
		code,
		lineNumbers,
		decorations: highlight.map((line) => ({ lines: line, className: "mt-code-highlight" })),
		...(lang !== undefined && { lang }),
	})

	const handleCopy = () => {
		void navigator.clipboard.writeText(block.copyText).then(() => {
			setCopied(true)
			window.setTimeout(() => {
				setCopied(false)
			}, COPIED_LABEL_MS)
		})
	}

	return (
		<div className='overflow-hidden rounded-lg border border-code-border bg-code-ground my-4'>
			{(filename !== undefined || lang !== undefined) && (
				<div className='flex items-center justify-between border-b border-code-border px-4 py-2'>
					<span className='font-mono text-code-label text-code-ink'>{filename}</span>
					<span className='font-mono text-code-label text-code-comment'>{lang}</span>
				</div>
			)}
			<div className='relative'>
				<div className='absolute top-3 right-3 flex items-center gap-2'>
					{copied && <span className='font-mono text-code-label text-code-comment'>Copied</span>}
					<button
						type='button'
						onClick={handleCopy}
						aria-label='Copy code'
						className='relative flex h-8 w-8 items-center justify-center rounded-md text-code-comment transition-colors duration-fast hover:text-code-ink'
					>
						<span
							className={cn(
								"absolute transition-all duration-instant",
								copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
							)}
						>
							<Icon name='copy' size={16} />
						</span>
						<span
							className={cn(
								"absolute transition-all duration-base ease-spring",
								copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
							)}
						>
							<Icon name='check' size={16} />
						</span>
					</button>
				</div>
				<div className='overflow-x-auto px-4 py-4' dangerouslySetInnerHTML={{ __html: block.htmlMarkup }} />
			</div>
		</div>
	)
}

export default CodeBlock
export type { CodeBlockProps }
