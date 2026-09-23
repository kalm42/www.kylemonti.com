---
title: Why not to use WordPress
date: 2019-04-09
excerpt: Five reasons WordPress frustrates me as a developer — from an ancient PHP floor to a templating system that needs two diagrams to explain — and one honest concession for when it's still the right call.
tags: WordPress, PHP
---

There are plenty of reasons people give for using WordPress, and my opinion here is just that — an opinion. As with everything computer-related, it depends. If you're excellent with PHP, you can get WordPress to do just about anything you want. This post isn't for you. It's for everyone else — the people who don't already know why so many developers dislike WordPress, myself included.

## 1. A dangerously old PHP floor

WordPress' minimum supported PHP version, as of this writing, is PHP 5.2. It was released on January 6, 2006 — 13 years ago, the same year The Da Vinci Code came out. The PHP group stopped supporting 5.2 on January 6, 2011, the year Thor came out — 8 years of security exploits found and never patched for anyone still running it.

I'm not saying you're on PHP 5.2, or that you'd even know if you were. I'm saying it's bad practice to let users make a choice that bad without knowing it's a choice at all.

## 2. Where in the codebase is X?

You want to change something — anything, it doesn't matter what. Where do you look? The admin dashboard, theme options, a plugin, template code, plugin code, some combination of all four?

A WordPress site can push almost all of its logic into the theme with no plugins at all, or the other way around — heavy on plugins, sparse theme. View and logic aren't cleanly separated either way, which often makes tracking down a bug much harder than it should be.

I've spent hours digging through code only to find a toggle five or six clicks deep in the admin UI that would have fixed it instead. That's unacceptable for software this widely used.

## 3. Coding standards

Maybe that's just me being picky. (It's not.) Mixing object-oriented and functional programming freely through the same codebase isn't a style choice, it's a maintenance cost — and WordPress core does exactly that.

Take this actual function from WordPress core:

```php
function __return_false() {
	return false;
}
```

It's a function that returns `false`. Somewhere, someone needed that badly enough to ship it.

## 4. Templating

I've said it before and I'll say it again: you can build an entire plugin's functionality directly inside a template file. That's a design failure, not a feature.

The templating system is complex enough to need not one but two diagrams to explain it: [a quick visual overview](https://i.stack.imgur.com/c1UYR.png) and [WordPress's own, more detailed version](https://developer.wordpress.org/files/2014/10/template-hierarchy.png).

## 5. A prime hacking target

As the most popular content management system on the internet, WordPress is also the most popular target. Once an exploit surfaces, hundreds of thousands of sites are vulnerable to it at once.

I've watched small sites getting fewer than 50 requests a day suddenly get hit with hundreds of brute-force attacks out of nowhere — worth repeating, these were small, unpopular sites, not high-value targets.

## The good

It's not all bad. Someone with no web development skill at all can still put up a website with it, and if that site needs to do something unusual, there's probably a plugin for it. It won't do that thing well, and it won't do it quickly, but it will do it. When skill and money are both in short supply, that's sometimes good enough.

## Works cited

- [PHP unsupported branches](https://www.php.net/eol.php)
- [WordPress coding standards](https://make.wordpress.org/core/handbook/best-practices/coding-standards/php/)
- [`__return_false()` in the WordPress reference](https://developer.wordpress.org/reference/functions/__return_false/)
- [Template hierarchy, quick version](https://i.stack.imgur.com/c1UYR.png)
- [Template hierarchy, official version](https://developer.wordpress.org/files/2014/10/template-hierarchy.png)
