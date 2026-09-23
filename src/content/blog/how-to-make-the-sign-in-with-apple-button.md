---
title: How to make the Sign in with Apple button
date: 2022-02-26
excerpt: Apple doesn't make composing a compliant Sign in with Apple button obvious. A working version built with Next.js 12 and Tailwind 3, self-hosting Apple's San Francisco font along the way.
tags: Next.js, Apple, Custom fonts
---

Start with Apple's own [Human Interface Guidelines for Sign in with Apple buttons](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/buttons/) before building a custom one.

## Get the button assets

Grab the Apple logo from [Apple's design resources page](https://developer.apple.com/design/resources/) — the logos sit about halfway down, just above the Fonts section as of this writing, though that may have moved by the time you look. Download the PNG, PDF, and SVG bundle, open the DMG, and pull out the SVG files.

You'd expect that same page to include Apple's San Francisco font for the web, since it's clearly the font they want used here, but it doesn't. I eventually found [a link to it on Stack Overflow](https://stackoverflow.com/a/36412339/1804634) and downloaded the file rather than trust that URL to keep working.

## Self-host the San Francisco font

With the font file and the SVGs in hand, it's time to assemble the button. [This Next.js discussion on self-hosting fonts](https://github.com/vercel/next.js/discussions/25389) covers the best approach.

```css title="global.css"
@font-face {
	font-family: "SanFrancisco"; /* no space, so Tailwind is happy */
	font-weight: 400;
	src: url("/apple/sanfranciscodisplay-regular-webfont.woff");
}
```

I put the font file in `public/apple`. I'm not expecting to host many custom font files — if you're hosting a lot of them, a different approach is worth considering.

## Build the component

With the font in place, the app can use San Francisco. Next is a component to render the button itself. I like keeping each component in its own folder, so every file it needs lives in one place — when the component goes away, so does everything related to it.

```tsx title="component/SignInWithApple/SignInWithApple.tsx"
import React from "react"
import Head from "next/head"
import Link from "next/link"
import AppleIconLarge from "./siwa-left-aligned-white-large.svg"
import AppleIconMedium from "./siwa-left-aligned-white-medium.svg"
import AppleIconSmall from "./siwa-left-aligned-white-small.svg"

interface SignInWithAppleProps {
	signinUrl: string
}

const SignInWithApple = (props: SignInWithAppleProps) => {
	const { signinUrl } = props
	return (
		<>
			<Head>
				<link
					rel="preload"
					href="/apple/sanfranciscodisplay-regular-webfont.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>
			</Head>
			{/* mobile - default */}
			<div className="block md:hidden">
				<Link href={signinUrl}>
					<a className="bg-black text-white block w-max rounded-full font-[SanFrancisco] m-auto">
						<span className="flex items-center h-[44px] text-[19px] px-12">
							<AppleIconSmall className="inline" />
							Sign in with Apple
						</span>
					</a>
				</Link>
			</div>
			{/* tablet */}
			<div className="hidden md:block xl:hidden">
				<Link href={signinUrl}>
					<a className="bg-black text-white block w-max rounded-full font-[SanFrancisco] m-auto">
						<span className="flex items-center h-[44px] text-[19px] px-12">
							<AppleIconMedium className="inline" />
							Sign in with Apple
						</span>
					</a>
				</Link>
			</div>
			{/* Desktop */}
			<div className="hidden xl:block">
				<Link href={signinUrl}>
					<a className="bg-black text-white block w-max rounded-full font-[SanFrancisco] m-auto">
						<span className="flex items-center h-[56px] text-[24px] px-12">
							<AppleIconLarge className="inline" />
							Sign in with Apple
						</span>
					</a>
				</Link>
			</div>
		</>
	)
}

export default SignInWithApple
```

Nothing unusual there — just the specifics, for anyone matching sizes to their own breakpoints.

```ts title="component/SignInWithApple/index.ts"
import SignInWithApple from "./SignInWithApple"

export default SignInWithApple
```

That last file just re-exports the component, so the rest of the app can import it from the folder directly instead of naming the file inside it.
