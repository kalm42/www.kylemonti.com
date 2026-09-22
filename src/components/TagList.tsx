import { cva, type VariantProps } from "class-variance-authority"
import Tag from "~/components/Tag"

const tagListStyles = cva("flex flex-wrap gap-2 mt-4", {
	variants: {
		variant: {
			post: "",
			project: "justify-end",
		},
	},
	defaultVariants: {
		variant: "post",
	},
})

type TagListVariants = VariantProps<typeof tagListStyles>
type TagListVariant = NonNullable<TagListVariants["variant"]>

interface TagListProps {
	tags: string[]
	variant?: TagListVariant
	limit?: boolean
}

/**
 * A post, project, or résumé entry's tag pills. `post` left-aligns for
 * `PostCard`; `project` right-aligns to sit beside `ProjectCard`'s status
 * dot. Shows every tag by default — pass `limit` to cap `PostCard`/
 * `ProjectCard` at three.
 *
 * @example <TagList tags={tags} />
 * @example <TagList tags={tags} variant="project" limit />
 */
function TagList(props: TagListProps) {
	const { tags, variant, limit = false } = props

	if (tags.length === 0) {
		return null
	}

	const shownTags = limit ? tags.slice(0, 3) : tags

	return (
		<div className={tagListStyles({ variant })}>
			{shownTags.map((tag) => (
				<Tag key={tag}>{tag}</Tag>
			))}
		</div>
	)
}

export default TagList
export type { TagListProps, TagListVariant }
