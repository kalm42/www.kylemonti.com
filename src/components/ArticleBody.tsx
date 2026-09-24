import type { BlockNode, MarkdownDocument } from "@tanstack/markdown"
import { type MarkdownComponents, renderBlockReact } from "@tanstack/markdown/react"
import type { ComponentPropsWithoutRef } from "react"
import Button from "~/components/Button"
import Callout, { type CalloutKind } from "~/components/Callout"
import CodeBlock from "~/components/CodeBlock"
import Prose from "~/components/Prose"

interface ArticleBodyProps {
	document: MarkdownDocument
	dropCap?: boolean
}

const CALLOUT_KINDS = new Set<CalloutKind>(["note", "tip", "caution"])

function toCalloutKind(kind: string): CalloutKind {
	return CALLOUT_KINDS.has(kind as CalloutKind) ? (kind as CalloutKind) : "note"
}

function MarkdownAnchor(props: ComponentPropsWithoutRef<"a">) {
	const { href = "", children } = props
	const external = href.startsWith("http")
	return (
		<Button href={href} external={external} arrow={external} variant='quiet' size='inherit' padding='none'>
			{children}
		</Button>
	)
}

const REACT_OPTIONS = { allowHtml: true, components: { a: MarkdownAnchor } satisfies MarkdownComponents }

/**
 * Turns a post's parsed `MarkdownDocument` into the styled article body:
 * code fences become `CodeBlock`, GitHub-style callouts become `Callout`,
 * everything else renders through TanStack Markdown's own block renderer.
 * Renders each top-level block as a direct child of `Prose` so its `>`
 * selectors (see `src/styles/prose.css`) keep matching.
 *
 * @example <ArticleBody document={post.document} />
 */
function ArticleBody(props: ArticleBodyProps) {
	const { document, dropCap = false } = props

	return (
		<Prose dropCap={dropCap}>
			{document.children.map((node, index) => renderNode(node, `block:${String(index)}`))}
		</Prose>
	)
}

function renderNode(node: BlockNode, key: string) {
	if (node.type === "code") {
		return (
			<CodeBlock
				key={key}
				code={node.value}
				{...(node.lang !== undefined && { lang: node.lang })}
				{...(node.title !== undefined && { filename: node.title })}
				{...(node.highlightLines !== undefined && { highlight: node.highlightLines })}
			/>
		)
	}

	if (node.type === "callout") {
		return (
			<Callout key={key} kind={toCalloutKind(node.kind)} title={node.title}>
				{node.children.map((child, index) => renderBlockReact(child, REACT_OPTIONS, `${key}:${String(index)}`))}
			</Callout>
		)
	}

	return renderBlockReact(node, REACT_OPTIONS, key)
}

export default ArticleBody
export type { ArticleBodyProps }
