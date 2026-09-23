---
title: How to make a React error boundary with TypeScript
date: 2020-10-15
excerpt: A ready-to-use React error boundary component in TypeScript, adapted from the React TypeScript cheatsheet.
tags: React, TypeScript
---

I found this in the [React TypeScript cheatsheet's error boundary guide](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/) and I'm copying it here for quick reference.

```tsx title="ErrorBoundary.tsx"
import React, { Component, ErrorInfo, ReactNode } from "react"

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	}

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo)
	}

	public render() {
		if (this.state.hasError) {
			return <h1>Sorry, there was an error</h1>
		}

		return this.props.children
	}
}

export default ErrorBoundary
```

A natural next step is accepting a `fallback` prop instead of the hardcoded `<h1>`, so callers can pass in their own error UI.
