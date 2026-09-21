declare namespace NodeJS {
	interface ProcessEnv {
		// Enables the MSW browser worker in _app.tsx; set by e2e runs (see
		// playwright.config.ts). Declared here so Next.js's static
		// `process.env.NEXT_PUBLIC_*` inlining keeps working with
		// noPropertyAccessFromIndexSignature.
		readonly NEXT_PUBLIC_API_MOCKING?: "enabled"
	}
}
