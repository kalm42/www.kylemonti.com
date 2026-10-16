---
title: The four-shadow button
date: 2026-10-16
excerpt: One color, four box-shadows, and three registered custom properties. A highlight, a bevel, a contact shadow, and a glow make a flat button feel like a physical object you want to press, and you can animate every layer.
tags: CSS
---

A flat button with a single `box-shadow` is fine. It's also a little lifeless, because one shadow can only say one thing: "I'm above the page." A button that looks like an object needs to say more. It needs to tell you where the light is, how thick the button is, how far off the surface it sits, and that it's a bright thing in a room.

Four shadows do that, and every one of them is derived from the same button color. No gray, no black at some opacity, no second brand color to keep in sync. Change one variable and the whole button recolors. Because the pieces are CSS variables, you can animate them too, which is where it starts to feel good.

<style>
@property --mt-fs-lift { syntax: "<length>"; inherits: false; initial-value: 4px; }
@property --mt-fs-bevel { syntax: "<length>"; inherits: false; initial-value: 3px; }
@property --mt-fs-glow { syntax: "<percentage>"; inherits: false; initial-value: 6%; }
.mt-fs-btn{--mt-fs-color:#2f7d57;--mt-fs-highlight:color-mix(in oklab,var(--mt-fs-color),white 40%);--mt-fs-shade:color-mix(in oklab,var(--mt-fs-color),black 35%);--mt-fs-contact:color-mix(in oklab,var(--mt-fs-color),black 55%);--mt-fs-halo:color-mix(in oklab,var(--mt-fs-color) var(--mt-fs-glow),transparent);appearance:none;border:0;border-radius:.75rem;padding:.75em 1.5em;font:inherit;font-size:1rem;font-weight:600;color:#fff;background:var(--mt-fs-color);cursor:pointer;box-shadow:inset 0 1px 0 var(--mt-fs-highlight),inset 0 calc(var(--mt-fs-bevel) * -1) 0 var(--mt-fs-shade),0 var(--mt-fs-lift) calc(var(--mt-fs-lift) * 1.5) -2px var(--mt-fs-contact),0 calc(var(--mt-fs-lift) * 2) calc(var(--mt-fs-lift) * 5) var(--mt-fs-halo);transition:--mt-fs-lift .18s ease-out,--mt-fs-bevel .18s ease-out,--mt-fs-glow .25s ease-out,transform .18s ease-out;}
.mt-fs-btn:hover{--mt-fs-lift:6px;--mt-fs-glow:10%;transform:translateY(-1px);}
.mt-fs-btn:active{--mt-fs-lift:1px;--mt-fs-bevel:1px;--mt-fs-glow:3%;transform:translateY(2px);}
.mt-fs-btn:focus-visible{outline:2px solid var(--mt-fs-highlight);outline-offset:3px;}
@media (prefers-reduced-motion:reduce){.mt-fs-btn{transition:none;}.mt-fs-btn:hover,.mt-fs-btn:active{transform:none;}}
</style>
<div class="mt-fs-hero" style="margin-block:2em;display:grid;place-items:center;padding:var(--space-6);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);">
<button type="button" class="mt-fs-btn">Hover me, then press me</button>
</div>

That's the whole finished thing, in about twenty lines of CSS. Here's how it's built.

## The four layers

Each layer is one entry in the `box-shadow` list, and each has a specific job.

1. **Highlight.** A 1px `inset` shadow on the top edge, in a lighter tint of the button color. It's the edge catching light, and it's the cheapest way to make a surface read as slightly rounded instead of printed on.
2. **Bevel.** An `inset` shadow on the bottom edge, in a darker shade of the button color. It reinforces where the light comes from: if the top is bright and the bottom is dark, the light is above. It also gives the button a visible thickness.
3. **Contact shadow.** A tight, fairly dark, barely blurred shadow directly under the button. This is the one a user would call "the shadow." It anchors the button to the surface and tells the eye how far off the page it sits.
4. **Glow.** A soft, wide shadow in the button's own color, at about 6% opacity. Real shiny things bounce a little colored light onto what's near them, and this is a cheap imitation of that. It should be barely there: if you notice it as a glow, it's too strong. You should only notice the button looks lit rather than merely lifted when it's gone.

The order in the list matters. The first shadow in a `box-shadow` list paints on top, so the inset layers sit above the page-level shadows, which is what you want.

```css
.button {
	box-shadow:
		inset 0 1px 0 var(--highlight),
		inset 0 -3px 0 var(--shade),
		0 4px 6px -2px var(--contact),
		0 8px 20px var(--halo);
}
```

Try pulling them apart. Each checkbox turns one layer off, so you can see what that layer is contributing on its own.

<style>
.mt-fs-layers{margin-block:2em;display:grid;gap:var(--space-4);padding:var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-fs-layers__stage{display:grid;place-items:center;padding:var(--space-6) var(--space-4);}
.mt-fs-layers__toggles{display:flex;flex-wrap:wrap;gap:var(--space-2) var(--space-4);justify-content:center;}
.mt-fs-layers__toggle{display:inline-flex;align-items:center;gap:.5em;font-size:var(--text-caption);font-weight:600;color:var(--ink-muted);cursor:pointer;}
.mt-fs-layers:has([name="highlight"]:not(:checked)) .mt-fs-btn{--mt-fs-highlight:transparent;}
.mt-fs-layers:has([name="bevel"]:not(:checked)) .mt-fs-btn{--mt-fs-shade:transparent;}
.mt-fs-layers:has([name="contact"]:not(:checked)) .mt-fs-btn{--mt-fs-contact:transparent;}
.mt-fs-layers:has([name="glow"]:not(:checked)) .mt-fs-btn{--mt-fs-halo:transparent;}
</style>
<div class="mt-fs-layers">
<div class="mt-fs-layers__stage"><button type="button" class="mt-fs-btn">Save changes</button></div>
<div class="mt-fs-layers__toggles">
<label class="mt-fs-layers__toggle"><input type="checkbox" name="highlight" checked> Highlight</label>
<label class="mt-fs-layers__toggle"><input type="checkbox" name="bevel" checked> Bevel</label>
<label class="mt-fs-layers__toggle"><input type="checkbox" name="contact" checked> Contact shadow</label>
<label class="mt-fs-layers__toggle"><input type="checkbox" name="glow" checked> Glow</label>
</div>
</div>

The toggles are pure CSS. A `:has()` selector on the wrapper sees which checkbox is unchecked and sets the matching color variable to `transparent`. It's a nice demonstration of the main point of this post: when every layer reads its color from a variable, turning a layer off, recoloring it, or animating it is one declaration.

## One color in, four colors out

The reason this stays maintainable is `color-mix()`. You set a single `--color` and derive everything else from it:

```css
.button {
	--color: #2f7d57;

	--highlight: color-mix(in oklab, var(--color), white 40%);
	--shade: color-mix(in oklab, var(--color), black 35%);
	--contact: color-mix(in oklab, var(--color), black 55%);
	--halo: color-mix(in oklab, var(--color) var(--glow), transparent);

	background: var(--color);
}
```

Mixing toward white and black _in the same color_ keeps the shadows from going muddy. A pure `rgba(0, 0, 0, 0.3)` shadow under a green button reads as gray dirt. A darker green reads as the same material in shade. Mixing in `oklab` rather than `srgb` keeps the hue steady while the lightness moves, so a blue button doesn't drift toward purple on the way to black.

`oklab` is a rectangular color space: lightness plus two axes, `a` (green to red) and `b` (blue to yellow). Mixing two colors in it is a straight line between them, which is why the shades stay clean. `oklch` describes the same space in polar terms: lightness, chroma (how colorful), and hue as an angle. Both are perceptually uniform, meaning an equal numeric step looks like an equal step to your eye, which `srgb` and `hsl` are not. The difference shows up in how they mix:

- Mixing toward white, black, or `transparent` gives nearly the same result in both spaces, because those colors have no hue to interpolate. The browser just keeps the button's hue and slides lightness and chroma toward the partner.
- Mixing two _different_ hues is where they part ways. `oklch` travels around the hue wheel, so red to green passes through orange and yellow, while `oklab` cuts straight across and heads through a duller, grayer middle. That's why `oklch` is the better pick for gradients, and why it barely matters here, where every mix partner is achromatic.

Since all four shadows mix with an achromatic partner, I use `oklab` and move on. `oklch` earns its place when you want to shift a shade's hue on purpose, say a warmer bevel under a cool button. Its hue is an angle you can do math on, which relative color syntax makes easy:

```css
.button {
	/* Same lightness drop as the bevel, but with the hue rotated 15deg */
	--shade: oklch(from var(--color) calc(l - 0.18) c calc(h + 15));
}
```

The halo is the one that mixes toward `transparent` instead of toward a color. The percentage on `var(--color)` is the glow's opacity, which is what we'll animate in a moment.

Because nothing in the shadow stack names a hue, recoloring is one line:

<style>
.mt-fs-swatches{margin-block:2em;display:flex;flex-wrap:wrap;gap:var(--space-5);justify-content:center;padding:var(--space-6) var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-fs-swatches .mt-fs-btn--blue{--mt-fs-color:#3b5bdb;}
.mt-fs-swatches .mt-fs-btn--amber{--mt-fs-color:#b45309;}
.mt-fs-swatches .mt-fs-btn--plum{--mt-fs-color:#9d2f6b;}
.mt-fs-swatches .mt-fs-btn--slate{--mt-fs-color:#475569;}
</style>
<div class="mt-fs-swatches">
<button type="button" class="mt-fs-btn">Green</button>
<button type="button" class="mt-fs-btn mt-fs-btn--blue">Blue</button>
<button type="button" class="mt-fs-btn mt-fs-btn--amber">Amber</button>
<button type="button" class="mt-fs-btn mt-fs-btn--plum">Plum</button>
<button type="button" class="mt-fs-btn mt-fs-btn--slate">Slate</button>
</div>

```css
.button--blue {
	--color: #3b5bdb;
}
```

## Making it move

Here's the catch that makes the animation part worth explaining. A custom property is just a string until the browser knows what's in it, so this does not animate:

```css
.button {
	--lift: 4px;
	transition: --lift 0.2s;
}

.button:hover {
	--lift: 8px;
}
```

The browser has no idea `--lift` is a length, so it can't interpolate between `4px` and `8px`. It just flips at the end. The fix is `@property`, which registers the variable with a type:

```css
@property --lift {
	syntax: "<length>";
	inherits: false;
	initial-value: 4px;
}

@property --bevel {
	syntax: "<length>";
	inherits: false;
	initial-value: 3px;
}

@property --glow {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 6%;
}
```

Now the three numbers that drive the stack are real, typed values, and they transition like any other property. The shadow stack reads them with `calc()`:

```css
.button {
	box-shadow:
		inset 0 1px 0 var(--highlight),
		inset 0 calc(var(--bevel) * -1) 0 var(--shade),
		0 var(--lift) calc(var(--lift) * 1.5) -2px var(--contact),
		0 calc(var(--lift) * 2) calc(var(--lift) * 5) var(--halo);

	transition:
		--lift 0.18s ease-out,
		--bevel 0.18s ease-out,
		--glow 0.25s ease-out,
		transform 0.18s ease-out;
}
```

One variable, `--lift`, drives both shadows that sit under the button. The contact shadow's offset and blur are `--lift` times a small number, and the glow's are `--lift` times a bigger one. That's how they stay in proportion: raise the button and both grow together, exactly like a real object moving away from a surface.

And with that, the interaction states are three lines each:

```css
.button:hover {
	--lift: 6px;
	--glow: 10%;
	transform: translateY(-1px);
}

.button:active {
	--lift: 1px;
	--bevel: 1px;
	--glow: 3%;
	transform: translateY(2px);
}
```

Hover lifts the button and brightens the glow. Pressing does the opposite: the button sinks toward the surface, so the contact shadow collapses, the glow dims because there's no gap left for light to escape through, and the bevel thins as if the thickness were being squashed. The `translateY` is just a couple of pixels, but without it the press feels like a color change instead of a push.

## Letting the glow breathe

Since `--glow` is a real percentage now, it can also be driven by a keyframe animation. That's handy for a primary call to action that needs to say "over here" without a bouncing arrow:

```css
@keyframes breathe {
	50% {
		--glow: 10%;
	}
}

.button--breathe {
	animation: breathe 2.4s ease-in-out infinite;
}
```

<style>
@keyframes mt-fs-breathe{50%{--mt-fs-glow:10%;}}
.mt-fs-breathe{margin-block:2em;display:grid;place-items:center;padding:var(--space-6) var(--space-4);border:1px solid var(--hairline);border-radius:var(--radius-md);background:var(--paper-sunken);}
.mt-fs-breathe .mt-fs-btn{--mt-fs-color:#3b5bdb;animation:mt-fs-breathe 2.4s ease-in-out infinite;}
.mt-fs-breathe .mt-fs-btn:hover,.mt-fs-breathe .mt-fs-btn:active{animation-play-state:paused;}
@media (prefers-reduced-motion:reduce){.mt-fs-breathe .mt-fs-btn{animation:none;}}
</style>
<div class="mt-fs-breathe">
<button type="button" class="mt-fs-btn">Start free trial</button>
</div>

Only the diffuse halo animates, so it stays calm. The rest of the stack holds still, and the button doesn't move. Pausing the animation on hover and press hands control back to the interaction states, and `prefers-reduced-motion` switches the loop off entirely.

## A few things worth knowing

**Keep the glow under 10%.** The whole stack is meant to be felt, not seen. At 6% the halo is a faint tint; at 10% on hover it's about as loud as it should ever get. Past that it stops reading as reflected light and starts reading as a neon sign. On a dark page, where the black contact shadow nearly vanishes, you can nudge it up a few points, but the same rule applies.

**Keep the bevel hard-edged.** Both inset layers use a blur of `0`. A hard 3px band reads as a physical edge. Blur it and it turns into a fuzzy vignette that makes the button look dirty.

**Don't paint with `filter: drop-shadow()` instead.** It looks similar but can't make inset shadows, and it forces the browser to re-rasterize the element's shape. `box-shadow` is the right tool here.

**Animating shadows costs paint.** Transitioning `box-shadow`, or the variables feeding it, repaints the element on every frame. For one button that's nothing. For a grid of fifty animated buttons, test it. The `transform` part of the interaction is composited and stays cheap either way.

**Watch contrast, not just depth.** The shadows are decoration, so the label has to carry the button on its own. White on the greens, blues, and plums above passes WCAG AA for normal-size text; check the colors you actually ship.

**Fallbacks are mostly graceful.** A browser without `@property` still renders the four-shadow button, since the variables hold plain values; the states just snap instead of easing. `color-mix()` is different: if it's unsupported the derived shadow colors are invalid and drop out, so a `@supports (color: color-mix(in oklab, red, blue))` guard is worth it if you need to support something truly old.

## The whole thing

```css
@property --lift {
	syntax: "<length>";
	inherits: false;
	initial-value: 4px;
}

@property --bevel {
	syntax: "<length>";
	inherits: false;
	initial-value: 3px;
}

@property --glow {
	syntax: "<percentage>";
	inherits: false;
	initial-value: 6%;
}

.button {
	--color: #2f7d57;
	--highlight: color-mix(in oklab, var(--color), white 40%);
	--shade: color-mix(in oklab, var(--color), black 35%);
	--contact: color-mix(in oklab, var(--color), black 55%);
	--halo: color-mix(in oklab, var(--color) var(--glow), transparent);

	appearance: none;
	border: 0;
	border-radius: 0.75rem;
	padding: 0.75em 1.5em;
	font: inherit;
	font-weight: 600;
	color: #fff;
	background: var(--color);
	cursor: pointer;

	box-shadow:
		inset 0 1px 0 var(--highlight),
		inset 0 calc(var(--bevel) * -1) 0 var(--shade),
		0 var(--lift) calc(var(--lift) * 1.5) -2px var(--contact),
		0 calc(var(--lift) * 2) calc(var(--lift) * 5) var(--halo);

	transition:
		--lift 0.18s ease-out,
		--bevel 0.18s ease-out,
		--glow 0.25s ease-out,
		transform 0.18s ease-out;
}

.button:hover {
	--lift: 6px;
	--glow: 10%;
	transform: translateY(-1px);
}

.button:active {
	--lift: 1px;
	--bevel: 1px;
	--glow: 3%;
	transform: translateY(2px);
}

.button:focus-visible {
	outline: 2px solid var(--highlight);
	outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
	.button {
		transition: none;
	}

	.button:hover,
	.button:active {
		transform: none;
	}
}
```

Four shadows, one color, three typed variables. If you only take one thing from it, make it the habit of deriving shadow colors from the thing casting them. It works on cards, inputs, and toggles just as well as buttons.

## Related resources

- [`@property` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) — registering typed custom properties so they can animate
- [`color-mix()` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) — mixing colors in a chosen color space
- [`box-shadow` on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) — inset shadows, spread, and layering order
