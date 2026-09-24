import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import BlogIndex from "~/pages/blog/index"
import { getAllPosts } from "~/shared/blog"

/** Escapes regex metacharacters so a post title can be matched literally. */
function escapeForRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

describe("BlogIndex", () => {
	it("renders the writing page heading", () => {
		// Arrange
		const posts = getAllPosts()

		// Act
		render(<BlogIndex posts={posts} />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: "Notes from the front end" })).toBeInTheDocument()
	})

	it("lists every post title as a link to its article page", () => {
		// Arrange
		const posts = getAllPosts()

		// Act
		render(<BlogIndex posts={posts} />)

		// Assert
		for (const post of posts) {
			expect(screen.getByRole("link", { name: new RegExp(escapeForRegExp(post.title)) })).toHaveAttribute(
				"href",
				`/blog/${post.slug}`,
			)
		}
	})
})
