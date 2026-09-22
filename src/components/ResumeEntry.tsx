import TagList from "~/components/TagList"
import TextLink from "~/components/TextLink"

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
				<p className='font-text text-caption text-ink-subtle'>{period}</p>
				{location && <p className='font-text text-caption text-ink-subtle'>{location}</p>}
			</div>
			<div className='flex flex-1 flex-col gap-3'>
				<div>
					<h3 className='font-display text-heading-3 text-ink'>{role}</h3>
					<p className='font-text text-body text-ink-muted'>
						{orgHref === undefined ?
							org
						:	<TextLink href={orgHref} external>
								{org}
							</TextLink>
						}
					</p>
				</div>
				{summary !== undefined && <p className='font-text text-body text-ink-muted'>{summary}</p>}
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
