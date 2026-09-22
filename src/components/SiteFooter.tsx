import type { NavItem } from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import Wordmark from "~/components/Wordmark"
import Paragraph from "./ui/paragraph"
import Heading from "./ui/heading"
import Button from "./Button"

interface SiteFooterProps {
	nav: NavItem[]
	elsewhere: NavItem[]
	year: number
}

interface FooterColumnProps {
	title: string
	items: NavItem[]
	external?: boolean
}

function FooterColumn(props: FooterColumnProps) {
	const { title, items, external = false } = props

	return (
		<div className='flex flex-col gap-3'>
			<Heading as='h4' size='md' variant='eyebrow' tone='brass-ink'>
				{title}
			</Heading>
			<ul className='flex flex-col gap-2'>
				{items.map((item) => (
					<li key={item.href}>
						<Button href={item.href} external={external} arrow={external} padding='none' variant='quiet'>
							{item.label}
						</Button>
					</li>
				))}
			</ul>
		</div>
	)
}

/**
 * The colophon footer: ornament, wordmark with a one-line tagline, two
 * link columns, fine print naming the fonts. No newsletters, social feeds,
 * or a fourth column.
 *
 * @example <SiteFooter nav={NAV_ITEMS} elsewhere={ELSEWHERE_ITEMS} year={2026} />
 */
function SiteFooter(props: SiteFooterProps) {
	const { nav, elsewhere, year } = props

	return (
		<footer className='w-full px-gutter pb-8 md:px-gutter-wide'>
			<div className='mx-auto flex w-full max-w-page flex-col gap-8'>
				<Ornament />
				<div className='grid grid-cols-[1.6fr_1fr_1fr] gap-7 pt-7 pb-6'>
					<div>
						<Wordmark size='lg' href='/' />
						<Paragraph variant='muted' className='mt-3'>
							Careful interfaces, quietly built.
						</Paragraph>
					</div>
					<FooterColumn title='Site' items={nav} />
					<FooterColumn title='Elsewhere' items={elsewhere} external={true} />
				</div>
				<p className='font-text text-caption text-ink-subtle'>
					© {year} Kyle Monti. Set in Fraunces, Newsreader and JetBrains Mono.
				</p>
			</div>
		</footer>
	)
}

export default SiteFooter
export type { SiteFooterProps }
