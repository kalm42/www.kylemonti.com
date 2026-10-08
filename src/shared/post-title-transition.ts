/**
 * The `view-transition-name` shared by a post's title in its `PostCard` and
 * its article `<h1>`, so the title morphs between them on navigation. Keyed
 * by the post's href because names must be unique on a page and a list
 * shows many cards. Slugs are already valid ident characters.
 *
 * @example postTitleTransitionName("/blog/why-springs-feel-right") // "post-title-blog-why-springs-feel-right"
 */
function postTitleTransitionName(href: string) {
	return `post-title${href.replaceAll("/", "-")}`
}

export default postTitleTransitionName
