---
title: How to make a CSS gradient
date: 2019-04-30
excerpt: A copy-paste reference for linear-gradient — direction, midpoints, multiple stops, and hard edges instead of blends.
tags: CSS
---

![How to make a CSS gradient](/img/how-to-make-a-css-gradient.png)

The simple top-to-bottom gradient.

```css
.linear-gradient {
	background: linear-gradient(#f23847, #400711);
}
```

Move the midpoint of the gradient with a color hint between the two stops.

```css
.linear-gradient {
	background: linear-gradient(#f23847, 10%, #400711);
}
```

Change direction: left to right.

```css
.linear-gradient {
	background: linear-gradient(to right, #f23847, #400711);
}
```

Right to left.

```css
.linear-gradient {
	background: linear-gradient(to left, #f23847, #400711);
}
```

Diagonal.

```css
.linear-gradient {
	background: linear-gradient(to bottom right, #f23847, #400711);
}
```

The same directions work in degrees, too.

```css
.linear-gradient {
	background: linear-gradient(45deg, #f23847, #400711);
}
```

More than two colors.

```css
.linear-gradient {
	background: linear-gradient(#f23847, #f2bbbf, #400711, #f28888);
}
```

Position each stop precisely, mixing units.

```css
.linear-gradient {
	background: linear-gradient(45deg, #f23847 28px, #f2bbbf 10%, #400711 0.33rem, #f28888 calc(1vw), #f23847);
}
```

Give each color a range instead of a single point, and the blend disappears — hard edges instead.

```css
.linear-gradient {
	background: linear-gradient(#f23847 20%, #f2bbbf 20% 40%, #400711 40% 60%, #f28888 60% 80%, #f23847 80%);
}
```

## Resources

- [Using CSS gradients — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)
