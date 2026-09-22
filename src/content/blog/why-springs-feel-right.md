---
title: Why springs feel right
date: 2026-02-02
excerpt: The physics behind interfaces that feel unhurried, and where a linear curve still wins.
tags: Motion
---

Most interface motion is trying to imitate one of two physical stories: something being pushed, or something settling back into place after being pushed. A linear curve tells neither story — it is a metronome, constant velocity from first frame to last, which is exactly why it reads as mechanical rather than physical. Nothing in the world you can touch moves at a constant speed and then simply stops.

`cubic-bezier` easing is a cheap, convincing approximation of that second story: an object leaving a rest state, then settling back into one.

```css
/* Fast start, long soft landing — the site's default */
.ease-glide {
	transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

/* Symmetric — for things trading places, like a nav indicator */
.ease-settle {
	transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
}
```

`ease-glide` front-loads the motion: most of the distance covers in the first third of the duration, then the curve spends the remaining two-thirds gently decelerating into rest. That asymmetry is what a hand does when it reaches for something — quick to commit, careful on arrival — and it is why a card that lifts on hover with `ease-glide` reads as considered rather than jumpy.

> [!NOTE] Curves are not springs
> A `cubic-bezier` curve always completes in a fixed duration regardless of velocity at interruption. A true spring model — mass, stiffness, damping — responds to how fast the previous animation was moving when you interrupt it. For hover and press states, a fixed-duration curve is indistinguishable from a spring and costs far less to reason about.

## Where the metronome still wins

None of this means linear timing is wrong everywhere. Two places it is the right choice on this site:

1. Colour and opacity changes, which should read as instant rather than eased — a `duration-fast` linear fade avoids the slight "swimming" a bezier curve gives to a colour transition.
2. A repeating pulse, like the live-status dot, where a constant rhythm is the entire point of the animation.

The rule is not "curves good, linear bad." It is that motion should match the physical story you are telling. A button lifting off the page is being pushed and settling — that is `ease-glide`. A dot indicating "this is live, right now" is a heartbeat, not a gesture — that stays linear.

---

Overshoot — the `ease-spring` curve, which travels slightly past its target before settling back — is reserved for confirmations only, like the copy button's checkmark. It borrows the physical vocabulary of a spring that has slightly too much energy, and using it anywhere motion should feel calm would undercut the rest of the system's restraint.
