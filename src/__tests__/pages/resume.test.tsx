import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import Resume from "~/pages/resume"
import { SITE_EMAIL } from "~/shared/site"

describe("Resume", () => {
	it("links the email and LinkedIn contact details", () => {
		// Arrange & Act
		render(<Resume />)

		// Assert
		expect(screen.getByRole("link", { name: SITE_EMAIL })).toHaveAttribute("href", `mailto:${SITE_EMAIL}`)
		const linkedInLinks = screen.getAllByRole("link", { name: "LinkedIn" })
		expect(linkedInLinks.length).toBeGreaterThan(0)
		for (const link of linkedInLinks) {
			expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/kyle-monti")
		}
	})

	it("renders the résumé heading with the person's name", () => {
		// Arrange & Act
		render(<Resume />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: "Kyle Monti" })).toBeInTheDocument()
	})

	it("lists each employer as a résumé entry", () => {
		// Arrange
		const employers = ["Trane Technologies", "Magenta Technologies", "Red Ventures", "Walmart"]

		// Act
		render(<Resume />)

		// Assert
		for (const employer of employers) {
			expect(screen.getByText(employer)).toBeInTheDocument()
		}
	})

	it("prints the page when the download button is clicked", async () => {
		// Arrange
		const user = userEvent.setup()
		const print = vi.spyOn(window, "print").mockImplementation(() => undefined)
		render(<Resume />)

		// Act
		await user.click(screen.getByRole("button", { name: /download pdf/i }))

		// Assert
		expect(print).toHaveBeenCalledOnce()
	})
})
