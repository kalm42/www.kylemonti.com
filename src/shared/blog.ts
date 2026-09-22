import fs from "node:fs"
import path from "node:path"
import type { MarkdownDocument } from "@tanstack/markdown"
import { calloutsExtension } from "@tanstack/markdown/extensions/callouts"
import { parseMarkdown } from "@tanstack/markdown/parser"
import { z } from "zod"
import { estimateReadingTime } from "~/shared/date"

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog")

const postFrontmatterSchema = z.object({
	title: z.string().min(1),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be an ISO date (YYYY-MM-DD)"),
	excerpt: z.string().min(1),
	tags: z
		.string()
		.default("")
		.transform((value) =>
			value
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
})

type PostFrontmatter = z.infer<typeof postFrontmatterSchema>

interface Post extends PostFrontmatter {
	slug: string
	readingTime: string
}

/** Raw `key: value` frontmatter, one field per line — `tags` is comma-separated. */
function parseFrontmatterFields(raw: string): Record<string, string> {
	const fields: Record<string, string> = {}

	for (const line of raw.split("\n")) {
		const separatorIndex = line.indexOf(":")
		if (line.trim() === "" || separatorIndex === -1) {
			continue
		}
		const key = line.slice(0, separatorIndex).trim()
		const value = line.slice(separatorIndex + 1).trim()
		fields[key] = value
	}

	return fields
}

function loadPostFile(slug: string): { frontmatter: PostFrontmatter; document: MarkdownDocument; source: string } {
	const filePath = path.join(CONTENT_DIR, `${slug}.md`)
	const source = fs.readFileSync(filePath, "utf8")
	const document = parseMarkdown(source, {
		frontmatter: true,
		headingIds: true,
		extensions: [calloutsExtension()],
	})

	if (document.frontmatter === undefined) {
		throw new Error(`Blog post "${slug}" is missing frontmatter`)
	}

	const frontmatter = postFrontmatterSchema.parse(parseFrontmatterFields(document.frontmatter))
	return { frontmatter, document, source }
}

function toPost(slug: string, frontmatter: PostFrontmatter, source: string): Post {
	return { ...frontmatter, slug, readingTime: estimateReadingTime(source) }
}

function getPostSlugs(): string[] {
	return fs
		.readdirSync(CONTENT_DIR)
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""))
}

/** Every post's frontmatter, newest first. */
function getAllPosts(): Post[] {
	return getPostSlugs()
		.map((slug) => {
			const { frontmatter, source } = loadPostFile(slug)
			return toPost(slug, frontmatter, source)
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** One post's frontmatter plus its parsed body, for the article page. */
function getPostBySlug(slug: string): { post: Post; document: MarkdownDocument } {
	const { frontmatter, document, source } = loadPostFile(slug)
	return { post: toPost(slug, frontmatter, source), document }
}

export { getAllPosts, getPostBySlug, getPostSlugs }
export type { Post }
