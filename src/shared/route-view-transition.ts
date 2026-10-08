import Router, { type NextRouter } from "next/router"
import { useEffect } from "react"

type RouterNavigate = NextRouter["push"]

function ignoreSkippedTransition() {
	// A skipped transition (unsupported names, 4s timeout, hidden tab) is
	// cosmetic — the navigation itself still settles through `navigate`.
}

function canAnimate() {
	return (
		typeof document.startViewTransition === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
	)
}

/**
 * Runs a router navigation inside `document.startViewTransition`. The
 * navigation starts from the update callback, which the browser only calls
 * after it has captured the old page — starting it from `routeChangeStart`
 * instead races React's commit on prefetched routes and snapshots the new
 * page as the "old" one, so nothing animates.
 *
 * @example router.push = withViewTransition(router.push.bind(router))
 */
function withViewTransition(navigate: RouterNavigate): RouterNavigate {
	return (url, as, options) => {
		if (options?.shallow === true || !canAnimate()) {
			return navigate(url, as, options)
		}

		return new Promise((resolve, reject) => {
			const transition = document.startViewTransition(() => navigate(url, as, options).then(resolve, reject))
			transition.ready.catch(ignoreSkippedTransition)
			transition.finished.catch(ignoreSkippedTransition)
		})
	}
}

/**
 * Animates every `push`/`replace` navigation (including `<Link>`) with the
 * View Transitions API. React's `<ViewTransition>` is App Router-only, so
 * this Pages Router app wraps the singleton router instead — `useRouter()`
 * and `<Link>` both delegate to it. Back/forward (popstate) is left alone:
 * mobile browsers already animate swipe-back, and a second animation on top
 * flashes. Call once, from `_app.tsx`.
 *
 * @example useRouteViewTransition()
 */
function useRouteViewTransition() {
	useEffect(() => {
		const router = Router.router
		if (router === null) {
			return
		}

		const push = router.push.bind(router)
		const replace = router.replace.bind(router)
		router.push = withViewTransition(push)
		router.replace = withViewTransition(replace)

		return () => {
			router.push = push
			router.replace = replace
		}
	}, [])
}

export default useRouteViewTransition
