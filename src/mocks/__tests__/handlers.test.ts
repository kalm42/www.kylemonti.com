import { http, HttpResponse } from "msw"
import { describe, expect, test } from "vitest"

import { server } from "~/mocks/node"

describe("handlers", () => {
	test("intercepts requests using the default handlers", async () => {
		// Arrange
		const expectedName = "John Doe (mocked)"

		// Act
		const response = await fetch("/api/hello")

		// Assert
		await expect(response.json()).resolves.toEqual({ name: expectedName })
	})

	test("supports overriding a handler per test", async () => {
		// Arrange
		server.use(
			http.get("/api/hello", () => {
				return HttpResponse.json({ name: "Jane Doe" })
			}),
		)

		// Act
		const response = await fetch("/api/hello")

		// Assert
		await expect(response.json()).resolves.toEqual({ name: "Jane Doe" })
	})
})
