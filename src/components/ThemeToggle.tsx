import { useCallback, useEffect, useState } from "react"
import { cn } from "~/shared/cn"
import { THEME_STORAGE_KEY, type Theme } from "~/shared/theme"
import Icon from "~/components/Icon"

interface ThemeToggleProps {
	theme?: Theme
	onChange?: (next: Theme) => void
}

function readCurrentTheme(): Theme {
	return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"
}

/**
 * Swaps sun and moon and cross-fades the whole page between themes. Place
 * once, at the far right of the header. Persists the choice to
 * `localStorage`; a `data-theme` init script (run before first paint,
 * outside this component) keeps a dark visitor from seeing an ivory flash.
 *
 * The initial render always assumes `light` to match server-rendered
 * markup — the server can't know `data-theme` — then a mount effect syncs
 * the real value, so hydration never mismatches.
 *
 * @example <ThemeToggle />
 */
function ThemeToggle(props: ThemeToggleProps) {
	const { theme: controlledTheme, onChange } = props
	const [uncontrolledTheme, setUncontrolledTheme] = useState<Theme>("light")
	const theme = controlledTheme ?? uncontrolledTheme

	// Sync from the DOM attribute the inline init script sets before paint —
	// see the note above on why the initial render can't read it directly.
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setUncontrolledTheme(readCurrentTheme())
	}, [])

	const handleToggle = useCallback(() => {
		const next: Theme = theme === "dark" ? "light" : "dark"
		const root = document.documentElement
		root.classList.add("mt-theme-fade")
		root.setAttribute("data-theme", next)
		window.setTimeout(() => {
			root.classList.remove("mt-theme-fade")
		}, 600)
		try {
			localStorage.setItem(THEME_STORAGE_KEY, next)
		} catch {
			// Storage may be unavailable (private mode); the theme still applies for this visit.
		}
		setUncontrolledTheme(next)
		onChange?.(next)
	}, [theme, onChange])

	return (
		<button
			type='button'
			onClick={handleToggle}
			aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
			className='group relative grid h-[2.5rem] w-[2.5rem] shrink-0 place-items-center justify-center rounded-pill border border-border-strong text-ink transition-all duration-base hover:bg-paper-raised hover:scale-93'
		>
			<span
				className={cn(
					"absolute transition-all duration-base ease-settle group-hover:rotate-18 group-hover:scale-107",
					theme === "dark" ? "opacity-0" : "opacity-100",
				)}
			>
				<Icon name='sun' size={18} />
			</span>
			<span
				className={cn(
					"absolute transition-all duration-base ease-settle group-hover:rotate-18 group-hover:scale-107",
					theme === "dark" ? "opacity-100" : "opacity-0",
				)}
			>
				<Icon name='moon' size={18} />
			</span>
		</button>
	)
}

export default ThemeToggle
export type { ThemeToggleProps }
