---
title: Apollo query mocking basics
date: 2020-12-14
excerpt: A copy-paste-ready pattern for mocking Apollo GraphQL queries in Jest, plus a generator that keeps large responses out of the test file itself.
tags: Apollo, GraphQL, Jest, Testing
---

Testing a component that calls Apollo's GraphQL client means feeding it fake data instead of hitting a real server. Apollo's `MockedProvider` handles that, but the mocks it wants are verbose enough that scattering them through test files makes the tests hard to read. A small generator function fixes that.

## Wrap the component in MockedProvider

```javascript title="Component.test.js"
import React from "react"
import { render } from "@testing-library/react"
import { MockedProvider } from "@apollo/react-testing"
import Component from "./Component"
import { mockQueryName1Generator, mockQueryName2Generator } from "../mock-query-name-generator"

describe("ComponentName", () => {
	it("renders with mocked data", () => {
		const mocks = [...mockQueryName1Generator(2), ...mockQueryName2Generator()]
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<Component />
			</MockedProvider>,
		)
	})
})
```

`MockedProvider` intercepts the queries `Component` fires and resolves them from the `mocks` array instead of a network call. That array comes from a generator, not a literal object sitting in the test.

## Write a mock generator

```javascript title="mock-query-name-generator.js"
import { QUERY_NAME } from "../queries"

export const mockQueryNameGenerator = (count = 1) => {
	return new Array(count).fill({
		request: { query: QUERY_NAME, variables: { someVariable: "the value" } },
		result: () => ({ data: { queryName: { expected: "return values" } } }),
	})
}
```

Calling the generator returns an array of matching mocks, which keeps the test file readable once a query's response runs past a few lines. For anything with a large response shape, I run the app in the browser, copy the real response straight into the mock, and sanitize whatever looks sensitive before it goes in the repo.

That's the whole pattern: one `MockedProvider` wrapper, one generator per query, and the mocks stay out of the way of the test itself.
