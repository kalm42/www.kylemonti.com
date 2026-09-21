declare namespace NodeJS {
	interface ProcessEnv {
		// Enables the MSW browser worker in _app.tsx; set by e2e runs (see
		// playwright.config.ts). Declared here so Next.js's static
		// `process.env.NEXT_PUBLIC_*` inlining keeps working with
		// noPropertyAccessFromIndexSignature.
		readonly NEXT_PUBLIC_API_MOCKING?: "enabled"

		// PostHog project API key. Read in instrumentation-client.ts; when
		// unset, PostHog stays uninitialized (e.g. local development).
		readonly NEXT_PUBLIC_POSTHOG_KEY?: string
		// PostHog ingestion host. Defaults to https://us.i.posthog.com when unset.
		readonly NEXT_PUBLIC_POSTHOG_HOST?: string
	}
}
