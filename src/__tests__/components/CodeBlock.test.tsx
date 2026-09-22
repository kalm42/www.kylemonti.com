import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import CodeBlock from "~/components/CodeBlock"

describe("CodeBlock", () => {
	it("highlights known syntax tokens for the given language", () => {
		// Arrange & Act
		render(<CodeBlock code='const a = 1' lang='ts' />)

		// Assert
		expect(document.querySelector(".th-keyword")).toHaveTextContent("const")
		expect(document.querySelector(".th-number")).toHaveTextContent("1")
	})

	it("renders unhighlighted plaintext when no language is given", () => {
		// Arrange & Act
		render(<CodeBlock code='const a = 1' />)

		// Assert
		expect(document.querySelector(".th-keyword")).not.toBeInTheDocument()
		expect(screen.getByText("const a = 1")).toBeInTheDocument()
	})

	it("marks the requested lines for highlighting", () => {
		// Arrange & Act
		render(<CodeBlock code={"const a = 1\nconst b = 2"} lang='ts' highlight={[2]} />)

		// Assert
		const lines = document.querySelectorAll(".th-line")
		expect(lines[0]).not.toHaveClass("mt-code-highlight")
		expect(lines[1]).toHaveClass("mt-code-highlight")
	})

	it("copies the code to the clipboard when the copy button is clicked", async () => {
		// Arrange
		const user = userEvent.setup()
		render(<CodeBlock code='console.log("hi")' lang='ts' />)

		// Act
		await user.click(screen.getByRole("button", { name: /copy code/i }))

		// Assert
		await expect(navigator.clipboard.readText()).resolves.toBe('console.log("hi")')
	})

	it("shows a confirmation label after a successful copy", async () => {
		// Arrange
		const user = userEvent.setup()
		render(<CodeBlock code='console.log("hi")' lang='ts' />)

		// Act
		await user.click(screen.getByRole("button", { name: /copy code/i }))

		// Assert
		await waitFor(() => {
			expect(screen.getByText("Copied")).toBeInTheDocument()
		})
	})

	it("shows the filename and language in the header when provided", () => {
		// Arrange & Act
		render(<CodeBlock code='const a = 1' lang='ts' filename='a.ts' />)

		// Assert
		expect(screen.getByText("a.ts")).toBeInTheDocument()
		expect(screen.getByText("ts")).toBeInTheDocument()
	})
})
