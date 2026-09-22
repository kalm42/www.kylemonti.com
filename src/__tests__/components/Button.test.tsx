import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Button from "~/components/Button"

describe("Button", () => {
	it("renders as a link when href is provided", () => {
		// Arrange
		const href = "/blog"

		// Act
		render(<Button href={href}>Read the writing</Button>)

		// Assert
		expect(screen.getByRole("link", { name: "Read the writing" })).toHaveAttribute("href", href)
	})

	it("renders as a button when no href is provided", () => {
		// Arrange & Act
		render(<Button>Submit</Button>)

		// Assert
		expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "button")
	})

	it("opens an external link in a new tab with a secure rel attribute", () => {
		// Arrange
		const href = "https://tallyho.kylemonti.com"

		// Act
		render(
			<Button href={href} external>
				Open Tallyho
			</Button>,
		)

		// Assert
		const link = screen.getByRole("link", { name: "Open Tallyho" })
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
	})

	it("disables the button when disabled is set", () => {
		// Arrange & Act
		render(<Button disabled>Save</Button>)

		// Assert
		expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()
	})

	it("shows an outbound icon for external links and a same-site icon otherwise", () => {
		// Arrange & Act
		render(
			<Button href='/blog' arrow>
				Read the writing
			</Button>,
		)
		render(
			<Button href='https://tallyho.kylemonti.com' arrow external>
				Open Tallyho
			</Button>,
		)

		// Assert
		expect(
			screen.getByRole("link", { name: "Read the writing" }).querySelector("svg.lucide-arrow-right"),
		).toBeInTheDocument()
		expect(
			screen.getByRole("link", { name: "Open Tallyho" }).querySelector("svg.lucide-arrow-up-right"),
		).toBeInTheDocument()
	})
})
