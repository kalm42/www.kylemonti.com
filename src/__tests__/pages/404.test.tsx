import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Custom404 from "~/pages/404"

describe("Custom404", () => {
	it("renders the not-found heading", () => {
		// Arrange & Act
		render(<Custom404 />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: "This page isn't here." })).toBeInTheDocument()
	})

	it("links back to the home page", () => {
		// Arrange & Act
		render(<Custom404 />)

		// Assert
		expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/")
	})

	it("links to the blog as an alternative destination", () => {
		// Arrange & Act
		render(<Custom404 />)

		// Assert
		expect(screen.getByRole("link", { name: /read the writing/i })).toHaveAttribute("href", "/blog")
	})
})
