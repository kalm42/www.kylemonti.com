---
title: How to type event handlers with TypeScript
date: 2021-04-11
excerpt: The TypeScript type for common DOM event handlers — click, keydown, and focus — when there's no framework inferring it for you.
tags: TypeScript
---

Writing plain DOM TypeScript outside a framework like React, Vue, or Angular means the compiler won't infer an event's type inside `addEventListener` — it comes back `any` unless it's typed by hand. Here's what to use, per event, updated as I run into more of them.

## Setup

Every example below runs against the same page:

```html title="index.html"
<button>Click me</button>

<script src="/foo.js"></script>
```

Pretend `foo.js` is what the TypeScript below compiles to — a small suspension of disbelief that saves rebuilding the same HTML three times.

```typescript title="foo.ts"
const button = document.querySelector("button")
```

`querySelector` can return `null`, so every handler below is attached with `?.` to keep this compiling under `strict` mode. Swap it for a real null check if a missing button should fail loudly instead.

## Click

The `click` event handler uses `MouseEvent`:

```typescript title="foo.ts"
button?.addEventListener("click", function (event: MouseEvent) {
	// do stuff
})
```

## Keydown

The `keydown` event handler uses `KeyboardEvent`:

```typescript title="foo.ts"
button?.addEventListener("keydown", function (event: KeyboardEvent) {
	// do stuff
})
```

## Focus

Focus-related handlers — `focus`, `focusin`, `blur`, and the like — use `FocusEvent`:

```typescript title="foo.ts"
button?.addEventListener("focus", function (event: FocusEvent) {
	// do stuff
})
```
