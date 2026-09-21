# Testing instructions

Apply these rules when writing or changing Vitest unit and integration tests or Playwright end-to-end tests in this repository.

## Test structure and names

- Every test must follow **Arrange, Act, Assert** in that order. Mark each step explicitly with `// Arrange`, `// Act`, and `// Assert` comments inside the test body. Keep the action and observable assertion easy to identify, even when shared setup lives in a hook.
- Give each test a title that states one observable behavior. Avoid titles based on file paths, ticket numbers, or implementation details. Split distinct behaviors into separate tests.
- For Vitest unit and integration tests, put the component or function under test in the root `describe` block. Use nested `describe` blocks only to name a meaningful state or condition. For example, `describe("Home", ...)` with `it("renders the home page heading", ...)`.
- Assert what a user or caller can observe. Prefer accessible role and name queries for UI, and use `userEvent` for user interactions.

```tsx
describe("Home", () => {
	it("renders the home page heading", () => {
		// Arrange
		const expectedHeading = /to get started/i

		// Act
		render(<Home />)

		// Assert
		expect(screen.getByRole("heading", { level: 1, name: expectedHeading })).toBeInTheDocument()
	})
})
```

## File placement

- Keep **all test files outside `src/pages/`**, including tests of page components and API route functions. The Pages Router treats files under `src/pages/` as routes; a `__tests__` directory there previously broke Next's route-type validation.
- Put Vitest tests under `src/__tests__/` or another location outside `src/pages/` that is appropriate to the code under test. The current page tests are in `src/__tests__/pages/`.
- Put Playwright specs under `e2e/`, as configured in `playwright.config.ts`.

## Vitest

- Run unit and integration tests with `npm test`.
- The shared setup in `vitest.setup.ts` starts MSW's Node server and resets handlers after each test. Add a per-test override with `server.use(...)` only when the behavior requires it.
- Prefer integration behavior over internal call counts or component state.
- Mock ONLY third party api requests.
- State why the mock is needed when adding one referenceing the above rule specifically.

## Playwright and the current API limitation

- Run browser tests with `npm run test:e2e`. Playwright starts the Next development server with `NEXT_PUBLIC_API_MOCKING=enabled` and runs specs from `e2e/`.
- `next.config.ts` uses `output: "export"`, so `/api/hello` is supplied only by MSW in tests. Do not make Playwright tests depend on a real response from that path.
- For browser behavior involving `/api/hello`, use the existing MSW browser worker. Wait for the page to render before issuing the request; `src/pages/_app.tsx` withholds rendering until the worker is ready. Make the request in the page context with `page.evaluate(...)` or through a browser UI interaction. `page.request` runs outside the page's service worker and will not be intercepted by MSW.
- Keep the Arrange, Act, Assert comments in Playwright tests too. Treat navigation and readiness checks as setup when the behavior under test happens afterward.

```ts
test("shows the getting-started heading when the home page loads", async ({ page }) => {
	// Arrange
	const heading = page.getByRole("heading", {
		level: 1,
		name: /to get started/i,
	})

	// Act
	await page.goto("/")

	// Assert
	await expect(heading).toBeVisible()
})
```
