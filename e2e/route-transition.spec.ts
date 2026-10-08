import { test, expect } from "@playwright/test"

test("opens a post from the blog list through a view transition", async ({ page }) => {
	// Arrange
	await page.addInitScript(() => {
		const startViewTransition = document.startViewTransition.bind(document)
		document.startViewTransition = (update) => {
			document.documentElement.dataset["viewTransitions"] = String(
				Number(document.documentElement.dataset["viewTransitions"] ?? 0) + 1,
			)
			return startViewTransition(update)
		}
	})
	await page.goto("/blog")
	const postLink = page.getByRole("link", { name: /how to fill css grid with auto-fitting content/i })
	const articleHeading = page.getByRole("heading", {
		level: 1,
		name: /how to fill css grid with auto-fitting content/i,
	})

	// Act
	await postLink.click()

	// Assert
	await expect(page).toHaveURL(/\/blog\/css-grid-autofill$/)
	await expect(articleHeading).toBeVisible()
	await expect(articleHeading).toHaveCSS("view-transition-name", "post-title-blog-css-grid-autofill")
	await expect(page.locator("html")).toHaveAttribute("data-view-transitions", "1")
})
