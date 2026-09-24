---
title: Migrating from CRA to Next.js
date: 2020-06-19
excerpt: How a broken Facebook link preview turned into a full migration off Create React App — swapping the build scripts, replacing react-router-dom with file-based routing, and fixing the actual SEO problem with next/head.
tags: CRA, Next.js
---

I launched a side project, then went to share the link on Facebook — and the preview read "React App," not the custom title and description I'd carefully written with `react-helmet`. Turns out I did need server-side rendering after all. Time to move to Next.js.

Rebuilding the whole thing in a fresh repo and moving components over one at a time wasn't appealing — and it's also the top advice Google gives for going from Create React App to Next.js. So this is a self-guided migration instead: a record of what actually worked, in the order I found it.

## Start with the scripts

Next.js expects `package.json` scripts like this:

```json title="package.json (Next.js)"
"scripts": {
	"dev": "next",
	"build": "next build",
	"start": "next start"
}
```

An ejected CRA project looks like this instead:

```json title="package.json (ejected CRA)"
"scripts": {
	"start": "node scripts/start.js",
	"build": "node scripts/build.js",
	"test": "node scripts/test.js",
	"clean": "rm -rf node_modules"
}
```

The ejected `start` script runs `webpack-dev-server` under the hood. Swapping it directly for `next` gets Next's own 404 page back — a sign that Next doesn't yet know what to render as the root.

Adding an `index.ts` that imports the old root component and re-exports it as the default gets past that 404, but the app still won't compile: `react-router-dom` is next in the way, since Next.js has its own file-based router.

```zsh
yarn remove react-router-dom
```

## Replace the router

Every `<Route>` becomes a file under `pages/`, named for its path instead of declared in a router config:

```jsx title="pages/about.js"
export default function About() {
	return <div>{/* the old About component's contents */}</div>
}
```

A route with a param, like `/blog/:slug`, becomes a file with brackets in its name:

```jsx title="pages/blog/[slug].js"
import { useRouter } from "next/router"

export default function BlogPost() {
	const router = useRouter()
	const { slug } = router.query

	return <div>{slug}</div>
}
```

`useRouter` covers what `useHistory`, `useParams`, and `useLocation` did separately: `router.query` for params, `router.pathname` for the current path, `router.push(path)` in place of `history.push`. Links follow the same swap:

```jsx
import Link from "next/link"

function AboutLink() {
	return <Link href="/about">About</Link>
}
```

With actual pages in `pages/`, the `index.ts` re-export trick from the previous step can go — each route now lives in its own file, the way Next.js expects.

## Fix the actual problem

That whole detour started because Facebook's crawler doesn't execute JavaScript, so it never saw the tags `react-helmet` was setting client-side — it only ever saw the bare `<title>React App</title>` from the original HTML. Next.js replaces `react-helmet` with `next/head`, which renders as part of the actual server response instead:

```jsx title="pages/about.js"
import Head from "next/head"

export default function About() {
	return (
		<>
			<Head>
				<title>About</title>
				<meta name="description" content="..." />
			</Head>
			<div>{/* the old About component's contents */}</div>
		</>
	)
}
```

Every page that used `react-helmet` gets the same treatment. Once that's done, the thing that actually started all of this — the broken link preview — is fixed.

## Clean up

Anything that used to wrap the whole app in the old root component — a theme provider, global styles, global context — moves to `pages/_app.js`, the one file Next.js always renders around every page. `public/index.html` goes too; Next generates the document itself, and only needs a `pages/_document.js` if the `<html>` shell itself needs customizing, like setting `lang` or adding a font link.

```zsh
yarn remove react-helmet
```

That's the whole migration: swap the build scripts, let file-based routing replace `react-router-dom`, and let `next/head` replace `react-helmet` so the bug that started this actually gets fixed.
