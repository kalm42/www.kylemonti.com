import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import TextLink from "~/components/TextLink"

describe("TextLink", () => {
	it("renders an internal link that navigates within the site", () => {
		// Arrange
		const href = "/about"

		// Act
		render(<TextLink href={href}>About</TextLink>)

		// Assert
		const link = screen.getByRole("link", { name: "About" })
		expect(link).toHaveAttribute("href", href)
		expect(link).not.toHaveAttribute("target")
	})

	it("opens an external link in a new tab with a secure rel attribute", () => {
		// Arrange
		const href = "https://example.com"

		// Act
		render(
			<TextLink href={href} external>
				Example
			</TextLink>,
		)

		// Assert
		const link = screen.getByRole("link", { name: "Example" })
		expect(link).toHaveAttribute("href", href)
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
	})

	it("shows an outbound arrow only on external links", () => {
		// Arrange & Act
		render(<TextLink href='/about'>About</TextLink>)
		render(
			<TextLink href='https://example.com' external>
				Example
			</TextLink>,
		)

		// Assert
		expect(screen.getByRole("link", { name: "About" }).querySelector("svg")).not.toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Example" }).querySelector("svg")).toBeInTheDocument()
	})
})
