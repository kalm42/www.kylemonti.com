import type { NavItem } from "~/components/NavBar"

const NAV_ITEMS: NavItem[] = [
	{ label: "Writing", href: "/blog" },
	{ label: "Résumé", href: "/resume" },
	{ label: "Workshop", href: "/workshop" },
]

const FOOTER_ELSEWHERE: NavItem[] = [
	{ label: "GitHub", href: "https://github.com/kalm42" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/kyle-monti" },
]

export { FOOTER_ELSEWHERE, NAV_ITEMS }
