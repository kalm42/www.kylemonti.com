// Emits public/rss.xml from src/content/blog at build time (see
// DESIGN.md → Next.js + Tailwind integration → Blog). Plain Node/ESM so it
// runs standalone before `next build`, without the app's `~/` path aliases —
// keep this file's frontmatter parsing in sync with src/shared/blog.ts.
import fs from "node:fs"
import path from "node:path"

const SITE_NAME = "Kyle Monti"
const SITE_URL = "https://www.kylemonti.com"
const SITE_DESCRIPTION = "Careful interfaces, quietly built."

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog")
const OUTPUT_PATH = path.join(process.cwd(), "public/rss.xml")

function parseFrontmatterFields(raw) {
	const fields = {}
	for (const line of raw.split("\n")) {
		const separatorIndex = line.indexOf(":")
		if (line.trim() === "" || separatorIndex === -1) {
			continue
		}
		const key = line.slice(0, separatorIndex).trim()
		const value = line.slice(separatorIndex + 1).trim()
		fields[key] = value
	}
	return fields
}

function readPost(slug) {
	const source = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8")
	const lines = source.split("\n")
	const end = lines.slice(1).findIndex((line) => line === "---") + 1
	const fields = parseFrontmatterFields(lines.slice(1, end).join("\n"))
	return { slug, title: fields.title, date: fields.date, excerpt: fields.excerpt }
}

function escapeXml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
}

function toRssItem(post) {
	const url = `${SITE_URL}/blog/${post.slug}`
	const pubDate = new Date(`${post.date}T00:00:00Z`).toUTCString()
	return `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${url}</link>
			<guid>${url}</guid>
			<description>${escapeXml(post.excerpt)}</description>
			<pubDate>${pubDate}</pubDate>
		</item>`
}

function generateRss() {
	const slugs = fs
		.readdirSync(CONTENT_DIR)
		.filter((file) => file.endsWith(".md"))
		.map((file) => file.replace(/\.md$/, ""))

	const posts = slugs.map(readPost).sort((a, b) => (a.date < b.date ? 1 : -1))

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>${escapeXml(SITE_NAME)}</title>
		<link>${SITE_URL}</link>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
${posts.map(toRssItem).join("\n")}
	</channel>
</rss>
`

	fs.writeFileSync(OUTPUT_PATH, xml)
	console.log(`Wrote ${posts.length} post(s) to public/rss.xml`)
}

generateRss()
