---
title: Mocking higher-order components (HOC) and context
date: 2021-02-08
excerpt: A reusable jest.mock pattern for higher-order components, and why context is better tested by rendering the real provider than by mocking it.
tags: React, Testing, HOC
---

I'd solved this exact problem once before, and then spent longer than I'd like to admit trying to find that solution again. That's usually a sign it belongs here.

## Higher-order components (HOC)

```javascript
jest.mock("@HOC", () => {
	return {
		withHOC: (Component) => {
			return (props) => {
				return <Component newProp={jest.fn()} {...props} />
			}
		},
	}
})
```

- `"@HOC"` is the package being mocked, internal or external.
- `withHOC` is the composition function's name.
- `Component` is the component the HOC wraps.
- `props` are the props the component would normally receive.
- `newProp` is whatever prop the real HOC adds — mocked here as a jest mock function.

## Context

```javascript
// Don't.
```

It's better to bring the real context provider into the test than to mock it. The closer a test gets to how a person actually uses the app, the more it's worth trusting. That means testing behavior, not implementation:

- Do: assert that clicking a button reveals an element.
- Don't: assert that an element has certain props.
