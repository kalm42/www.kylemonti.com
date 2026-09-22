import "~/styles/globals.css"
import type { AppProps } from "next/app"
import { fraunces, jetbrains, newsreader } from "~/shared/fonts"
import { cn } from "~/shared/cn"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={cn(fraunces.variable, newsreader.variable, jetbrains.variable)}>
			<Component {...pageProps} />
		</div>
	)
}
