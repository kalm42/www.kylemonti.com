import { describe, expect, it } from "vitest"

import { getAllPosts, getPostBySlug, getPostSlugs } from "~/shared/blog"

describe("blog content", () => {
	it("lists every post slug found in src/content/blog", () => {
		// Arrange & Act
		const slugs = getPostSlugs()

		// Assert
		expect(slugs).toEqual(expect.arrayContaining(["designing-a-calmer-date-picker", "why-springs-feel-right"]))
	})

	it("sorts posts newest first", () => {
		// Arrange & Act
		const posts = getAllPosts()

		// Assert
		const dates = posts.map((post) => post.date)
		const sortedDescending = [...dates].sort((a, b) => (a < b ? 1 : -1))
		expect(dates).toEqual(sortedDescending)
	})

	it("parses a post's frontmatter and body", () => {
		// Arrange & Act
		const { post, document } = getPostBySlug("designing-a-calmer-date-picker")

		// Assert
		expect(post.title).toBe("Designing a calmer date picker")
		expect(post.tags).toEqual(["React", "Design"])
		expect(document.children.some((node) => node.type === "code")).toBe(true)
		expect(document.children.some((node) => node.type === "callout")).toBe(true)
	})
})
