import "~/styles/globals.css"
import type { AppProps } from "next/app"
import { fraunces, jetbrains, newsreader } from "~/shared/fonts"
import { cn } from "~/shared/cn"

export default function App({ Component, pageProps }: AppProps) {
	return (
		// The --font-fraunces/--font-newsreader/--font-jetbrains custom
		// properties only exist on this div and its descendants, so the base
		// font-family has to be set here too — setting it on <body> instead
		// (an ancestor of this div) can't see those variables and silently
		// falls back to the browser default.
		<div className={cn(fraunces.variable, newsreader.variable, jetbrains.variable, "font-text")}>
			<Component {...pageProps} />
		</div>
	)
}
