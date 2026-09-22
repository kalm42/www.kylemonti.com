# Kyle Monti — design system

This is the enforced design reference for kylemonti.com, pulled from the canonical design artifact (Claude Artifact `2YDxTkDd62ybaeXRXZMKcX`, "Kyle Monti"). Treat every value here as the source of truth. Do not invent a colour, size, duration, or copy pattern that isn't listed below — if something is missing, go back to the artifact rather than guessing.

Kyle Monti is the design for KyleMonti.com: a personal site holding a blog, a résumé, and a "workshop" of small side projects that each live on their own subdomain (`tallyho.kylemonti.com`, never a new domain). It ships as a static Next.js export styled with Tailwind. The feel is quiet luxury with a friendly voice: ivory paper, evergreen ink, brass used like gilt, serif type everywhere, and monospace only where there is code.

Components live in the artifact as reference implementations (`window.Monti`, React 18, JS). Port them to TSX and Tailwind per this repo's [AGENTS.md](./AGENTS.md) conventions (named `ComponentNameProps` types, `props: ComponentNameProps` destructured on the first line, Zod at data boundaries), keeping every design value.

## Voice and content

- Write in the first person, plainly and warmly. Lead with the concrete thing, then the feeling. Real copy: "Careful interfaces, quietly built." "Small useful things." "I build front-ends that feel unhurried."
- Sentence case for every heading, button and label. Never Title Case, never ALL CAPS in source — the `eyebrow` style uppercases itself via CSS.
- Buttons and links start with a verb: "Read the writing", "Download PDF", "Open the workshop". Links that leave the page name the destination and carry the `arrow-up-right` icon.
- No exclamation marks, no emoji, no "passionate about", no "Welcome to my site". Say what is here.
- Spell résumé with its accents. Dates read `14 Mar 2026` in eyebrows and `14 March 2026` in article meta. Reading time reads `6 min read`.
- Project names are single capitalised words (Tallyho, Gridwork). Hostnames, filenames and code are lowercase and set in mono.

## Colour

Two themes: `light` (Ivory) is first and the fallback; `dark` (Evergreen night) is a deep green-black, **not an inversion** of light.

- Set pages on `paper`, cards and popovers on `paper-raised`, inset wells and inline code on `paper-sunken`. Body text is `ink`, excerpts and nav-at-rest are `ink-muted`, dates and footers are `ink-subtle`.
- `brand` (evergreen, sage in dark) marks everything interactive: links, the primary button, the active nav mark, focus. Text on a `brand` fill is `on-brand`, never white or black.
- `brass` is gilt: it never carries words. Use it for ornament diamonds, the resting rule under links, hover borders on cards, quote marks and list markers. Words in brass use `brass-ink`.
- One primary button per view. Callouts use `brand-tint`, `brass-tint` or `danger-tint` and always carry a word label, never colour alone.
- Code blocks stay on `code-ground` in both themes; colour code only with `code-*` tokens.
- No gradients, no glass except the sticky header blur, no coloured shadows.

### Forbidden combinations

These fail contrast checks — never work around them by changing a colour, only by using the right token:

- `brass` as text on any `paper` ground (3.6:1 in light, under the 4.5:1 a word needs — brass is for marks only). Use `brass-ink` for words.
- `brand-hover` as text on a `brand` fill (~1.3:1). Hover swaps the _fill_ from `brand` to `brand-hover`; text stays `on-brand`. `brand-hover` is only a link colour on `paper*` grounds or `brand-tint`.
- `code-ground` as a text/icon colour on `code-line`, or `code-line` as text on `code-ground` — both are fills. Code text uses only `code-ink` and the other `code-*` text tokens.
- `hairline` or `paper-raised` as the only edge of a control (~1.3:1 / ~1.1:1). Controls use `border-strong`.
- `ink-subtle` for anything a reader must act on, or any text token on a fill its usage note doesn't name.

### Tokens

| Token              | Light     | Dark      | Usage                                                                      |
| ------------------ | --------- | --------- | -------------------------------------------------------------------------- |
| `paper`            | `#f6f1e7` | `#0f1813` | Page background.                                                           |
| `paper-raised`     | `#fbf8f1` | `#16221b` | Cards, scrolled header, popovers, inputs.                                  |
| `paper-sunken`     | `#ede5d5` | `#0a110d` | Inline code chips, resume sidebar, image wells.                            |
| `ink`              | `#1c1914` | `#f0eadb` | Primary text on any `paper*`, `brand-tint`, `brass-tint`.                  |
| `ink-muted`        | `#57503f` | `#bdb49e` | Secondary text: excerpts, nav at rest, captions.                           |
| `ink-subtle`       | `#6b6450` | `#9a927e` | Tertiary only: dates, reading times, footer notes. Never actionable text.  |
| `hairline`         | `#dcd2bd` | `#2a3a31` | Decorative dividers/outlines only (under 3:1).                             |
| `border-strong`    | `#8b805f` | `#6a7d70` | Controls that carry meaning: inputs, toggle, tag outlines, checkbox edges. |
| `brand`            | `#1e4636` | `#9dcdb3` | Links, primary button fill, active nav mark, focus.                        |
| `brand-hover`      | `#143427` | `#b9e0c9` | Hover/pressed state of `brand`. Never text on a `brand` fill.              |
| `on-brand`         | `#f6f1e7` | `#0c1510` | Text/icons on `brand` or `brand-hover` fills.                              |
| `brand-tint`       | `#dfe8dd` | `#1c3226` | Selected nav item, note callouts, tag hover.                               |
| `brass`            | `#a37628` | `#d3a955` | Marks only: ornaments, hover edges, numerals-as-shapes, list markers.      |
| `brass-ink`        | `#77500f` | `#dcb872` | Brass as text: eyebrows, hover dates, tip callout labels.                  |
| `brass-tint`       | `#eddcb4` | `#3a3018` | `::selection`, tip callouts, highlighted table rows.                       |
| `danger`           | `#8a2b34` | `#f0a3a6` | Oxblood. Caution callouts, form errors — always with a word/icon.          |
| `danger-tint`      | `#f1d9d6` | `#3a1d20` | Background for caution callouts, error rows.                               |
| `focus-ring`       | `#1e4636` | `#b9e0c9` | Keyboard focus: solid 2px outline, 3px offset, every interactive element.  |
| `code-ground`      | `#12201a` | `#0a120e` | Code block fill — dark on ivory in both themes. Fill only, never text.     |
| `code-ink`         | `#ece5d3` | `#ece5d3` | Default code text.                                                         |
| `code-comment`     | `#8fa094` | `#8fa094` | Comments, italic mono.                                                     |
| `code-keyword`     | `#e0b866` | `#e0b866` | Keywords, storage, control flow (brass).                                   |
| `code-string`      | `#a3d6b8` | `#a3d6b8` | Strings, template text (sage).                                             |
| `code-number`      | `#eba080` | `#eba080` | Numbers, booleans, constants (terracotta).                                 |
| `code-function`    | `#f3dfa8` | `#f3dfa8` | Function/method names (pale gold).                                         |
| `code-type`        | `#dfa9b3` | `#dfa9b3` | Types, classes, JSX tags (dusty rose).                                     |
| `code-punctuation` | `#a9b3a8` | `#a9b3a8` | Brackets, operators, separators.                                           |
| `code-line`        | `#1d2f26` | `#15231b` | Highlighted line background inside a code block.                           |
| `code-border`      | `#2d4237` | `#2d4237` | Hairline around code blocks and filename bar.                              |

## Typography

Three families, real variable font files, loaded via `next/font/google`:

| Family token | Font                            | Role                                                                                                 |
| ------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `display`    | Fraunces (SOFT axis 30, WONK 0) | `display-*`, `heading-1`–`heading-3`, `quote`. Weights stay light (340–450) — never bold a headline. |
| `text`       | Newsreader                      | Everything read: `lede`, `body-lg`, `body`, `ui`, `caption`, `eyebrow`, `heading-4`.                 |
| `mono`       | JetBrains Mono                  | Code, filenames, hostnames only: `code-block`, `code-inline`, `code-label`.                          |

Stacks: `display` → `"Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif`; `text` → `"Newsreader", "Iowan Old Style", Georgia, serif`; `mono` → `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace`.

- Italic is the one flourish: at most one italic word per headline, coloured `brand`, same size as its neighbours.
- Hold prose to `container-prose` (~66 characters). Never run body copy full width.
- Under 640px, step display styles down one size: `display-2xl` → `display-lg`, `display-xl` → `display-md`.

### Type scale

| Style                | Size / line-height | Weight      | Tracking | Usage                                                                                      |
| -------------------- | ------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------ |
| `display-2xl`        | 96px / 96px        | 340         | -0.03em  | Home hero headline, once per page. Drop to `display-xl` <1024px, `display-lg` <640px.      |
| `display-xl`         | 72px / 76px        | 360         | -0.028em | Section-opening statements, blog index title.                                              |
| `display-lg`         | 56px / 62px        | 380         | -0.022em | Resume page name, project index title.                                                     |
| `display-md`         | 40px / 48px        | 400         | -0.018em | Home section titles (Writing, Workshop).                                                   |
| `display-italic`     | 56px / 62px        | 340, italic | -0.02em  | The one italic word in a headline. `brass-ink` or `brand`, never both.                     |
| `quote`              | 30px / 42px        | 340, italic | -0.01em  | Pull quotes. `ink` text, `brass` ornament above — never a side rule.                       |
| `heading-1`          | 44px / 52px        | 400         | -0.02em  | Article title. One per page.                                                               |
| `heading-2`          | 32px / 40px        | 420         | -0.015em | Article section headings, resume section titles.                                           |
| `heading-3`          | 24px / 32px        | 450         | -0.01em  | Card titles, subsections, resume roles.                                                    |
| `heading-4` (text)   | 20px / 28px        | 600         | 0em      | Small headings in text face: list group titles, footer columns.                            |
| `lede` (text)        | 24px / 36px        | 350, italic | 0em      | Standfirst under an article title; one or two sentences.                                   |
| `body-lg` (text)     | 20px / 34px        | 400         | 0em      | Article prose. Measure 62–68 chars (`container-prose`).                                    |
| `body` (text)        | 18px / 30px        | 400         | 0em      | Home, resume, project copy; card excerpts.                                                 |
| `ui` (text)          | 16px / 24px        | 500         | 0.005em  | Buttons, nav links, form labels, tags.                                                     |
| `caption` (text)     | 14px / 22px        | 400         | 0.01em   | Dates, reading time, image captions, footer notes — `ink-subtle`.                          |
| `eyebrow` (text)     | 12px / 16px        | 600         | 0.16em   | Small-caps labels above titles. Always uppercase (CSS-driven), `brass-ink` or `ink-muted`. |
| `code-block` (mono)  | 14px / 24px        | 400         | 0em      | Code blocks on `code-ground`. 2-space tabs, ligatures on.                                  |
| `code-inline` (mono) | 0.86em / 1         | 450         | 0em      | Inline code in prose, on `paper-sunken`, `radius-sm`. Relative sizing.                     |
| `code-label` (mono)  | 12px / 16px        | 500         | 0.04em   | Filename tab / language chip above a code block.                                           |

## Space, layout, corners, shadows

**Spacing** (4px scale): `space-1` 4px (icon nudges) · `space-2` 8px (tag gaps) · `space-3` 12px (tight stacks, button padding-block) · `space-4` 16px (default gap, mobile card gutters, button padding-inline) · `space-5` 24px (card padding, mobile page gutter) · `space-6` 32px (desktop card padding, grid gaps) · `space-7` 48px (article block gaps, header height padding) · `space-8` 64px (subsection gaps, hero bottom padding) · `space-9` 96px (gaps between home sections) · `space-10` 128px (hero top padding, desktop page-end space).

Separate home sections with `space-9`, article blocks with `space-7`. Divide list rows with a `hairline`, never a box.

**Layout**: `container-prose` 42rem (~66 chars) for articles · `container-page` 72rem for home/blog index/project grid/resume · `gutter` 24px (<768px) · `gutter-wide` 48px (≥768px) · `header-height` 72px, sticky, blurred `paper`.

**Radius**: `radius-sm` 4px (inline code, tags, chips) · `radius-md` 8px (buttons, inputs, callouts) · `radius-lg` 14px (cards, code blocks) · `radius-xl` 24px (feature panels, hero image well) · `radius-pill` 999px (theme toggle, status chips, nav indicator).

**Shadows** — warm-tinted (brown) in light, pure black in dark:

| Token       | Light                                                                 | Dark                                                          | Usage                                    |
| ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `shadow-sm` | `0 1px 2px rgba(60,44,20,.07), 0 1px 1px rgba(60,44,20,.04)`          | `0 1px 2px rgba(0,0,0,.45), 0 1px 1px rgba(0,0,0,.3)`         | Cards and inputs at rest.                |
| `shadow-md` | `0 8px 20px -6px rgba(60,44,20,.16), 0 2px 5px rgba(60,44,20,.06)`    | `0 10px 24px -8px rgba(0,0,0,.6), 0 2px 6px rgba(0,0,0,.35)`  | Card/button hover lift, dropdowns.       |
| `shadow-lg` | `0 28px 56px -16px rgba(60,44,20,.26), 0 8px 16px rgba(60,44,20,.07)` | `0 32px 64px -16px rgba(0,0,0,.7), 0 8px 18px rgba(0,0,0,.4)` | Modals, command palette, feature panels. |

## Motion

Motion should feel like good manners: quick to start, slow to settle, never in the way. Everything that moves uses a duration + easing token — never invent a number.

**Durations**: `duration-instant` 90ms (press feedback) · `duration-fast` 160ms (colour/opacity, focus) · `duration-base` 280ms (hover lifts, underline draws, arrow glides, nav indicator) · `duration-slow` 480ms (theme icon swap, accordion, tabs) · `duration-reveal` 800ms (page/section entrance).

**Easing**: `ease-glide` `cubic-bezier(0.22,1,0.36,1)` — default, fast start/long soft landing · `ease-settle` `cubic-bezier(0.65,0,0.35,1)` — symmetric, for things trading places (theme icons, nav indicator) · `ease-spring` `cubic-bezier(0.34,1.4,0.64,1)` — overshoot, confirmations only (the copied tick).

**Rules**:

- Move `transform` and `opacity`. Colour changes use `duration-fast` + `linear`. Never animate layout properties on scroll.
- Hover is faster than its return: lift on `duration-base`, press on `duration-instant`.
- Stagger entrances by 70ms per item (`--i` index), capped at six items. Entrance = fade + 14px rise over `duration-reveal`.
- Respect `prefers-reduced-motion`: drop transforms/entrances, keep colour changes at 1ms.

**Interactions**:

| Element               | Motion                                                                                           | Tokens                          |
| --------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------- |
| Text link             | Brass rule at rest; evergreen rule draws left→right on hover; outbound arrow nudges 2px up-right | `duration-base`, `ease-glide`   |
| Primary button        | Lifts 2px, shadow→`shadow-md`, inner keyline fades in 4px inside edge, arrow glides 4px          | `duration-base`, `ease-glide`   |
| Secondary button      | Lifts 2px, fills `paper-raised`, border darkens to `ink`                                         | `duration-base`                 |
| Any button, pressed   | Scales to 0.985, lift removed                                                                    | `duration-instant`              |
| Nav                   | 2px mark slides between links: `brass` while hovering, `brand` at current page                   | `duration-slow`, `ease-settle`  |
| Theme toggle          | Sun/moon rotate 90°, scale from 0.5; colours cross-fade                                          | `duration-slow`, `ease-settle`  |
| Post row              | Wash→`paper-raised`, title rule draws, arrow slides in from 10px left                            | `duration-base`/`duration-slow` |
| Post/project card     | Lifts 4px, `shadow-md`, border→`brass`                                                           | `duration-base`, `ease-glide`   |
| Project arrow         | Arrow exits up-right as twin enters bottom-left; disc fills `brand`                              | `duration-slow`, `ease-glide`   |
| Live status dot       | Soft ring pulses every 2.8s                                                                      | `ease-glide`                    |
| Copy button           | Copy icon shrinks out, check springs in, "Copied" shows 1.8s                                     | `ease-spring`                   |
| Page/section entrance | Fade + rise, staggered                                                                           | `duration-reveal`, `ease-glide` |
| Ornament              | Rules grow outward from diamond                                                                  | `duration-reveal`               |

**Recipes**:

```css
/* Underline draw (links, titles) */
.link {
	background-image: linear-gradient(currentColor, currentColor);
	background-repeat: no-repeat;
	background-position: 0 100%;
	background-size: 0% 1px;
	transition: background-size var(--duration-base) var(--ease-glide);
}
.link:hover {
	background-size: 100% 1px;
}

/* Entrance, staggered with --i */
@keyframes rise {
	from {
		opacity: 0;
		transform: translateY(14px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
.reveal {
	animation: rise var(--duration-reveal) var(--ease-glide) both;
	animation-delay: calc(var(--i, 0) * 70ms);
}
```

Theme cross-fade: add `mt-theme-fade` to `<html>` for 600ms around a `data-theme` change; every colour transitions together.

## Imagery and the arch

The single graphic motif is the arch: a block whose top is a semicircle (radius = half its width), standing on the ground line. Appears in the hero and cover, in `brand`, `brass` outline (1.5px) or `brand-tint`. Use for empty states and section art. No stock photos, people illustrations, or emoji. A photograph, when unavoidable, is warm and natural, `radius-xl`, unfiltered.

## States

Hover lifts 2–4px, steps the shadow, shifts colour. Press scales to 0.985 in `duration-instant`. Keyboard focus is a solid 2px `focus-ring` outline, 3px offset, on every interactive element. Disabled is 50% opacity, no pointer events.

## Iconography

Lucide (ISC licence), 1.5px stroke, `currentColor`, 18px inline / 20px in cards. Allowed set only: `arrow-right`, `arrow-up-right`, `sun`, `moon`, `copy`, `check`, `rss`, `mail`, `download`, `menu`, `x`. `arrow-right` = moving within the site; `arrow-up-right` = leaving it (subdomains, external links). No brand logos — GitHub/LinkedIn are text links with the outbound arrow. Pair an icon with a visible word unless it's a toggle or copy button (needs `aria-label`).

The wordmark is set in type, not a drawn mark: "Kyle" upright, "Monti" italic, both `display` at weight 420/360.

## Components

Reference implementations live in the artifact as `window.Monti`; port to TSX. Each gets a `ComponentNameProps` type per AGENTS.md.

| Component          | Key props                                                                                                                                      | Notes                                                                                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**         | `variant` (primary fill / secondary outline / quiet underline text), `size` (sm 40px / md 48px / lg 56px), `arrow`, `icon`, `href`, `external` | One primary per view. Verb-first, sentence case. `on-brand` text on primary.                                                                                                                                               |
| **TextLink**       | `href`, `external`                                                                                                                             | Inline link, brass rule at rest → evergreen on hover. Never remove the rule — it's what distinguishes it from `ink` text. Use `Button variant="quiet"` for standalone actions.                                             |
| **NavBar**         | `items`, `current`, `sticky`, `onNavigate`, `homeHref`                                                                                         | Wordmark left, 3 links centre (Writing, Résumé, Workshop), theme toggle right. Sliding mark: `brass` on hover, `brand` at current page. `header-height` tall, `container-page` + gutters. Collapses to menu button <640px. |
| **ThemeToggle**    | `theme`, `onChange`                                                                                                                            | 40px round, sun/moon cross-fade. Once, far right of header. Persist via localStorage; set `data-theme` before first paint.                                                                                                 |
| **Wordmark**       | `size` (sm 18px / md 24px / lg 40px), `href`                                                                                                   | "Kyle" upright + "Monti" italic. Only logo — never draw a mark, never bold, never two lines. `md` header, `lg` footer, `sm` subdomain headers.                                                                             |
| **SectionHeading** | `eyebrow`, `title`, `action`, `actionHref`, `children`                                                                                         | Opens every home-page section. Follow with a hairline + content.                                                                                                                                                           |
| **PostCard**       | `title`, `excerpt`, `date`, `readingTime`, `tags`, `href`, `variant` (`row`/`card`)                                                            | Row: hairline, washes to `paper-raised` on hover. Card: lifts 4px, `brass` border. One link — never nest links inside. Max 3 tags.                                                                                         |
| **ProjectCard**    | `name`, `host`, `description`, `status` (Live/Beta/Idea), `tags`, `href`, `index`                                                              | Whole card is a link. Hover: lift, `brass` border, arrow-swap animation. Status word always shown beside its dot. 3-across grid ≥1024px.                                                                                   |
| **Tag**            | `tone` (`neutral` on `paper-sunken` / `brass` on `brass-tint`), `href`                                                                         | Names things, never sentences. Neutral for topics/skills; brass for one "Featured" flag max. Max 3 per post.                                                                                                               |
| **Prose**          | `dropCap`, `className`                                                                                                                         | MDX article column, `container-prose`. Styles plain `p/h2/h3/ul/ol/blockquote/hr/figure/code`. `dropCap` once per article, long essays only.                                                                               |
| **CodeBlock**      | `code`, `lang`, `filename`, `highlight`, `lineNumbers`                                                                                         | `code-ground` fill, filename bar, copy button. Highlighted with TanStack Highlight (`th-*` semantic classes mapped to `code-*` tokens, see `src/styles/code-theme.css`). Never scroll vertically — break the code instead. |
| **Callout**        | `kind` (`note` brand-tint / `tip` brass-tint / `caution` danger-tint), `title`, `children`                                                     | Label is always a word + diamond — never colour alone. Max 2 per article, 2 sentences each.                                                                                                                                |
| **ResumeEntry**    | `role`, `org`, `orgHref`, `period`, `location`, `summary`, `bullets`, `tags`                                                                   | Dates/place left, role/employer/achievements right. Bullets: brass diamond, verb + outcome, max 3. Stacks <640px. No page-breaks when printed.                                                                             |
| **SiteFooter**     | `nav`, `elsewhere`, `year`                                                                                                                     | Ornament, large wordmark + one-line tagline, two link columns, fine print naming the fonts. No newsletters/social feeds/fourth column.                                                                                     |
| **Ornament**       | —                                                                                                                                              | Hairline + brass diamond. Once per page: between header block and content, and atop the footer.                                                                                                                            |
| **Icon**           | `name`, `size`, `title`                                                                                                                        | See allowed name list above.                                                                                                                                                                                               |

## Code and prose (articles)

- Wrap MDX output in `Prose`. Body copy `body-lg` @ 34px leading; `heading-2` after 2.4em space; inline code on `paper-sunken`.
- One `h1` (`heading-1`) per article, followed by a `lede`, then date + reading time in `caption`, then tags.
- `dropCap` (first letter `brand`, 5 lines of Fraunces) once per long essay — never on short notes.
- Pull quotes: `quote` style, brass opening mark above, never a side rule.
- Section breaks use the diamond `hr` (Ornament), not a plain line.
- Figures fill the column at `radius-lg`; captions `caption` in `ink-subtle`, centred.
- Code blocks: always a filename for real files, highlight ≤3 lines, never vertical scroll (horizontal only), show line numbers only when prose refers to them. Inline code for identifiers/values only, never whole sentences.

Syntax highlighter token map (TanStack Highlight, light values since code stays dark in both themes). Every classified span gets `th-token` plus one semantic class below; anything unclassified (`th-variable`, `th-code-inline`, `th-heading`, `th-link`, `th-meta`, `th-deleted`, `th-inserted`) inherits `code-ink` from `.th-code` rather than being restated:

| Token              | TanStack Highlight classes (`th-*`)      |
| ------------------ | ----------------------------------------- |
| `code-ink`         | default (inherited from `.th-code`)       |
| `code-comment`     | `comment` (italic)                        |
| `code-keyword`     | `keyword`, `command`                      |
| `code-string`      | `string`                                  |
| `code-number`      | `number`, `literal`                       |
| `code-function`    | `function`                                |
| `code-type`        | `type`, `tag`                             |
| `code-punctuation` | `operator`, `property`, `attr`, `selector` |

## Site structure

| Route          | Purpose                                          | Built from                                                                                                                                       |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Introduce, then surface writing and the workshop | `NavBar`, hero (`display-2xl`, two `Button`s, the arch), `SectionHeading` + `PostCard` rows, `SectionHeading` + `ProjectCard` grid, `SiteFooter` |
| `/blog`        | Every essay, newest first                        | `display-xl` title, `PostCard` rows grouped by year with `eyebrow` year headings                                                                 |
| `/blog/[slug]` | One essay                                        | `Prose`, `CodeBlock`, `Callout`, tags, previous/next as two `PostCard` cards                                                                     |
| `/resume`      | Printable résumé                                 | `display-lg` name, `ResumeEntry` list, toolkit as `Tag`s, "Download PDF" `Button`                                                                |
| `/workshop`    | Side-project index                               | `display-xl` title, `ProjectCard` grid, 3-across ≥1024px                                                                                         |

Home hero: eyebrow → headline → one paragraph (≤2 sentences) → primary + secondary button. Arch sits right at 340×440, disappears <768px. Sections after the hero repeat: `SectionHeading` → hairline → content → `space-9`.

### Subdomains

Each side project lives at `<name>.kylemonti.com`, listed on `/workshop` via `ProjectCard` (hostname in mono). Status: Live (evergreen pulsing dot), Beta (brass dot), Idea (hollow ring) — word always shown.

- Every subdomain loads this system's `tokens.css` + font files from one shared package/folder — a project should look like a room in the same house.
- A subdomain may use any layout, but its header carries `Wordmark` linking back to kylemonti.com, and uses `paper`, `ink`, `brand` and the three type families.
- Footer carries a plain "kylemonti.com" text link home.

### Responsive

Mobile-first; test at 390, 768, 1200px. <640px: nav collapses to theme toggle + menu button (staggered-fade panel); post rows stack to one column (date + reading time inline); project cards go one across; footer columns go two across, brand on its own row.

### Print

Résumé prints white: force `data-theme="light"`, hide header/footer/buttons/theme toggle, keep `ResumeEntry` from breaking across pages.

## Next.js + Tailwind integration

Static export (`output: 'export'` in `next.config`), no runtime server — motion is CSS + small client components only.

**Fonts** — `next/font/google`, exposed as CSS variables, all three on `<html>`:

```ts
import { Fraunces, Newsreader, JetBrains_Mono } from "next/font/google"

export const fraunces = Fraunces({
	subsets: ["latin"],
	axes: ["opsz", "SOFT"],
	style: ["normal", "italic"],
	variable: "--font-fraunces",
})
export const newsreader = Newsreader({
	subsets: ["latin"],
	axes: ["opsz"],
	style: ["normal", "italic"],
	variable: "--font-newsreader",
})
export const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--font-jetbrains",
})
```

Set `font-variation-settings: "SOFT" 30, "WONK" 0` on every display/heading class.

**Tokens → Tailwind v4** (this repo is on Tailwind v4 + `@tailwindcss/postcss`): define every colour/space/radius/shadow/duration/easing as a CSS custom property in `tokens.css` (with `[data-theme="dark"]` overrides), then map into Tailwind with `@theme inline` so utilities like `bg-paper`, `text-ink-muted`, `rounded-lg`, `shadow-md` read the live variables and follow theme:

```css
@import "tailwindcss";
@import "./tokens.css";
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
	--color-paper: var(--paper);
	--color-paper-raised: var(--paper-raised);
	--color-paper-sunken: var(--paper-sunken);
	--color-ink: var(--ink);
	--color-ink-muted: var(--ink-muted);
	--color-ink-subtle: var(--ink-subtle);
	--color-hairline: var(--hairline);
	--color-border-strong: var(--border-strong);
	--color-brand: var(--brand);
	--color-brand-hover: var(--brand-hover);
	--color-on-brand: var(--on-brand);
	--color-brand-tint: var(--brand-tint);
	--color-brass: var(--brass);
	--color-brass-ink: var(--brass-ink);
	--color-brass-tint: var(--brass-tint);
	--color-danger: var(--danger);
	--font-display: var(--font-fraunces), "Iowan Old Style", Georgia, serif;
	--font-text: var(--font-newsreader), "Iowan Old Style", Georgia, serif;
	--font-mono: var(--font-jetbrains), ui-monospace, Menlo, monospace;
	--radius-md: var(--radius-md);
	--radius-lg: var(--radius-lg);
	--shadow-sm: var(--shadow-sm);
	--shadow-md: var(--shadow-md);
	--ease-glide: var(--ease-glide);
}
```

**Theme switching**: set `data-theme` on `<html>` before first paint via an inline script reading `localStorage`, falling back to `prefers-color-scheme`, so a dark visitor never sees an ivory flash. `ThemeToggle` writes the choice back and adds `mt-theme-fade` for 600ms around the change.

**Blog**: MDX → `Prose`, parsed with TanStack Markdown and highlighted with TanStack Highlight using the token-mapped theme above (`CodeBlock` calls the shared `src/shared/highlighter.ts` instance directly — synchronous, no build-time rehype pass required). `generateStaticParams` for every route. Emit RSS at build time (footer/header `rss` icon links to it).

**Rule of one place**: keep design values in `tokens.css`, the `@theme` block, and a `components/` folder of ported TSX components. Never restate a colour, radius, or duration as a literal elsewhere.

---

Source artifact: https://claude.ai/artifact/2YDxTkDd62ybaeXRXZMKcX — re-read it (not memory) if this file and the artifact ever disagree, and update this file to match.
