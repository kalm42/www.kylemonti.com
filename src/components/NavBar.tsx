import Link from "next/link"
import { useLayoutEffect, useEffect, useRef, useState, type CSSProperties } from "react"
import { cn } from "~/shared/cn"
import Icon from "~/components/Icon"
import ThemeToggle from "~/components/ThemeToggle"
import Wordmark from "~/components/Wordmark"

interface NavItem {
	label: string
	href: string
}

interface NavBarProps {
	items: NavItem[]
	current?: string
	sticky?: boolean
	onNavigate?: (href: string) => void
	homeHref?: string
}

interface IndicatorRect {
	left: number
	width: number
}

function useScrolled() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 4)
		}
		handleScroll()
		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return scrolled
}

/**
 * The header: wordmark left, links centre, theme toggle right, with a
 * single mark that slides between links (`brass` on hover, `brand` at the
 * current page). Keep `items` to three: Writing, Résumé, Workshop.
 * Collapses to a menu button under 640px.
 *
 * @example <NavBar items={NAV_ITEMS} current="/" />
 */
function NavBar(props: NavBarProps) {
	const { items, current, sticky = true, onNavigate, homeHref = "/" } = props
	const linkRefs = useRef(new Map<string, HTMLAnchorElement>())
	const [hovered, setHovered] = useState<string | undefined>(undefined)
	const [indicator, setIndicator] = useState<IndicatorRect | undefined>(undefined)
	const [menuOpen, setMenuOpen] = useState(false)
	const scrolled = useScrolled()
	const activeHref = hovered ?? current

	// Sliding indicator position can only be known once the link elements are
	// laid out, so this reads the DOM and can't be computed during render.
	/* eslint-disable react-hooks/set-state-in-effect */
	useLayoutEffect(() => {
		if (activeHref === undefined) {
			setIndicator(undefined)
			return
		}
		const link = linkRefs.current.get(activeHref)
		const container = link?.parentElement
		if (link === undefined || container === null || container === undefined) {
			return
		}
		const linkRect = link.getBoundingClientRect()
		const containerRect = container.getBoundingClientRect()
		setIndicator({ left: linkRect.left - containerRect.left, width: linkRect.width })
	}, [activeHref, items])
	/* eslint-enable react-hooks/set-state-in-effect */

	const handleNavigate = (href: string) => {
		onNavigate?.(href)
		setMenuOpen(false)
	}

	const clearHovered = () => {
		setHovered(undefined)
	}

	const toggleMenu = () => {
		setMenuOpen((open) => !open)
	}

	return (
		<header
			data-scrolled={sticky && scrolled}
			className={cn(
				sticky && "top-0 sticky data-[scrolled=true]:bg-paper/84 data-[scrolled=true]:backdrop-saturate-130",
				"flex items-center z-40 w-full justify-center px-gutter md:px-gutter-wide",
				sticky && "border-b border-transparent transition-colors duration-base",
				sticky && "data-[scrolled=true]:border-hairline data-[scrolled=true]:backdrop-blur-sm",
			)}
		>
			<div className='flex w-full max-w-page items-center justify-between gap-6 h-header-height'>
				<Wordmark size='md' href={homeHref} />

				<nav className='relative hidden items-center gap-4 sm:flex' onMouseLeave={clearHovered}>
					{items.map((item) => {
						const isCurrent = item.href === current

						const setHoveredToCurrent = () => {
							setHovered(item.href)
						}

						const onNavigate = () => {
							handleNavigate(item.href)
						}

						return (
							<Link
								key={item.href}
								href={item.href}
								ref={(el) => {
									if (el === null) {
										linkRefs.current.delete(item.href)
									} else {
										linkRefs.current.set(item.href, el)
									}
								}}
								onMouseEnter={setHoveredToCurrent}
								onClick={onNavigate}
								className={cn("block py-1.75 px-3.5 font-text text-ui transition-colors duration-fast", {
									"text-ink": isCurrent,
									"text-ink-muted hover:text-ink": !isCurrent,
								})}
							>
								{item.label}
							</Link>
						)
					})}
					{indicator && (
						<span
							className={cn(
								"pointer-events-none absolute -bottom-0.5 h-0.5 rounded-pill transition-all duration-slow ease-settle",
								hovered && hovered !== current ? "bg-brass" : "bg-brand",
							)}
							style={{ left: indicator.left, width: indicator.width }}
						/>
					)}
				</nav>

				<div className='flex items-center gap-3'>
					<div className='hidden sm:flex'>
						<ThemeToggle />
					</div>
					<button
						type='button'
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						aria-expanded={menuOpen}
						onClick={toggleMenu}
						className='flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-pill text-ink sm:hidden'
					>
						<Icon name={menuOpen ? "x" : "menu"} size={20} />
					</button>
				</div>
			</div>

			{menuOpen && (
				<div className='absolute top-header-height left-0 flex w-full flex-col gap-1 border-b border-hairline bg-paper px-gutter py-4 sm:hidden'>
					{items.map((item, index) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => {
								handleNavigate(item.href)
							}}
							style={{ "--i": index } as CSSProperties}
							className='mt-reveal rounded-md px-3 py-3 font-text text-ui text-ink hover:bg-paper-raised'
						>
							{item.label}
						</Link>
					))}
					<div className='px-3 pt-2'>
						<ThemeToggle />
					</div>
				</div>
			)}
		</header>
	)
}

export default NavBar
export type { NavBarProps, NavItem }
