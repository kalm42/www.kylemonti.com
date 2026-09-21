import { test, expect } from "@playwright/test"

test("renders the home page heading", async ({ page }) => {
	// Arrange
	const heading = page.getByRole("heading", { level: 1, name: /babies first southern oregon/i })

	// Act
	await page.goto("/")

	// Assert
	await expect(heading).toBeVisible()
})
