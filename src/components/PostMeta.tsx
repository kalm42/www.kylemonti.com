interface PostMetaProps {
	date: string
	readingTime: string
}

const PostMeta = (props: PostMetaProps) => {
	const { date, readingTime } = props

	return (
		<div className='font-text pt-1'>
			<time className='text-brass-ink uppercase text-eyebrow'>{date}</time>
			<p className='text-caption text-ink-subtle'>{readingTime}</p>
		</div>
	)
}

export default PostMeta
