import { test, expect } from "@playwright/test"

test("renders the home page heading", async ({ page }) => {
	// Arrange
	const heading = page.getByRole("heading", { level: 1, name: /careful interfaces, quietly built/i })

	// Act
	await page.goto("/")

	// Assert
	await expect(heading).toBeVisible()
})
