import Link from "next/link"
import Icon from "~/components/Icon"
import PostMeta from "./PostMeta"
import TagList from "./TagList"
import Heading from "./ui/heading"
import Paragraph from "./ui/paragraph"
import Stack from "./ui/stack"

type PostCardVariant = "row" | "card"

interface PostCardProps {
	title: string
	excerpt: string
	date: string
	readingTime: string
	tags?: string[]
	href: string
	variant?: PostCardVariant
}

/**
 * A blog post entry: a `row` for lists, a `card` for grids and "more
 * reading". The whole card is one link — tags render as plain pills, never
 * nested links. Shows at most three tags.
 *
 * @example <PostCard title="Designing a calmer date picker" excerpt="..." date="14 Mar 2026" readingTime="6 min read" href="/blog/calmer-date-picker" />
 */
function PostCard(props: PostCardProps) {
	const { title, excerpt, date, readingTime, tags = [], href, variant = "row" } = props

	if (variant === "card") {
		return (
			<article>
				<Link
					href={href}
					className='group flex flex-col gap-4 rounded-lg border border-hairline bg-paper-raised p-6 shadow-sm transition-all duration-base ease-glide hover:-translate-y-1 hover:border-brass hover:shadow-md'
				>
					<PostMeta date={date} readingTime={readingTime} />
					<Heading size='lg' className='mt-underline w-fit'>
						{title}
					</Heading>
					<Paragraph variant='excerpt'>{excerpt}</Paragraph>
					<TagList tags={tags} limit />
				</Link>
			</article>
		)
	}

	return (
		<article className='group border-y border-hairline hover:border-transparent -mb-px -mx-5 py-2 md:py-4'>
			<Link
				href={href}
				className='p-5 flex-col md:flex-row transition-colors duration-base rounded-lg hover:bg-paper-raised md:grid md:grid-cols-[10.5rem_1fr_2rem] flex items-start justify-between gap-6'
			>
				<PostMeta date={date} readingTime={readingTime} />
				<Stack gap='2' className='min-w-0'>
					<Heading size='lg' className='mt-underline w-fit'>
						{title}
					</Heading>
					<Paragraph variant='excerpt'>{excerpt}</Paragraph>
					<TagList tags={tags} limit />
				</Stack>
				<span className='flex self-end md:self-auto shrink-0 translate-y-3 -translate-x-2.5 items-center text-brand opacity-0 transition-all duration-slow ease-glide group-hover:translate-x-0 group-hover:opacity-100'>
					<Icon name='arrow-right' size={18} />
				</span>
			</Link>
		</article>
	)
}

export default PostCard
export type { PostCardProps, PostCardVariant }
