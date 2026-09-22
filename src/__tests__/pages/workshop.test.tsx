import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import Workshop from "~/pages/workshop"
import { PROJECTS } from "~/shared/projects"

describe("Workshop", () => {
	it("renders the workshop page heading", () => {
		// Arrange & Act
		render(<Workshop />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: "Small useful things" })).toBeInTheDocument()
	})

	it("lists each project as a link to its own site", () => {
		// Arrange & Act
		render(<Workshop />)

		// Assert
		for (const project of PROJECTS) {
			expect(screen.getByRole("link", { name: new RegExp(project.name) })).toHaveAttribute("href", project.href)
		}
	})
})
