import Head from "next/head"
import Button from "~/components/Button"
import ErrorState from "~/components/ErrorState"
import NavBar from "~/components/NavBar"
import SiteFooter from "~/components/SiteFooter"
import Main from "~/components/ui/main"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { SITE_EMAIL, SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

const TITLE = `${SITE_NAME} — Server error`
const DESCRIPTION = "Something went wrong on our end. Try again in a moment, or reach out if it keeps happening."

export default function Custom500() {
	return (
		<>
			<Head>
				<title>{TITLE}</title>
				<meta name='description' content={DESCRIPTION} />
				<meta name='robots' content='noindex' />
				<meta property='og:title' content={TITLE} />
				<meta property='og:description' content={DESCRIPTION} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/500`} />
			</Head>

			<NavBar items={NAV_ITEMS} />

			<Main>
				<ErrorState eyebrow='500' title='Something went wrong.' description={DESCRIPTION}>
					<Button href='/' arrow>
						Go home
					</Button>
					<Button href={`mailto:${SITE_EMAIL}`} variant='secondary' icon='mail'>
						Email me
					</Button>
				</ErrorState>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}
