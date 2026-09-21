import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env["CI"],
	retries: process.env["CI"] ? 2 : 0,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		// `next start` requires a server build, which isn't produced when
		// `output: "export"` is set (see next.config.ts), so e2e runs against
		// the dev server instead.
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env["CI"],
		env: {
			NEXT_PUBLIC_API_MOCKING: "enabled",
		},
	},
})
