// Next.js runs this file client-side, before hydration, making it the
// designated place to initialize third-party observability tools.
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation-client.md
import posthog from "posthog-js"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

// No key (e.g. local development without a .env.local) means stay disabled
// rather than send events to nowhere.
if (posthogKey) {
	try {
		posthog.init(posthogKey, {
			api_host: posthogHost,
			defaults: "2026-08-30",
			capture_exceptions: true,
		})
	} catch (error) {
		console.error("Failed to initialize PostHog", error)
	}
}
