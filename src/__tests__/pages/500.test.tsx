import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Custom500 from "~/pages/500"
import { SITE_EMAIL } from "~/shared/site"

describe("Custom500", () => {
	it("renders the server-error heading", () => {
		// Arrange & Act
		render(<Custom500 />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: "Something went wrong." })).toBeInTheDocument()
	})

	it("links back to the home page", () => {
		// Arrange & Act
		render(<Custom500 />)

		// Assert
		expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/")
	})

	it("offers a mailto link to report the error", () => {
		// Arrange & Act
		render(<Custom500 />)

		// Assert
		expect(screen.getByRole("link", { name: /email me/i })).toHaveAttribute("href", `mailto:${SITE_EMAIL}`)
	})
})
