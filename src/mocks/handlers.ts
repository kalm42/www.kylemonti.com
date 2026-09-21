import { http, HttpResponse } from "msw"

export const handlers = [
	http.get("/api/hello", () => {
		// Distinct from the real /api/hello response so tests can tell a
		// mocked request apart from one that hit the real route.
		return HttpResponse.json({ name: "John Doe (mocked)" })
	}),
]
