import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import type { ReactNode } from "react"
import Icon, { type IconName } from "~/components/Icon"
import { cn } from "~/shared/cn"

const buttonStyles = cva(
	[
		"group relative inline-flex items-center justify-center gap-2 rounded-md font-text",
		"transition-[transform,box-shadow,background-color,border-color,color] duration-base ease-glide",
		"active:scale-press active:duration-instant py-0 disabled:pointer-events-none disabled:opacity-50",
	],
	{
		variants: {
			variant: {
				primary: [
					"whitespace-nowrap bg-brand text-on-brand shadow-sm hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md",
					"after:pointer-events-none after:absolute after:inset-1 after:rounded-sm after:border after:border-on-brand/0",
					"after:transition-colors after:duration-base after:ease-glide hover:after:border-on-brand/30",
				],
				secondary:
					"whitespace-nowrap bg-transparent border border-border-strong text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-paper-raised hover:shadow-sm",
				quiet: "text-ink hover:text-brand",
			},
			size: {
				sm: "text-ui-sm",
				md: "text-ui",
				lg: "text-ui-lg",
				// No font-size/weight/tracking of its own — for a quiet link used
				// inline within running text, which must inherit that text's size.
				inherit: "",
			},
			padding: {
				sm: "h-[2.5rem] px-4",
				md: "h-12 px-5",
				lg: "h-14 px-6",
				none: "px-0",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
			padding: "md",
		},
	},
)

type ButtonVariants = VariantProps<typeof buttonStyles>

interface ButtonSharedProps {
	variant?: ButtonVariants["variant"]
	size?: ButtonVariants["size"]
	arrow?: boolean
	icon?: IconName
	children: ReactNode
	padding?: ButtonVariants["padding"]
}

type ButtonAsLinkProps = ButtonSharedProps & {
	href: string
	external?: boolean
	type?: undefined
	disabled?: undefined
}

type ButtonAsButtonProps = ButtonSharedProps & {
	href?: undefined
	external?: undefined
	type?: "button" | "submit" | "reset"
	disabled?: boolean
	onClick?: () => void
}

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps
interface ButtonContentProps {
	icon?: IconName
	children: ReactNode
	arrow?: boolean
	isQuiet?: boolean
	arrowName: IconName
}

const ButtonContent = (props: ButtonContentProps) => {
	const { icon, children, arrow, isQuiet, arrowName } = props
	return (
		<>
			{icon !== undefined && <Icon name={icon} size={18} />}
			<span className={cn({ "mt-underline pb-1": isQuiet })}>{children}</span>
			{arrow && (
				<span
					className={cn("inline-flex transition-transform duration-base ease-glide group-hover:translate-x-1", {
						"-translate-y-0.75": isQuiet,
						"group-hover:-translate-y-1.5": isQuiet && arrowName === "arrow-up-right",
					})}
				>
					<Icon name={arrowName} size={18} />
				</span>
			)}
		</>
	)
}
/**
 * The site's call to action: verb-first, sentence case. One `primary` per
 * view; `secondary` pairs alongside it; `quiet` is an underlined-on-hover
 * link-like action — use it for standalone actions (nav-style link lists,
 * a section's "see all") and, with `size="inherit" padding="none"`, for a
 * link inline within running text. Renders an `<a>`/`Link` when `href` is
 * given, a `<button>` otherwise.
 *
 * @example <Button href="/blog" arrow>Read the writing</Button>
 * @example <Button variant="secondary" icon="download">Download PDF</Button>
 * @example <Button href={url} variant="quiet" size="inherit" padding="none">an inline link</Button>
 */
function Button(props: ButtonProps) {
	const { variant, size, arrow = false, icon, padding, children } = props
	const isQuiet = variant === "quiet"
	const classes = buttonStyles({ variant, size, padding })
	const arrowName: IconName = props.href && props.external ? "arrow-up-right" : "arrow-right"

	const content = (
		<ButtonContent arrow={arrow} isQuiet={isQuiet} arrowName={arrowName} {...(icon !== undefined && { icon })}>
			{children}
		</ButtonContent>
	)

	if (props.href !== undefined) {
		const { href, external = false } = props

		if (external) {
			return (
				<a href={href} target='_blank' rel='noopener noreferrer' className={classes}>
					{content}
				</a>
			)
		}

		return (
			<Link href={href} className={classes}>
				{content}
			</Link>
		)
	}

	const { type = "button", disabled, onClick } = props

	return (
		<button type={type} disabled={disabled} onClick={onClick} className={classes}>
			{content}
		</button>
	)
}

export default Button
export type { ButtonProps }
