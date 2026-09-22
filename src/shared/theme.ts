type Theme = "light" | "dark"

const THEME_STORAGE_KEY = "mt-theme"

/**
 * Inlined into `_document.tsx` and run before first paint, so a dark
 * visitor never sees an ivory flash. Kept as a single expression string
 * (rather than a template literal referencing the constants above) since
 * it is serialized into the document unmodified.
 */
const THEME_INIT_SCRIPT = `(function () {
	try {
		var stored = localStorage.getItem("${THEME_STORAGE_KEY}")
		var theme = stored === "light" || stored === "dark" ? stored : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		document.documentElement.setAttribute("data-theme", theme)
	} catch (e) {}
})()`

export { THEME_INIT_SCRIPT, THEME_STORAGE_KEY }
export type { Theme }
