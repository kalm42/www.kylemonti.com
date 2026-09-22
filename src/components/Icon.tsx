import { ArrowRight, ArrowUpRight, Check, Copy, Download, Mail, Menu, Moon, Rss, Sun, X } from "lucide-react"

const ICONS = {
	"arrow-right": ArrowRight,
	"arrow-up-right": ArrowUpRight,
	sun: Sun,
	moon: Moon,
	copy: Copy,
	check: Check,
	rss: Rss,
	mail: Mail,
	download: Download,
	menu: Menu,
	x: X,
} as const

type IconName = keyof typeof ICONS

interface IconProps {
	name: IconName
	size?: number
	title?: string
}

/**
 * The site's only allowed icons — see DESIGN.md → Iconography. Lucide,
 * 1.5px stroke, currentColor. Pair with a visible word unless used alone
 * (a toggle or copy button); pass `title` in that case for an accessible
 * name.
 *
 * @example <Icon name="arrow-right" />
 * @example <Icon name="sun" size={20} title="Switch to light theme" />
 */
function Icon(props: IconProps) {
	const { name, size = 18, title } = props
	const LucideIcon = ICONS[name]

	return (
		<LucideIcon
			size={size}
			strokeWidth={1.5}
			aria-hidden={title === undefined}
			role={title === undefined ? undefined : "img"}
			aria-label={title}
		/>
	)
}

export default Icon
export type { IconName, IconProps }
