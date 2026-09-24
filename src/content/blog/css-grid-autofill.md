---
title: How to fill CSS grid with auto-fitting content
date: 2019-04-09
excerpt: The grid-template-columns line I always forget, plus what actually separates auto-fill from auto-fit.
tags: CSS, HTML, Grid
---

Setting a CSS grid to fill itself with auto-sized columns comes down to one line, and I forget its exact shape every time.

```css
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
```

## Quick breakdown

`grid-template-columns` sets how the columns get built.

`repeat(count, size)` repeats `size` that many times — the argument order that keeps tripping me up, since my brain always wants `(size, count)`.

`auto-fill` and `auto-fit` are easy to mix up. Sara Soueidan draws the line between them better than I can, so I'll quote her directly:

> `auto-fill` FILLS the row with as many columns as it can fit. So it creates implicit columns whenever a new column can fit, because it's trying to FILL the row with as many columns as it can. The newly added columns can and may be empty, but they will still occupy a designated space in the row.

> `auto-fit` FITS the CURRENTLY AVAILABLE columns into the space by expanding them so that they take up any available space. The browser does that after FILLING that extra space with extra columns (as with `auto-fill`) and then collapsing the empty ones.

Her [full breakdown of auto-fill versus auto-fit](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/) on CSS Tricks is worth reading end to end.

`minmax(min, max)` caps each grid item's size between the two: `min` is the smallest it can shrink to, `max` is the largest it can grow to.

## Related resources

- [CSS grid — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid)
- [CSS repeat — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat)
- [Auto-fill vs auto-fit — CSS Tricks](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)
- [Complete guide to grid — CSS Tricks](https://css-tricks.com/snippets/css/complete-guide-grid/)
