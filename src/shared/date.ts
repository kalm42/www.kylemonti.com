const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

function parseIsoDateUtc(isoDate: string): Date {
	const parts = isoDate.split("-").map(Number)
	const [year = 0, month = 1, day = 1] = parts
	return new Date(Date.UTC(year, month - 1, day))
}

function monthName(date: Date): string {
	return MONTH_NAMES[date.getUTCMonth()] ?? ""
}

/** `14 Mar 2026` — eyebrows, card dates. */
function formatDateShort(isoDate: string): string {
	const date = parseIsoDateUtc(isoDate)
	return `${String(date.getUTCDate())} ${monthName(date).slice(0, 3)} ${String(date.getUTCFullYear())}`
}

/** `14 March 2026` — article meta. */
function formatDateLong(isoDate: string): string {
	const date = parseIsoDateUtc(isoDate)
	return `${String(date.getUTCDate())} ${monthName(date)} ${String(date.getUTCFullYear())}`
}

const WORDS_PER_MINUTE = 225

/** `6 min read`, estimated from a word count at 225wpm. */
function estimateReadingTime(text: string): string {
	const wordCount = text.trim().split(/\s+/).filter(Boolean).length
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
	return `${String(minutes)} min read`
}

export { estimateReadingTime, formatDateLong, formatDateShort, parseIsoDateUtc }
