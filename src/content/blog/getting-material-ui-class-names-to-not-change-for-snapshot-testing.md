---
title: Getting Material-UI class names to not change for snapshot testing
date: 2020-06-19
excerpt: The one option that turns Material-UI's non-deterministic class names deterministic, so snapshot tests stop breaking on every rebuild.
tags: Material-UI, Testing
---

Without a `name` option, Material-UI's `makeStyles` appends a random number to every class name, so a snapshot test fails on each rebuild even though nothing actually changed. A colleague of mine tracked down the fix, and I'm writing it here mostly for my own future reference: give the styles a `name` that starts with `Mui`.

```javascript
const useStyles = makeStyles(
	{
		root: {/* … */},
		label: {/* … */},
		outlined: {
			/* … */
			"&$disabled": {/* … */},
		},
		outlinedPrimary: {
			/* … */
			"&:hover": {/* … */},
		},
		disabled: {},
	},
	{ name: "MuiButton" },
)
```

That example comes straight from the [Material-UI advanced styles guide](https://material-ui.com/styles/advanced/#with-material-ui-core). With a `Mui`-prefixed name in place, the generated class names stay the same between builds, and the snapshots stop drifting.

Credit for finding this goes to [a colleague of mine](https://linktr.ee/_natural_e).
