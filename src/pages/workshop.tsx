import Head from "next/head"
import NavBar from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import ProjectCard from "~/components/ProjectCard"
import SiteFooter from "~/components/SiteFooter"
import Heading from "~/components/ui/heading"
import Paragraph from "~/components/ui/paragraph"
import Main from "~/components/ui/main"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { PROJECTS } from "~/shared/projects"
import { SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

const DESCRIPTION =
	"Two small tools I've built to answer a specific question — a color namer and a rental-property analyzer, each living at its own address."

export default function Workshop() {
	return (
		<>
			<Head>
				<title>{`${SITE_NAME} — Workshop`}</title>
				<meta name='description' content={DESCRIPTION} />
				<meta property='og:title' content={`${SITE_NAME} — Workshop`} />
				<meta property='og:description' content={DESCRIPTION} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/workshop`} />
			</Head>

			<NavBar items={NAV_ITEMS} current='/workshop' />

			<Main>
				<section className='flex flex-col gap-6 px-gutter pt-10 pb-9 md:px-gutter-wide'>
					<div>
						<p className='font-text text-eyebrow text-brass-ink uppercase mt-reveal'>Workshop</p>
						<Heading variant='display' size='xl' className='mt-reveal'>
							Small useful things
						</Heading>
					</div>
					<Paragraph variant='muted' className='max-w-prose mt-reveal'>
						Side projects I&rsquo;ve built to solve a specific problem, each shipped as its own small tool and kept as
						small as it needs to be.
					</Paragraph>
				</section>

				<div className='px-gutter md:px-gutter-wide'>
					<Ornament />
				</div>

				<section className='mx-auto flex w-full max-w-page flex-col gap-6 px-gutter py-9 md:px-gutter-wide'>
					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{PROJECTS.map((project, index) => (
							<ProjectCard key={project.href} {...project} index={index + 1} />
						))}
					</div>
				</section>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}
