---
title: How to test Redux connected React components
date: 2021-02-17
excerpt: A pattern for mocking Redux state so it's injected directly into connected components under test.
tags: Redux, React, Testing
---

Higher-order components aren't my favorite pattern, but they're everywhere in real codebases, and they need tests like everything else. I tend toward full coverage the way I'd finish a video game, which sometimes means writing an odd test just to hit some `else` branch nothing else exercises.

Here's how to mock Redux state so it gets injected into a connected component.

## Component to test

```javascript title="App.js"
import { connect } from "react-redux"

const App = (props) => <div>{props.user}</div>

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(App)
```

This component barely does anything, but pretend it has real logic worth chasing an edge case for. Here's how.

This starts by extending the render method from `@testing-library/react` — a pattern from [Kent C. Dodds' Testing JavaScript course](https://testingjavascript.com/), which is where I actually learned to test.

Extending the render method lets an initial state get injected straight into the store:

```javascript title="render-util.js"
import React from "react"
import { render } from "@testing-library/react"
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer from "../reducer" // <- that's your reducer

function extRender(ui, { initialState, store = createStore(reducer, initialState), ...renderOptions } = {}) {
	function Wrapper({ children }) {
		return <Provider store={store}>{children}</Provider>
	}
	return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export default extRender
```

Then the extended render gets used to inject the initial state:

```javascript title="App.test.js"
import React from "react"
import { screen } from "@testing-library/react"
import extRender from "../render-util"
import App from "./App"

describe("App", () => {
	it("should show the user name", () => {
		const name = `LOREM IPSUM`
		extRender(<App />, { initialState: { user: name } })

		expect(screen.getByText(name)).toBeInTheDocument()
	})
})
```

## Sources

Most of this is adapted from [Redux's own testing recipes](https://redux.js.org/recipes/writing-tests) — worth reading directly, since it's the official source.
