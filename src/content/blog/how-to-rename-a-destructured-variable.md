---
title: How to rename a destructured variable
date: 2019-09-22
excerpt: Wes Bos's trick for renaming a property on the way out of a destructuring assignment.
tags: JavaScript
---

This pattern comes from [Wes Bos's lesson on destructuring and renaming](https://wesbos.com/destructuring-renaming) — his tutorials are worth a look if this is useful to you.

The object to destructure:

```javascript
const person = {
	name: "John Snow",
	knows: null,
	alive: undefined,
	social: { facebook: "johnoftheblack", twitter: "thekinginthenorth" },
}
```

Renaming a property while destructuring it just adds a colon and the new name:

```javascript
const { facebook: fb, twitter: tweet } = person.social
```
