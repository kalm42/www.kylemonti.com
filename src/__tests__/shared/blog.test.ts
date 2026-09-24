import { describe, expect, it } from "vitest"

import { getAllPosts, getPostBySlug, getPostSlugs } from "~/shared/blog"

describe("blog content", () => {
	it("lists every post slug found in src/content/blog", () => {
		// Arrange & Act
		const slugs = getPostSlugs()

		// Assert
		expect(slugs).toEqual(
			expect.arrayContaining(["how-to-type-event-handlers-with-typescript", "why-not-to-use-wordpress"]),
		)
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
		const { post, document } = getPostBySlug("how-to-type-event-handlers-with-typescript")

		// Assert
		expect(post.title).toBe("How to type event handlers with TypeScript")
		expect(post.tags).toEqual(["TypeScript"])
		expect(document.children.some((node) => node.type === "code")).toBe(true)
		expect(document.children.some((node) => node.type === "callout")).toBe(true)
	})
})
