import Head from "next/head"
import Button from "~/components/Button"
import ErrorState from "~/components/ErrorState"
import NavBar from "~/components/NavBar"
import SiteFooter from "~/components/SiteFooter"
import Main from "~/components/ui/main"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

const TITLE = `${SITE_NAME} — Page not found`
const DESCRIPTION = "The page you're looking for isn't here. The link may be old, or the address mistyped."

export default function Custom404() {
	return (
		<>
			<Head>
				<title>{TITLE}</title>
				<meta name='description' content={DESCRIPTION} />
				<meta name='robots' content='noindex' />
				<meta property='og:title' content={TITLE} />
				<meta property='og:description' content={DESCRIPTION} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/404`} />
			</Head>

			<NavBar items={NAV_ITEMS} />

			<Main>
				<ErrorState eyebrow='404' title="This page isn't here." description={DESCRIPTION}>
					<Button href='/' arrow>
						Go home
					</Button>
					<Button href='/blog' variant='secondary'>
						Read the writing
					</Button>
				</ErrorState>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}
