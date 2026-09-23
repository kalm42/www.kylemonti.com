import type { GetStaticProps } from "next"
import Head from "next/head"
import Main from "~/components/ui/main"
import Arch from "~/components/Arch"
import Button from "~/components/Button"
import NavBar from "~/components/NavBar"
import PostCard from "~/components/PostCard"
import ProjectCard from "~/components/ProjectCard"
import SectionHeading from "~/components/SectionHeading"
import SiteFooter from "~/components/SiteFooter"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
import { getAllPosts, type Post } from "~/shared/blog"
import { formatDateShort } from "~/shared/date"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { PROJECTS } from "~/shared/projects"
import { SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"
import Container from "~/components/ui/container"
import Stack from "~/components/ui/stack"

const DESCRIPTION = "I build front-ends that feel unhurried. Writing, a résumé, and a workshop of small useful things."

const RECENT_POST_COUNT = 2

interface HomeProps {
	recentPosts: Post[]
}

export default function Home(props: HomeProps) {
	const { recentPosts } = props

	return (
		<>
			<Head>
				<title>{`${SITE_NAME} — Careful interfaces, quietly built`}</title>
				<meta name='description' content={DESCRIPTION} />
				<meta property='og:title' content={SITE_NAME} />
				<meta property='og:description' content={DESCRIPTION} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={SITE_URL} />
			</Head>

			<NavBar items={NAV_ITEMS} current='/' />

			<Main>
				{/* Hero */}
				<Container
					as='section'
					width='full'
					direction='responsive'
					gap='8'
					space='hero'
					className='items-start md:items-center md:justify-between'
				>
					<Stack gap='6' className='max-w-2xl items-start'>
						<p className='font-text text-eyebrow text-brass-ink uppercase mt-reveal'>Front-end engineer</p>
						<Heading variant='display' size='lg' className='mt-reveal sm:text-display-xl lg:text-display-2xl'>
							Careful interfaces, <em>quietly</em> built.
						</Heading>
						<Paragraph variant={"muted"} className='mt-reveal'>
							I build front-ends that feel unhurried. This is where I write about it and keep a workshop of small useful
							things.
						</Paragraph>
						<Stack direction='wrap' gap='4' className='mt-reveal'>
							<Button href='/blog' arrow>
								Read the writing
							</Button>
							<Button href='/workshop' variant='secondary'>
								Open the workshop
							</Button>
						</Stack>
					</Stack>
					<div className='hidden shrink-0 md:block'>
						<Arch size='hero' />
					</div>
				</Container>

				<Container as='section' gap='6' space='section'>
					<SectionHeading eyebrow='Writing' title='Latest writing' action='All essays' actionHref='/blog' />
					<Stack>
						{recentPosts.map((post) => (
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
				</Container>

				<Container as='section' gap='6' space='tail'>
					<SectionHeading
						eyebrow='Workshop'
						title='Small useful things'
						action='Open the workshop'
						actionHref='/workshop'
					>
						Side projects, each on its own address, each as small as it needs to be.
					</SectionHeading>
					<Stack direction='grid' gap='6'>
						{PROJECTS.map((project, index) => (
							<ProjectCard key={project.href} {...project} index={index + 1} />
						))}
					</Stack>
				</Container>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}

export const getStaticProps: GetStaticProps<HomeProps> = () => {
	return { props: { recentPosts: getAllPosts().slice(0, RECENT_POST_COUNT) } }
}
