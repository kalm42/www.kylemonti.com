import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, vi } from "vitest"

import { server } from "~/mocks/node"

// next/font relies on a Next.js compiler plugin that isn't active under
// Vitest, so stub it out with the shape components expect.
vi.mock("next/font/google", () => {
	const font = () => ({ className: "", variable: "", style: {} })
	return { Fraunces: font, Newsreader: font, JetBrains_Mono: font }
})

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
	cleanup()
	server.resetHandlers()
})

afterAll(() => {
	server.close()
})
