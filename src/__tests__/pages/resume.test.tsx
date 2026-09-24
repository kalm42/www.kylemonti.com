import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import Resume from "~/pages/resume"

describe("Resume", () => {
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
