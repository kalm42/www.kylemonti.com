import { Fraunces, JetBrains_Mono, Newsreader } from "next/font/google"

/**
 * The site's three type families, exposed as CSS variables and applied
 * once, on `<html>` in `_document.tsx` — see DESIGN.md → Typography and
 * → Next.js + Tailwind integration → Fonts.
 */
const fraunces = Fraunces({
	subsets: ["latin"],
	axes: ["opsz", "SOFT", "WONK"],
	style: ["normal", "italic"],
	variable: "--font-fraunces",
})

const newsreader = Newsreader({
	subsets: ["latin"],
	axes: ["opsz"],
	style: ["normal", "italic"],
	variable: "--font-newsreader",
})

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--font-jetbrains",
})

export { fraunces, jetbrains, newsreader }
