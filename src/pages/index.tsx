import type { GetStaticProps } from "next"
import Head from "next/head"
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

			<main className='max-w-page mx-auto my-0 py-0 px-gutter-wide'>
				{/* Hero */}
				<section className='flex w-full flex-col items-start gap-8 px-gutter pt-10 pb-9 md:flex-row md:items-center md:justify-between md:px-gutter-wide'>
					<div className='flex max-w-2xl flex-col items-start gap-6'>
						<p className='font-text text-eyebrow text-brass-ink uppercase mt-reveal'>Front-end engineer</p>
						<Heading variant='display' size='lg' className='mt-reveal sm:text-display-xl lg:text-display-2xl'>
							Careful interfaces, <em>quietly</em> built.
						</Heading>
						<Paragraph variant={"muted"} className='mt-reveal'>
							I build front-ends that feel unhurried. This is where I write about it and keep a workshop of small useful
							things.
						</Paragraph>
						<div className='mt-reveal flex flex-wrap gap-4'>
							<Button href='/blog' arrow>
								Read the writing
							</Button>
							<Button href='/workshop' variant='secondary'>
								Open the workshop
							</Button>
						</div>
					</div>
					<div className='hidden shrink-0 md:block'>
						<Arch size='hero' />
					</div>
				</section>

				<section className='mx-auto flex w-full max-w-page flex-col gap-6 px-gutter py-9 md:px-gutter-wide'>
					<SectionHeading eyebrow='Writing' title='Latest writing' action='All essays' actionHref='/blog' />
					<div className='flex flex-col'>
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
					</div>
				</section>

				<section className='mx-auto flex w-full max-w-page flex-col gap-6 px-gutter pb-9 md:px-gutter-wide'>
					<SectionHeading
						eyebrow='Workshop'
						title='Small useful things'
						action='Open the workshop'
						actionHref='/workshop'
					>
						Side projects, each on its own address, each as small as it needs to be.
					</SectionHeading>
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{PROJECTS.map((project, index) => (
							<ProjectCard key={project.href} {...project} index={index + 1} />
						))}
					</div>
				</section>
			</main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}

export const getStaticProps: GetStaticProps<HomeProps> = () => {
	return { props: { recentPosts: getAllPosts().slice(0, RECENT_POST_COUNT) } }
}
