import type { MarkdownDocument } from "@tanstack/markdown"
import type { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import ArticleBody from "~/components/ArticleBody"
import NavBar from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import PostCard from "~/components/PostCard"
import SiteFooter from "~/components/SiteFooter"
import TagList from "~/components/TagList"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
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

			<main className='max-w-page mx-auto my-0 py-0 px-gutter-wide'>
				<article className='mx-auto flex max-w-prose flex-col gap-4 px-gutter pt-10 pb-9 md:px-gutter-wide'>
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
				</article>

				<div className='px-gutter md:px-gutter-wide'>
					<Ornament />
				</div>

				<div className='mx-auto flex w-full max-w-page justify-center px-gutter py-9 md:px-gutter-wide'>
					<ArticleBody dropCap document={document} />
				</div>

				{(previous !== undefined || next !== undefined) && (
					<>
						<div className='px-gutter md:px-gutter-wide mb-6'>
							<Ornament />
						</div>
						<section className='mx-auto max-w-prose px-gutter pb-10 md:px-gutter-wide'>
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
						</section>
					</>
				)}
			</main>

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
