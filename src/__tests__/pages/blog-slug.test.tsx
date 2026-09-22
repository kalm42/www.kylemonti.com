import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import BlogPost from "~/pages/blog/[slug]"
import { getPostBySlug } from "~/shared/blog"
import { formatDateLong } from "~/shared/date"

describe("BlogPost", () => {
	it("renders the article title as the page heading", () => {
		// Arrange
		const { post, document } = getPostBySlug("designing-a-calmer-date-picker")
		const previous = {
			title: "Why springs feel right",
			excerpt: "The physics behind interfaces that feel unhurried, and where a linear curve still wins.",
			date: formatDateLong("2026-02-02"),
			readingTime: "1 min read",
			tags: ["Motion"],
			href: "/blog/why-springs-feel-right",
		}

		// Act
		render(<BlogPost post={post} document={document} previous={previous} />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: post.title })).toBeInTheDocument()
	})

	it("renders a fenced code block from the article body", () => {
		// Arrange
		const { post, document } = getPostBySlug("designing-a-calmer-date-picker")

		// Act
		render(<BlogPost post={post} document={document} />)

		// Assert
		expect(screen.getByText(/usePointerRange/)).toBeInTheDocument()
	})

	it("renders a callout from the article body", () => {
		// Arrange
		const { post, document } = getPostBySlug("designing-a-calmer-date-picker")

		// Act
		render(<BlogPost post={post} document={document} />)

		// Assert
		expect(screen.getByText("Profile the interaction, not the render")).toBeInTheDocument()
	})

	it("links to the previous post when there is one", () => {
		// Arrange
		const { post, document } = getPostBySlug("designing-a-calmer-date-picker")
		const previous = {
			title: "Why springs feel right",
			excerpt: "The physics behind interfaces that feel unhurried, and where a linear curve still wins.",
			date: formatDateLong("2026-02-02"),
			readingTime: "1 min read",
			tags: ["Motion"],
			href: "/blog/why-springs-feel-right",
		}

		// Act
		render(<BlogPost post={post} document={document} previous={previous} />)

		// Assert
		expect(screen.getByRole("link", { name: /Why springs feel right/ })).toHaveAttribute(
			"href",
			"/blog/why-springs-feel-right",
		)
	})
})
