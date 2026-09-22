import { createHighlighter } from "@tanstack/highlight/core"
import { css } from "@tanstack/highlight/languages/css"
import { diff } from "@tanstack/highlight/languages/diff"
import { html } from "@tanstack/highlight/languages/html"
import { js } from "@tanstack/highlight/languages/js"
import { json } from "@tanstack/highlight/languages/json"
import { jsx } from "@tanstack/highlight/languages/jsx"
import { markdown } from "@tanstack/highlight/languages/markdown"
import { shell } from "@tanstack/highlight/languages/shell"
import { ts } from "@tanstack/highlight/languages/ts"
import { tsx } from "@tanstack/highlight/languages/tsx"
import { yaml } from "@tanstack/highlight/languages/yaml"

/**
 * One highlighter instance for the whole site, registered only with the
 * languages this blog actually uses — add a language import here, and
 * only here, when a post needs one that isn't listed. An unregistered or
 * missing `lang` falls back to unhighlighted plaintext rather than
 * throwing.
 */
const highlighter = createHighlighter({
	languages: [ts, tsx, js, jsx, json, css, html, shell, markdown, yaml, diff],
})

export { highlighter }
