import type { GetStaticProps } from "next"
import Head from "next/head"
import NavBar from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import PostCard from "~/components/PostCard"
import SiteFooter from "~/components/SiteFooter"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { getAllPosts, type Post } from "~/shared/blog"
import { formatDateShort } from "~/shared/date"
import { SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

interface BlogIndexProps {
	posts: Post[]
}

interface YearGroup {
	year: string
	posts: Post[]
}

const DESCRIPTION = "Short essays on interfaces, motion, and the decisions behind them — newest first."

function groupPostsByYear(posts: Post[]): YearGroup[] {
	const groups = new Map<string, Post[]>()

	for (const post of posts) {
		const year = post.date.slice(0, 4)
		groups.set(year, [...(groups.get(year) ?? []), post])
	}

	return [...groups.entries()].map(([year, yearPosts]) => ({ year, posts: yearPosts }))
}

export default function BlogIndex(props: BlogIndexProps) {
	const { posts } = props
	const yearGroups = groupPostsByYear(posts)

	return (
		<>
			<Head>
				<title>{`${SITE_NAME} — Writing`}</title>
				<meta name='description' content={DESCRIPTION} />
				<meta property='og:title' content={`${SITE_NAME} — Writing`} />
				<meta property='og:description' content={DESCRIPTION} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/blog`} />
			</Head>

			<NavBar items={NAV_ITEMS} current='/blog' />

			<main className='max-w-page mx-auto my-0 py-0 px-gutter-wide'>
				<section className='flex flex-col gap-6 px-gutter pt-10 pb-9 md:px-gutter-wide'>
					<div>
						<Paragraph variant={"eyebrow"} className='mt-reveal'>
							Writing
						</Paragraph>
						<Heading variant='display' size='xl' className='mt-reveal'>
							Notes from the front end
						</Heading>
					</div>
					<Paragraph variant='muted' className='max-w-prose mt-reveal'>
						{DESCRIPTION}
					</Paragraph>
				</section>

				<div className='px-gutter md:px-gutter-wide'>
					<Ornament />
				</div>

				<section className='mx-auto flex w-full max-w-page flex-col gap-9 px-gutter py-9 md:px-gutter-wide'>
					{yearGroups.map((group) => (
						<div key={group.year} className='flex flex-col gap-4'>
							<Paragraph variant='eyebrow'>{group.year}</Paragraph>
							<div className='flex flex-col'>
								{group.posts.map((post) => (
									<PostCard
										key={post.slug}
										title={post.title}
										excerpt={post.excerpt}
										date={formatDateShort(post.date)}
										readingTime={post.readingTime}
										tags={post.tags}
										href={`/blog/${post.slug}`}
									/>
								))}
							</div>
						</div>
					))}
				</section>
			</main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = () => {
	return { props: { posts: getAllPosts() } }
}
