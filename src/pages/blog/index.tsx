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
import Main from "~/components/ui/main"
import Container from "~/components/ui/container"
import Stack from "~/components/ui/stack"

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

			<Main>
				<Container as='section' width='full' gap='6' space='hero'>
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
				</Container>

				<Container as='div' width='full'>
					<Ornament />
				</Container>

				<Container as='section' gap='9' space='section'>
					{yearGroups.map((group) => (
						<Stack gap='4' key={group.year}>
							<Paragraph variant='eyebrow'>{group.year}</Paragraph>
							<Stack>
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
							</Stack>
						</Stack>
					))}
				</Container>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = () => {
	return { props: { posts: getAllPosts() } }
}
