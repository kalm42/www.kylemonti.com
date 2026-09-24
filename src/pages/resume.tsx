import Head from "next/head"
import Button from "~/components/Button"
import NavBar from "~/components/NavBar"
import Ornament from "~/components/Ornament"
import ResumeEntry, { type ResumeEntryProps } from "~/components/ResumeEntry"
import SectionHeading from "~/components/SectionHeading"
import SiteFooter from "~/components/SiteFooter"
import TagList from "~/components/TagList"
import Container from "~/components/ui/container"
import Heading from "~/components/ui/heading"
import Main from "~/components/ui/main"
import Stack from "~/components/ui/stack"
import Paragraph from "~/components/ui/paragraph"
import { FOOTER_ELSEWHERE, NAV_ITEMS } from "~/shared/navigation"
import { SITE_EMAIL, SITE_NAME, SITE_OG_IMAGE_PATH, SITE_URL } from "~/shared/site"

const CURRENT_ROLE = "Front-End Tech Lead"
const LOCATION = "Phoenix, AZ"
const EMAIL = SITE_EMAIL
const LINKEDIN_URL = "https://www.linkedin.com/in/kyle-monti"

const SUMMARY =
	"Front-end architecture and technical leadership with expertise in scalable web applications, component-driven design systems, and performance optimization. Strong background in the TypeScript/JavaScript ecosystem, UI/UX implementation, accessibility standards, and automated testing. Experienced in mentoring engineers, leading cross-functional collaboration, and driving modernization initiatives from legacy systems to cloud-based platforms."

const SKILLS = [
	"TypeScript",
	"JavaScript",
	"Front-end architecture",
	"Design systems",
	"Performance optimization",
	"Accessibility",
	"Automated testing",
	"Agile delivery",
	"Mentoring",
	"Cross-functional collaboration",
]

const EXPERIENCE: ResumeEntryProps[] = [
	{
		role: "Front-End Tech Lead",
		org: "Trane Technologies",
		period: "May 2024 – Present",
		location: "Remote",
		bullets: [
			"Manage and mentor a team of front-end engineers, fostering growth, ownership, and engineering excellence.",
			"Oversee multiple projects end-to-end using Agile methodologies, ensuring on-time, high-quality delivery.",
			"Establish engineering standards through rigorous code reviews, testing frameworks, and best practices.",
			"Partner cross-functionally with backend, product, and design to align UX vision with technical execution.",
			"Drive performance, accessibility, and user-experience optimization across company web platforms.",
			"Evaluate and implement modern tools and frameworks to continuously improve team velocity and product quality.",
		],
	},
	{
		role: "Senior Front-End Engineer",
		org: "Magenta Technologies",
		period: "Aug 2022 – May 2024",
		location: "Remote",
		bullets: [
			"Led front-end architecture and technical direction for hvac.com following the transition from Red Ventures.",
			"Spearheaded development of a shared component library, defining scope and aligning with product and leadership stakeholders.",
			"Managed and mentored a team of two developers, improving delivery velocity and code quality as project complexity scaled.",
			"Drove cross-functional collaboration to support startup growth and evolving product requirements.",
		],
	},
	{
		role: "Front-End Engineer",
		org: "Red Ventures",
		period: "Mar 2021 – Aug 2022",
		location: "Remote",
		bullets: [
			"Led front-end updates for Trane Residential brand pages, improving UX and visual consistency.",
			"Implemented modern UI enhancements to elevate performance and usability.",
			"Mentored engineers on best practices, raising code quality.",
		],
	},
	{
		role: "Front-End Engineer",
		org: "Walmart",
		period: "Apr 2020 – Mar 2021",
		location: "Remote",
		bullets: [
			"Contributed to an enterprise modernization initiative migrating from IBM mainframes to cloud-based architecture.",
			"Developed front-end UI for in-store processing of online returns, enabling accurate documentation and reconciliation.",
			"Improved financial accuracy by aligning return workflows with balance-sheet requirements, reducing potential revenue leakage.",
		],
	},
]

const EDUCATION: ResumeEntryProps = {
	role: "BS, Accounting",
	org: "California Baptist University",
	period: "2019",
	location: "Riverside, CA",
}

function printPage() {
	window.print()
}

export default function Resume() {
	return (
		<>
			<Head>
				<title>{`${SITE_NAME} — Résumé`}</title>
				<meta name='description' content={SUMMARY} />
				<meta property='og:title' content={`${SITE_NAME} — Résumé`} />
				<meta property='og:description' content={SUMMARY} />
				<meta property='og:image' content={`${SITE_URL}${SITE_OG_IMAGE_PATH}`} />
				<meta property='og:url' content={`${SITE_URL}/resume`} />
			</Head>

			<NavBar items={NAV_ITEMS} current='/resume' />

			<Main>
				<Container as='section' width='full' gap='6' space='hero' print>
					<div>
						<p className='font-text text-eyebrow text-brass-ink uppercase mt-reveal'>{CURRENT_ROLE}</p>
						<Heading variant='display' size='lg' className='mt-reveal'>
							Kyle Monti
						</Heading>
					</div>
					<Paragraph variant='muted' className='max-w-prose mt-reveal'>
						{SUMMARY}
					</Paragraph>
					<Stack direction='wrap' className='items-center gap-x-4 gap-y-2 font-text text-ui text-ink-muted mt-reveal'>
						<span>{LOCATION}</span>
						<span aria-hidden>·</span>
						<Button href={`mailto:${EMAIL}`} variant='quiet' size='inherit' padding='none'>
							{EMAIL}
						</Button>
						<span aria-hidden>·</span>
						<Button href={LINKEDIN_URL} external arrow variant='quiet' size='inherit' padding='none'>
							LinkedIn
						</Button>
					</Stack>
					<div className='mt-reveal print:hidden'>
						<Button icon='download' onClick={printPage}>
							Download PDF
						</Button>
					</div>
				</Container>

				<Container width='full' print>
					<Ornament />
				</Container>

				<Container as='section' gap='4' space='section' print>
					<SectionHeading eyebrow='Experience' title='Where I’ve worked' />
					<Stack>
						{EXPERIENCE.map((entry) => (
							<ResumeEntry key={`${entry.org}-${entry.period}`} {...entry} />
						))}
					</Stack>
				</Container>

				<Container as='section' gap='4' space='section' print>
					<SectionHeading eyebrow='Education' title='Education' />
					<Stack>
						<ResumeEntry {...EDUCATION} />
					</Stack>
				</Container>

				<Container as='section' gap='6' space='tail-lg' print>
					<SectionHeading eyebrow='Toolkit' title='Skills & tools' />
					<TagList tags={SKILLS} />
				</Container>
			</Main>

			<SiteFooter nav={NAV_ITEMS} elsewhere={FOOTER_ELSEWHERE} year={new Date().getFullYear()} />
		</>
	)
}
