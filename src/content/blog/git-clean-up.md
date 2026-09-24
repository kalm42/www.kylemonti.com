---
title: Remove all your local git branches
date: 2019-02-19
excerpt: A one-line command for clearing out every merged and abandoned git branch, plus how to wire it up as an alias.
tags: Git, Shell
---

A few months into any project, `git branch` starts listing branches merged months ago and never deleted. One command clears the whole list out at once.

```shell
git branch | egrep -v "(master|\*)" | xargs git branch -D
```

That removes every branch except `master` (swap in `main` if that's your default) and whichever one you're currently on.

## Turn it into an alias

Typing the full command each time gets old, so I keep it as a git alias instead:

```shell
git config --global alias.clean-branches '!git branch | egrep -v "(master|\*)" | xargs git branch -D'
```

`git clean-branches` now does the same cleanup on demand.

## Keep more branches around

Add more names to the regular expression to protect other branches from deletion, like `develop`:

```shell
git branch | egrep -v "(master|develop|\*)" | xargs git branch -D
```
