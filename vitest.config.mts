import { defineConfig, configDefaults } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		exclude: [...configDefaults.exclude, "e2e/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			include: ["src/**"],
			exclude: [
				...(configDefaults.coverage.exclude ?? []),
				"src/__tests__/**",
				"src/mocks/**",
				"src/types/**",
				"src/content/**",
			],
		},
	},
})
