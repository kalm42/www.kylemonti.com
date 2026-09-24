import type { MarkdownDocument } from "@tanstack/markdown"
import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"

import Main from "~/components/ui/main"
import ArticleBody from "~/components/ArticleBody"
import NavBar from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import PostCard from "~/components/PostCard"
import SiteFooter from "~/components/SiteFooter"
import TagList from "~/components/TagList"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
import Container from "~/components/ui/container"

import { getAllPosts, getPostBySlug, getPostSlugs, type Post } from "~/shared/blog"
import { formatDateLong } from "~/shared/date"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

interface AdjacentPost {
	title: string
	excerpt: string
	date: string
	readingTime: string
	tags: string[]
	href: string
}

interface BlogPostProps {
	post: Post
	document: MarkdownDocument
	previous?: AdjacentPost
	next?: AdjacentPost
}

function toAdjacentPost(post: Post): AdjacentPost {
	return {
		title: post.title,
		excerpt: post.excerpt,
		date: formatDateLong(post.date),
		readingTime: post.readingTime,
		tags: post.tags,
		href: `/blog/${post.slug}`,
	}
}

export default function BlogPost(props: BlogPostProps) {
	const { post, document, previous, next } = props

	return (
		<>
			<Head>
				<title>{`${SITE_NAME} — ${post.title}`}</title>
				<meta name='description' content={post.excerpt} />
				<meta property='og:title' content={post.title} />
				<meta property='og:description' content={post.excerpt} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/blog/${post.slug}`} />
			</Head>

			<NavBar items={NAV_ITEMS} current='/blog' />

			<Main>
				<Container as='article' width='prose' gap='4' space='article'>
					<Heading size='2xl' className='mt-reveal'>
						{post.title}
					</Heading>
					<Paragraph variant='lede' className='mt-reveal'>
						{post.excerpt}
					</Paragraph>
					<div className='mt-reveal'>
						<Paragraph variant={"caption"} className='flex flex-wrap items-center gap-x-3 gap-y-2'>
							<time dateTime={post.date}>{formatDateLong(post.date)}</time>
							<span aria-hidden>·</span>
							<span>{post.readingTime}</span>
						</Paragraph>
					</div>
					<div className='mt-reveal'>
						<TagList tags={post.tags} />
					</div>
				</Container>

				<Container as='div' width='full'>
					<Ornament />
				</Container>

				<Container as='div' direction='row' space='feature' className='justify-center'>
					<ArticleBody dropCap document={document} />
				</Container>

				{(previous !== undefined || next !== undefined) && (
					<>
						<Container as='div' width='full' space='divider'>
							<Ornament />
						</Container>
						<Container as='section' width='prose' space='tail-lg'>
							<div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
								{previous !== undefined && (
									<div className='flex flex-col gap-3'>
										<Paragraph variant='eyebrow'>Previous</Paragraph>
										<PostCard variant='card' {...previous} />
									</div>
								)}
								{next !== undefined && (
									<div className='flex flex-col gap-3'>
										<Paragraph variant='eyebrow'>Next</Paragraph>
										<PostCard variant='card' {...next} />
									</div>
								)}
							</div>
						</Container>
					</>
				)}
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}

export const getStaticPaths: GetStaticPaths = () => {
	return {
		paths: getPostSlugs().map((slug) => ({ params: { slug } })),
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<BlogPostProps, { slug: string }> = (context) => {
	const slug = context.params?.slug
	if (slug === undefined) {
		return { notFound: true }
	}

	const { post, document } = getPostBySlug(slug)
	const posts = getAllPosts()
	const index = posts.findIndex((candidate) => candidate.slug === slug)
	const olderPost = posts[index + 1]
	const newerPost = posts[index - 1]

	return {
		props: {
			post,
			document,
			...(olderPost !== undefined && { previous: toAdjacentPost(olderPost) }),
			...(newerPost !== undefined && { next: toAdjacentPost(newerPost) }),
		},
	}
}
