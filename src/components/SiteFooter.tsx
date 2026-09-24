import type { NavItem } from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import Wordmark from "~/components/Wordmark"
import Paragraph from "./ui/paragraph"
import Heading from "./ui/heading"
import Button from "./Button"
import Icon from "./Icon"
import { cn } from "~/shared/cn"
import Container from "./ui/container"
import Stack from "./ui/stack"

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
		<div className={cn("inline-block flex-1 md:flex md:flex-col gap-3", { "items-end text-end": external })}>
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
		<footer className='w-full px-gutter pb-8 md:px-gutter-wide print:hidden'>
			<Container width='page' gutter={false} gap='4' className='md:gap-8'>
				<Ornament />
				<div className='flex flex-wrap md:grid md:grid-cols-[1.6fr_1fr_1fr] gap-7 pt-7 pb-6'>
					<div>
						<Wordmark size='lg' href='/' />
						<Paragraph variant='muted' className='mt-3'>
							Careful interfaces, quietly built.
						</Paragraph>
					</div>
					<FooterColumn title='Site' items={nav} />
					<FooterColumn title='Elsewhere' items={elsewhere} external={true} />
				</div>
				<Stack direction='wrap' gap='4' className='items-center justify-between'>
					<p className='font-text text-caption text-ink-subtle'>
						© {year} Kyle Monti. Set in Fraunces, Newsreader and JetBrains Mono.
					</p>
					<a
						href='/rss.xml'
						className='inline-flex items-center gap-2 font-text text-caption text-ink-subtle transition-colors duration-fast hover:text-ink'
					>
						<Icon name='rss' size={16} />
						RSS
					</a>
				</Stack>
			</Container>
		</footer>
	)
}

export default SiteFooter
export type { SiteFooterProps }
