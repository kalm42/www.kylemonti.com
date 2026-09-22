---
title: Designing a calmer date picker
date: 2026-03-14
excerpt: A short note on why I stopped memoizing everything and started measuring first.
tags: React, Design
---

A date picker looks like a small component until you actually build one. Two calendars, keyboard navigation, a range that can be dragged from either end, a mobile layout that has to collapse into something thumbable. It is easy to end up with a component that recalculates on every keystroke and animates on every render, and calls that "polish."

I spent a week doing exactly that. `useMemo` around the month grid. `useCallback` around every handler. A `React.memo` on each day cell, because surely forty-two cells re-rendering was the problem. The picker still felt sluggish, and I could not tell you why, because I had never measured it. I had only assumed.

## Measure before you reach for memoization

So I opened the profiler instead of my editor. The month grid was not the problem — it rendered in under a millisecond. The actual cost was a `getBoundingClientRect` call inside the range-drag handler, run on every `pointermove` event, forcing a synchronous layout each time. Forty-two memoized cells were quietly guarding against a threat that did not exist, while the real one ran fifty times a second.

```ts
function usePointerRange(onChange: (start: Date, end: Date) => void) {
	const frame = useRef<number>()

	return function handlePointerMove(event: PointerEvent) {
		if (frame.current !== undefined) {
			return
		}
		frame.current = requestAnimationFrame(() => {
			frame.current = undefined
			const rect = trackRect.current ?? measureTrack()
			onChange(dateFromOffset(event.clientX, rect))
		})
	}
}
```

Batching the read behind a single `requestAnimationFrame` call removed the layout thrash entirely. No memoization required. The month grid's `useMemo` calls stayed, because they were genuinely cheap insurance against a parent re-render, but they were never the fix.

> [!TIP] Profile the interaction, not the render
> A slow-feeling component is usually a slow event handler, not a slow render. Open the performance panel before reaching for `memo`.

## What actually made it feel calm

Once the layout thrash was gone, three smaller things did the rest of the work:

- Hover and drag states use `transform` and `opacity` only, never a layout property, so the compositor can carry them without asking the main thread.
- The range fill animates in on `duration-base` with `ease-glide` — quick to start, slow to settle, so it never feels like it is fighting your cursor.
- Keyboard focus moves with `scrollIntoView({ block: "nearest" })` instead of a manual scroll calculation, which turned out to already respect `prefers-reduced-motion` for free.

None of that shows up in a profiler flame graph. It shows up when you actually use the thing.

---

The lesson generalizes past date pickers: reach for `useMemo` and friends only after you have watched the actual cost happen, not the cost you imagine happening. Measuring first is slower on day one. It is the only thing that reliably works on day five.
