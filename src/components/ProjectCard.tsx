import { cva, type VariantProps } from "class-variance-authority"
import Icon from "~/components/Icon"
import TagList from "~/components/TagList"
import Heading from "./ui/heading"
import Paragraph from "./ui/paragraph"

const statusDotStyles = cva("h-2 w-2 shrink-0 rounded-full", {
	variants: {
		status: {
			Live: "bg-brand mt-live-dot",
			Beta: "bg-brass",
			Idea: "border border-border-strong",
		},
	},
})

type ProjectCardVariants = VariantProps<typeof statusDotStyles>
type ProjectStatus = NonNullable<ProjectCardVariants["status"]>

interface ProjectCardProps {
	name: string
	host: string
	description: string
	status: ProjectStatus
	tags?: string[]
	href: string
	index?: number
}

/**
 * A card for a side project living on its own subdomain. The whole card
 * is a link out of the page — every project lives at `<name>.kylemonti.com`.
 * Hover: lift, `brass` border, the arrow swaps for its twin.
 *
 * @example <ProjectCard name="Tallyho" host="tallyho.kylemonti.com" description="..." status="Live" href="https://tallyho.kylemonti.com" index={1} />
 */
function ProjectCard(props: ProjectCardProps) {
	const { name, host, description, status, tags = [], href, index } = props

	return (
		<a
			href={href}
			target='_blank'
			rel='noopener noreferrer'
			className='group relative flex flex-col gap-4 rounded-lg border border-hairline bg-paper-raised p-6 shadow-sm transition-all duration-base ease-glide hover:-translate-y-1 hover:border-brass hover:shadow-md'
		>
			<span className='flex items-start justify-between md:mb-6'>
				{index !== undefined && (
					<Heading as='span' variant='display' size='md' tone='brass-ink' className='italic'>
						{String(index).padStart(2, "0")}
					</Heading>
				)}
				<span className='relative flex h-[2.5rem] w-[2.5rem] shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border-strong text-ink transition-colors duration-slow ease-glide group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand'>
					<span className='absolute transition-all duration-slow ease-glide group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:opacity-0'>
						<Icon name='arrow-up-right' size={18} />
					</span>
					<span className='absolute -translate-x-4 translate-y-4 opacity-0 transition-all duration-slow ease-glide group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'>
						<Icon name='arrow-up-right' size={18} />
					</span>
				</span>
			</span>
			<div className='flex flex-col gap-1'>
				<Heading size='lg'>{name}</Heading>
				<Paragraph variant='mono'>{host}</Paragraph>
			</div>
			<Paragraph variant='muted'>{description}</Paragraph>
			<div className='flex items-center justify-between gap-3'>
				<span className='inline-flex items-center gap-2 font-text text-caption text-ink-muted'>
					<span className={statusDotStyles({ status })} />
					{status}
				</span>
				<TagList tags={tags} variant='project' limit />
			</div>
		</a>
	)
}

export default ProjectCard
export type { ProjectCardProps, ProjectStatus }
