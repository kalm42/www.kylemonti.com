import { parseMarkdown } from "@tanstack/markdown/parser"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import ArticleBody from "~/components/ArticleBody"

describe("ArticleBody", () => {
	it("renders a same-site markdown link without an outbound icon", () => {
		// Arrange
		const document = parseMarkdown("See the [workshop](/workshop) for more.")

		// Act
		render(<ArticleBody document={document} />)

		// Assert
		const link = screen.getByRole("link", { name: "workshop" })
		expect(link).toHaveAttribute("href", "/workshop")
		expect(link).not.toHaveAttribute("target")
		expect(link.querySelector("svg")).not.toBeInTheDocument()
	})

	it("opens an external markdown link in a new tab with an outbound icon", () => {
		// Arrange
		const document = parseMarkdown("See [CSS Tricks](https://css-tricks.com/) for more.")

		// Act
		render(<ArticleBody document={document} />)

		// Assert
		const link = screen.getByRole("link", { name: "CSS Tricks" })
		expect(link).toHaveAttribute("href", "https://css-tricks.com/")
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
		expect(link.querySelector("svg")).toBeInTheDocument()
	})
})
