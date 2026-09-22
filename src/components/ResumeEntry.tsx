import TagList from "~/components/TagList"
import Paragraph from "./ui/paragraph"
import Heading from "./ui/heading"
import Button from "./Button"

interface ResumeEntryProps {
	role: string
	org: string
	orgHref?: string
	period: string
	location?: string
	summary?: string
	bullets?: string[]
	tags?: string[]
}

/**
 * One job or role: dates and place at the left, role/employer/achievements
 * at the right. Bullets start with a verb and an outcome, at most three.
 * Stacks under 640px; never breaks across a printed page.
 *
 * @example <ResumeEntry role="Senior engineer" org="Acme" period="2022–present" bullets={["Shipped the thing"]} />
 */
function ResumeEntry(props: ResumeEntryProps) {
	const { role, org, orgHref, period, location, summary, bullets = [], tags = [] } = props
	const shownBullets = bullets.slice(0, 3)

	return (
		<div className='flex flex-col gap-4 border-b border-hairline py-8 break-inside-avoid sm:flex-row sm:gap-8'>
			<div className='flex shrink-0 flex-col gap-1 sm:w-40'>
				<Paragraph variant='eyebrow'>{period}</Paragraph>

				{location && <Paragraph variant='caption'>{location}</Paragraph>}
			</div>
			<div className='flex flex-1 flex-col gap-3'>
				<div>
					<Heading size='lg'>{role}</Heading>
					<Paragraph variant='muted'>
						{orgHref === undefined ?
							org
						:	<Button href={orgHref} variant={"quiet"} arrow external>
								{org}
							</Button>
						}
					</Paragraph>
				</div>
				{summary !== undefined && <Paragraph variant='muted'>{summary}</Paragraph>}
				{shownBullets.length > 0 && (
					<ul className='flex flex-col gap-2'>
						{shownBullets.map((bullet) => (
							<li key={bullet} className='flex gap-3 font-text text-body text-ink'>
								<span className='mt-2.75 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass' />
								{bullet}
							</li>
						))}
					</ul>
				)}
				<TagList tags={tags} />
			</div>
		</div>
	)
}

export default ResumeEntry
export type { ResumeEntryProps }
