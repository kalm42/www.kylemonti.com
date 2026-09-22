/**
 * A hairline rule with a brass diamond centred on it. Use once per page:
 * between the header block and page content, and atop the footer.
 *
 * @example <Ornament />
 */
function Ornament() {
	return (
		<div role='separator' className='flex items-center gap-4 text-brass mt-ornament'>
			<span className='flex-1 h-px bg-hairline mt-ornament__line' />
			<svg width='9' height='9' viewBox='0 0 9 9' aria-hidden='true'>
				<path d='M4.5 0 9 4.5 4.5 9 0 4.5Z' fill='currentColor'></path>
			</svg>
			<span className='flex-1 h-px bg-hairline mt-ornament__line' />
		</div>
	)
}

export default Ornament
