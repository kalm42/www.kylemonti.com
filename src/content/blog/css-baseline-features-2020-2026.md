---
title: Everything that reached CSS Baseline between 2020 and 2026
date: 2026-09-28
excerpt: Caniuse tables tell you which version shipped support, not whether it is safe to ship. Here is every CSS feature that hit Baseline across Chrome, Firefox, and Safari since 2020, pulled straight from the same data MDN uses.
tags: CSS
---

Baseline is MDN and the browser vendors' answer to squinting at caniuse: a feature is either **Newly available** (Chrome, Firefox, and Safari all ship it, full stop) or **Widely available** (all three have shipped it for at least 30 months, so anyone not running an ancient browser has it). I wanted a real list of what crossed either line since 2020 so I pulled the [`web-features`](https://github.com/web-platform-dx/web-features) dataset. The same structured data that backs MDN's Baseline badges and [webstatus.dev](https://webstatus.dev/). I filtered every CSS entry by its Baseline date. What follows is that list.

Where a feature says "Widely available since," you can use it without a second thought. Where it says "Newly available since," all three engines support it, but double-check your audience's browser versions before you rely on it exclusively — no fallback needed for evergreen browsers, but worth a caniuse glance for anyone stuck on stale corporate Chrome or old Safari.

## Layout

`clamp()`, `min()`, and `max()` (Widely available since 2023) take a lot of the manual work out of responsive sizing — one declaration instead of a `font-size` plus a media query to override it:

```css
h1 {
	font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}
```

The middle value is what actually resizes the text; the two outer values are the floor and ceiling it will never cross.

<style>
.mt-fn-demo{margin-block:2em;display:grid;gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-fn-demo__hint{margin:0;font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-fn-demo__row{display:grid;gap:var(--space-2);}
.mt-fn-demo__track{height:2rem;overflow:hidden;border-radius:var(--radius-sm);background:var(--paper);}
.mt-fn-demo__bar{height:100%;background:var(--brand);}
.mt-fn-demo__bar--min{width:min(70vw,320px);}
.mt-fn-demo__bar--max{width:max(20vw,120px);}
.mt-fn-demo__bar--clamp{width:clamp(120px,45vw,420px);}
.mt-fn-demo__code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
</style>
<div class="mt-fn-demo">
<p class="mt-fn-demo__hint">Drag your browser window narrower and wider — each bar's width comes straight from the declaration below it, no media query involved.</p>
<div class="mt-fn-demo__row"><div class="mt-fn-demo__track"><div class="mt-fn-demo__bar mt-fn-demo__bar--min"></div></div><code class="mt-fn-demo__code">width: min(70vw, 320px)</code></div>
<div class="mt-fn-demo__row"><div class="mt-fn-demo__track"><div class="mt-fn-demo__bar mt-fn-demo__bar--max"></div></div><code class="mt-fn-demo__code">width: max(20vw, 120px)</code></div>
<div class="mt-fn-demo__row"><div class="mt-fn-demo__track"><div class="mt-fn-demo__bar mt-fn-demo__bar--clamp"></div></div><code class="mt-fn-demo__code">width: clamp(120px, 45vw, 420px)</code></div>
</div>

`aspect-ratio` (Widely available since 2024) replaced the old padding-top-percentage hack for reserving space before an image or video loads. `gap` in flexbox (Widely available since 2023) means you no longer need `margin` tricks to space out flex children. [Logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) like `margin-inline` and `padding-block` (Widely available since 2024) describe spacing relative to writing direction instead of raw left/right/top/bottom, which matters the moment a page needs to support a right-to-left locale.

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) only became Widely available in August 2025 — barely a year ago — but they solve the actual problem component libraries have wanted for a decade: styling based on the space a component has, not the viewport.

```css
.card-wrapper {
	container-type: inline-size;
}

@container (min-width: 400px) {
	.card {
		grid-template-columns: 120px 1fr;
	}
}
```

<style>
.mt-cq-demo{margin-block:2em;padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-cq-demo__hint{margin:0 0 var(--space-3);font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-cq-demo__resizer{resize:horizontal;overflow:auto;container-type:inline-size;width:260px;max-width:100%;min-width:160px;padding:var(--space-3);border:1px dashed var(--border-strong);border-radius:var(--radius-sm);background:var(--paper);}
.mt-cq-demo__card{display:grid;grid-template-columns:1fr;gap:var(--space-2);align-items:center;}
.mt-cq-demo__thumb{aspect-ratio:1;width:100%;border-radius:var(--radius-sm);background:var(--brand);}
.mt-cq-demo__badge{justify-self:start;padding:.15em .6em;border-radius:var(--radius-pill);background:var(--paper-sunken);font-size:var(--text-caption);font-weight:600;color:var(--ink-subtle);}
@container (min-width: 320px){.mt-cq-demo__card{grid-template-columns:64px 1fr;}.mt-cq-demo__badge{background:var(--brand-tint);color:var(--brand);}}
</style>
<div class="mt-cq-demo">
<p class="mt-cq-demo__hint">Drag the bottom-right corner of the dashed box — the card inside switches layout at 320px of container width, not viewport width.</p>
<div class="mt-cq-demo__resizer">
<div class="mt-cq-demo__card"><div class="mt-cq-demo__thumb"></div><span class="mt-cq-demo__badge">@container (min-width: 320px)</span></div>
</div>
</div>

[Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid) (Widely available since March 2026) lets a nested grid item line up its rows or columns with the parent grid instead of starting a new independent track list — the thing people used to fake with `display: contents` and a lot of hope.

```css
.cards {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: auto auto auto;
}

.card {
	display: grid;
	grid-row: span 3;
	grid-template-rows: subgrid;
}
```

Every card spans the same three parent row tracks instead of sizing its own, so its title, body, and meta line stretch to whatever the tallest sibling in that band needs — no JavaScript measuring, no fixed heights:

<style>
.mt-subgrid-demo{margin-block:2em;display:grid;gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-subgrid-demo__hint{margin:0;font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-subgrid-demo__label{margin:0;font-size:var(--text-caption);font-weight:600;color:var(--ink-subtle);}
.mt-subgrid-demo__label code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-subgrid-demo__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-3);}
.mt-subgrid-demo__grid--subgrid{grid-template-rows:auto auto auto;}
.mt-subgrid-demo__card{display:grid;grid-template-rows:auto auto auto;gap:var(--space-2);min-width:0;padding:var(--space-3);border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--paper);}
.mt-subgrid-demo__grid--subgrid .mt-subgrid-demo__card{grid-row:span 3;grid-template-rows:subgrid;}
.mt-subgrid-demo__card h4{margin:0;font-size:var(--text-caption);font-weight:600;color:var(--ink);}
.mt-subgrid-demo__card p{margin:0;font-size:var(--text-caption);line-height:1.4;color:var(--ink-muted);}
.mt-subgrid-demo__card .mt-subgrid-demo__meta{align-self:start;font-weight:600;color:var(--brand);}
@media (max-width:520px){.mt-subgrid-demo__grid{grid-template-columns:1fr;}.mt-subgrid-demo__grid--subgrid .mt-subgrid-demo__card{grid-row:auto;grid-template-rows:auto auto auto;}}
</style>
<div class="mt-subgrid-demo">
<p class="mt-subgrid-demo__hint">Same three cards and the same content in both rows below — only the grid rules change.</p>
<p class="mt-subgrid-demo__label">Without subgrid</p>
<div class="mt-subgrid-demo__grid">
<article class="mt-subgrid-demo__card"><h4>Short title</h4><p>One short line of body copy.</p><p class="mt-subgrid-demo__meta">2 min read</p></article>
<article class="mt-subgrid-demo__card"><h4>A noticeably longer heading that wraps onto two lines</h4><p>This card has quite a bit more body copy than the others, enough that it wraps across several lines.</p><p class="mt-subgrid-demo__meta">6 min read</p></article>
<article class="mt-subgrid-demo__card"><h4>Medium length title</h4><p>A middling amount of body text, more than the first card but less than the second.</p><p class="mt-subgrid-demo__meta">4 min read</p></article>
</div>
<p class="mt-subgrid-demo__label">With <code>grid-template-rows: subgrid</code></p>
<div class="mt-subgrid-demo__grid mt-subgrid-demo__grid--subgrid">
<article class="mt-subgrid-demo__card"><h4>Short title</h4><p>One short line of body copy.</p><p class="mt-subgrid-demo__meta">2 min read</p></article>
<article class="mt-subgrid-demo__card"><h4>A noticeably longer heading that wraps onto two lines</h4><p>This card has quite a bit more body copy than the others, enough that it wraps across several lines.</p><p class="mt-subgrid-demo__meta">6 min read</p></article>
<article class="mt-subgrid-demo__card"><h4>Medium length title</h4><p>A middling amount of body text, more than the first card but less than the second.</p><p class="mt-subgrid-demo__meta">4 min read</p></article>
</div>
</div>

In the first row, each card is its own independent grid, so the title, body, and meta line only line up if the content happens to be the same length. In the second row, `grid-template-rows: subgrid` hands each card's row sizing back to the parent, so the title band, body band, and meta band each size to their tallest occupant across all three cards — the misalignment disappears without touching the markup or the content.

## Selectors

`:is()`, `:where()`, and the selector-list form of `:not()` (Widely available since 2023) collapse repetitive selector lists into one line, with `:where()` doing it at zero specificity so it never fights your other rules. [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) (Widely available since 2024) finally gave the platform a way to show focus rings for keyboard users without showing them on every mouse click.

[`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) crossed into Widely available in June 2026, just a few months ago. It's the parent selector CSS never had:

```css
.form-field:has(input:invalid) {
	border-color: var(--color-danger);
}
```

<style>
.mt-has-demo{margin-block:2em;padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-has-demo__hint{margin:0 0 var(--space-3);font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-has-demo__hint code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-has-demo__field{display:grid;gap:var(--space-1);max-width:22rem;padding:var(--space-3);border:2px solid var(--hairline);border-radius:var(--radius-sm);background:var(--paper);transition:border-color var(--duration-fast) var(--ease-settle);}
.mt-has-demo__field label{font-size:var(--text-caption);font-weight:600;color:var(--ink-muted);}
.mt-has-demo__field input{font-family:inherit;font-size:var(--text-caption);padding:.5em .6em;border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--paper-raised);color:var(--ink);}
.mt-has-demo__field:has(input:invalid){border-color:var(--danger);}
.mt-has-demo__field:has(input:valid:not(:placeholder-shown)){border-color:var(--brand);}
</style>
<div class="mt-has-demo">
<p class="mt-has-demo__hint">Type in this field — no JavaScript is checking it, the wrapper's border color comes straight from <code>:has(input:invalid)</code> and <code>:has(input:valid)</code>.</p>
<div class="mt-has-demo__field"><label for="mt-has-demo-email">Email</label><input id="mt-has-demo-email" type="email" placeholder="you@example.com"></div>
</div>

CSS nesting (Widely available since June 2026) needs no preprocessor anymore:

```css
.card {
	padding: 1rem;

	& > h3 {
		margin-block-end: 0.5rem;
	}

	&:hover {
		box-shadow: var(--shadow-md);
	}
}
```

And `:nth-child(An+B of <selector>)` (Widely available since 2025) lets you count only the siblings that match a selector — useful for things like "every third item that isn't hidden."

## Color

The color function list grew a lot in this window. `hwb()` (Widely available since 2024), plus `lab()`/`lch()` and `oklab()`/`oklch()` (both Widely available since November 2025), give you color spaces that are easier to reason about than hex or `hsl()` when you want to lighten, darken, or generate a palette programmatically. [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) (Widely available since November 2025) does the mixing for you:

```css
.button:hover {
	background-color: color-mix(in oklch, var(--color-brand) 85%, black);
}
```

[`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) (Newly available since 2024) picks between two values based on the current color scheme, so a lot of `@media (prefers-color-scheme: dark)` overrides collapse into one line:

```css
:root {
	color-scheme: light dark;
	--color-bg: light-dark(white, #111);
}
```

[Relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) (Newly available since September 2024) derives a new color from an existing one — `oklch(from var(--color-brand) calc(l * 1.2) c h)` to get a lighter variant without hand-mixing.

## Typography

[`text-wrap: balance`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) (Newly available since 2024) fixes the specific, annoying problem of a heading wrapping to two lines with one lonely word on the second:

```css
h1,
h2,
h3 {
	text-wrap: balance;
}
```

Same heading, same column width, two settings:

<style>
.mt-balance-demo{margin-block:2em;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-balance-demo__col{display:grid;align-content:start;gap:var(--space-2);padding:var(--space-3);border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--paper);}
.mt-balance-demo__label{margin:0;font-size:var(--text-caption);font-weight:600;color:var(--ink-subtle);}
.mt-balance-demo__label code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-balance-demo__heading{margin:0;font-family:var(--font-fraunces),"Iowan Old Style","Palatino Linotype",Georgia,serif;font-size:1.15rem;line-height:1.25;color:var(--ink);}
.mt-balance-demo__heading--wrap{text-wrap:wrap;}
.mt-balance-demo__heading--balance{text-wrap:balance;}
@media (max-width:480px){.mt-balance-demo{grid-template-columns:1fr;}}
</style>
<div class="mt-balance-demo">
<div class="mt-balance-demo__col"><p class="mt-balance-demo__label">Default (<code>text-wrap: wrap</code>)</p><h4 class="mt-balance-demo__heading mt-balance-demo__heading--wrap">Every CSS feature Chrome, Firefox, and Safari all finally agree on</h4></div>
<div class="mt-balance-demo__col"><p class="mt-balance-demo__label"><code>text-wrap: balance</code></p><h4 class="mt-balance-demo__heading mt-balance-demo__heading--balance">Every CSS feature Chrome, Firefox, and Safari all finally agree on</h4></div>
</div>

The browser only bothers balancing short blocks of text (headings, not paragraphs), so it's safe to apply broadly. `text-wrap: pretty` (part of the broader `text-wrap` property, Newly available since October 2024) does something similar for body copy, avoiding single words orphaned on the last line of a paragraph.

## Math and custom properties

CSS picked up real trig functions — `sin()`, `cos()`, `tan()`, `atan2()`, and friends (Widely available since September 2025) — which matter for anything positioned around a circle or driven by an angle, like a radial menu or a custom slider thumb. `round()`, `mod()`, and `rem()` (Newly available since 2024) do rounding and remainder math inside `calc()` without JavaScript. The `pi`, `e`, `infinity`, and `NaN` keywords (Widely available since December 2025) are accepted anywhere those math functions are, so `calc(pi * 1rem)` is valid CSS now.

[`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) (Newly available since 2024) registers a custom property with a real type, which is what makes custom properties animatable:

```css
@property --gradient-angle {
	syntax: "<angle>";
	inherits: false;
	initial-value: 0deg;
}

.spinner {
	background: conic-gradient(from var(--gradient-angle), red, blue);
	animation: spin 2s linear infinite;
}

@keyframes spin {
	to {
		--gradient-angle: 360deg;
	}
}
```

Without the `@property` declaration, the browser has no idea `--gradient-angle` is an angle and won't interpolate it — the animation just snaps. Watch the two rings below run the identical animation:

<style>
@property --mt-prop-demo-angle-registered { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
.mt-prop-demo{margin-block:2em;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-prop-demo__col{display:grid;justify-items:center;gap:var(--space-2);text-align:center;}
.mt-prop-demo__label{margin:0;font-size:var(--text-caption);font-weight:600;color:var(--ink-subtle);}
.mt-prop-demo__label code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-prop-demo__ring{width:72px;height:72px;border-radius:50%;}
.mt-prop-demo__ring--registered{background:conic-gradient(from var(--mt-prop-demo-angle-registered),var(--brand),var(--brass),var(--brand));animation:mt-prop-demo-spin-registered 3s linear infinite;}
.mt-prop-demo__ring--unregistered{background:conic-gradient(from var(--mt-prop-demo-angle-unregistered,0deg),var(--brand),var(--brass),var(--brand));animation:mt-prop-demo-spin-unregistered 3s linear infinite;}
@keyframes mt-prop-demo-spin-registered{to{--mt-prop-demo-angle-registered:360deg;}}
@keyframes mt-prop-demo-spin-unregistered{to{--mt-prop-demo-angle-unregistered:360deg;}}
@media (max-width:480px){.mt-prop-demo{grid-template-columns:1fr;}}
</style>
<div class="mt-prop-demo">
<div class="mt-prop-demo__col"><p class="mt-prop-demo__label">Registered with <code>@property</code></p><div class="mt-prop-demo__ring mt-prop-demo__ring--registered"></div></div>
<div class="mt-prop-demo__col"><p class="mt-prop-demo__label">Plain custom property</p><div class="mt-prop-demo__ring mt-prop-demo__ring--unregistered"></div></div>
</div>

The left ring spins smoothly. The right one runs the same `0deg` → `360deg` keyframe on an unregistered property, but the browser can't interpolate an untyped value, so it can only jump between the start and end state — and since a conic gradient at `0deg` looks identical to one at `360deg`, that jump is invisible. It looks frozen, not because nothing is happening, but because you can't see a jump between two identical-looking frames.

## Motion without JavaScript

`@layer` (Widely available since 2024) gives you named cascade priority groups, so a reset can stay low-priority and component styles can stay high-priority regardless of selector specificity or source order:

```css
@layer reset, base, components, utilities;
```

The bigger unlock is `@starting-style` paired with `transition-behavior: allow-discrete` (both Newly available since August 2024). Together they let you transition an element in from `display: none` or `[hidden]`, which used to require either JavaScript or faking it with `visibility` and `opacity`:

```css
[popover] {
	opacity: 0;
	transition:
		opacity 0.3s,
		display 0.3s allow-discrete;
}

[popover]:popover-open {
	opacity: 1;

	@starting-style {
		opacity: 0;
	}
}
```

<style>
.mt-popover-demo{margin-block:2em;padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);text-align:center;}
.mt-popover-demo__hint{margin:0 0 var(--space-3);font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-popover-demo__hint code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-popover-demo__button{font-family:inherit;font-size:var(--text-caption);font-weight:600;padding:.6em 1.3em;border:1px solid var(--border-strong);border-radius:var(--radius-pill);background:var(--brand);color:var(--on-brand);cursor:pointer;}
.mt-popover-demo__panel{margin:auto;max-width:min(90vw,320px);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-raised);color:var(--ink-muted);text-align:left;box-shadow:var(--shadow-lg);opacity:0;transition:opacity .3s var(--ease-settle),display .3s allow-discrete,overlay .3s allow-discrete;}
.mt-popover-demo__panel code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-popover-demo__panel:popover-open{opacity:1;@starting-style{opacity:0;}}
</style>
<div class="mt-popover-demo">
<p class="mt-popover-demo__hint">Real HTML, zero JavaScript — a <code>popover</code> attribute and a <code>popovertarget</code> button. Dismiss it by clicking outside or pressing Escape.</p>
<button class="mt-popover-demo__button" popovertarget="mt-popover-demo-panel">Open panel</button>
<div id="mt-popover-demo-panel" class="mt-popover-demo__panel" popover>This is a native <code>[popover]</code> element — top layer, light-dismiss, and this fade all come from the CSS above it, not a script.</div>
</div>

[View transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) only became Newly available in October 2025 — under a year old — so this is the one on this list I'd actually pin to a specific browser version list before shipping it as anything other than a progressive enhancement. When it applies, it animates the swap between two DOM states (or two pages, with the cross-document version) without you hand-writing the transition.

## Browser chrome and form polish

The `popover` attribute and its `::backdrop` (Newly available since January 2025) give you a top-layer overlay — tooltips, menus, and dialogs that don't fight `z-index` or get clipped by an ancestor's `overflow: hidden` — without a JavaScript library. `scrollbar-gutter` (Newly available since December 2024) reserves space for the scrollbar so content doesn't shift when one appears. `scrollbar-width` and `scrollbar-color` (Newly and December 2025, respectively) style the scrollbar itself without a vendor-prefixed pseudo-element.

A handful of features are fresh enough that they only crossed into Newly available this year: [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) (March 2026) limits a rule's reach to a subtree without needing a nesting-based selector prefix, `content-visibility` (September 2025) skips rendering work for offscreen content, and `field-sizing` (June 2026) lets a `<textarea>` grow with its content using CSS alone instead of a resize-on-input script. All three are worth knowing about; none of them are old enough yet to reach for without checking your actual traffic's browser mix first.

<style>
.mt-fieldsizing-demo{margin-block:2em;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-fieldsizing-demo__hint{grid-column:1/-1;margin:0;font-size:var(--text-caption);color:var(--ink-subtle);}
.mt-fieldsizing-demo__col{display:grid;gap:var(--space-2);}
.mt-fieldsizing-demo__label{margin:0;font-size:var(--text-caption);font-weight:600;color:var(--ink-subtle);}
.mt-fieldsizing-demo__label code{font-family:var(--font-jetbrains),ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:var(--text-code-inline);color:var(--ink-muted);}
.mt-fieldsizing-demo__textarea{box-sizing:border-box;width:100%;min-height:2.6em;padding:var(--space-2);border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--paper);color:var(--ink);font-family:inherit;font-size:var(--text-caption);line-height:1.4;}
.mt-fieldsizing-demo__textarea--content{field-sizing:content;max-height:12rem;}
@media (max-width:480px){.mt-fieldsizing-demo{grid-template-columns:1fr;}}
</style>
<div class="mt-fieldsizing-demo">
<p class="mt-fieldsizing-demo__hint">Both boxes start the same size. Type enough to wrap a few lines: the left one scrolls (or drag its corner), the right one grows with <code>field-sizing: content</code>.</p>
<div class="mt-fieldsizing-demo__col"><p class="mt-fieldsizing-demo__label">Default sizing</p><textarea class="mt-fieldsizing-demo__textarea" rows="2">Keep typing — this box stays put and scrolls.</textarea></div>
<div class="mt-fieldsizing-demo__col"><p class="mt-fieldsizing-demo__label"><code>field-sizing: content</code></p><textarea class="mt-fieldsizing-demo__textarea mt-fieldsizing-demo__textarea--content" rows="2">Keep typing — this box grows with you.</textarea></div>
</div>

## Where this list comes from

Every date above is the feature's `baseline_low_date` (Newly available) or `baseline_high_date` (Widely available) from the `web-features` package, checked against today. Baseline status keeps moving — several of the "Newly available" features here will flip to "Widely available" on their own 30-month schedule without anything about the feature changing — so treat this as a snapshot, and check [webstatus.dev](https://webstatus.dev/) or the feature's own MDN page before making a final call on a browser-support-sensitive feature.

## Related resources

- [web-features on GitHub](https://github.com/web-platform-dx/web-features) — the dataset this post was built from
- [webstatus.dev](https://webstatus.dev/) — searchable, filterable Baseline status for every feature
- [Baseline on MDN](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) — what "Newly" and "Widely available" actually mean
