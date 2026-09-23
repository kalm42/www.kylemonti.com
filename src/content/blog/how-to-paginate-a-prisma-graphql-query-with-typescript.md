---
title: How to paginate a Prisma GraphQL query with TypeScript
date: 2020-07-26
excerpt: Wrapping a Prisma-backed GraphQL query in a paginated type, with page metadata computed in the resolver.
tags: Prisma, GraphQL, TypeScript
---

The short version: add the metadata in the resolver, and add a new type in GraphQL to return it.

This builds on [an old post from Prisma's community forum on adding pagination to lists](https://v1.prisma.io/forum/t/adding-pagination-to-lists-on-objects/4354/2), expanded here in more detail and ported to TypeScript.

## Things to do

- Add two new types to the GraphQL type definitions
- Update the query's GraphQL type definition
- Update the resolver

## New type defs

This example uses posts as the data being returned.

```graphql
type Post {
	id: String!
	slug: String!
	text: String!
	isPublished: Boolean!
}

type PaginatedPosts {
	nodes: [Post!]!
	meta: PaginatedPostsMeta!
}

type PaginatedPostsMeta {
	nodeCount: Int!
	pageCount: Int!
	pageCurrent: Int!
	nodesPerPage: Int!
}
```

These wrap the normal array-of-posts response in a shape that also carries the pagination metadata.

## Update query

The query definition needs to return the new type instead of a bare array:

```graphql
posts(page: Int!): PaginatedPosts!
```

## Update resolver

```typescript
import { Prisma } from "../prisma/generated/prisma-client"

interface PostsArgs {
	page: number
}

interface Context {
	db: Prisma
}

function posts(parent, args: PostsArgs, ctx: Context) {
	const { page } = args
	const PAGE_SIZE = 10
	const where = { where: { isPublished: true } }

	return {
		nodes: ctx.db.posts({
			...where,
			orderBy: "createdAt_DESC",
			first: PAGE_SIZE,
			skip: page * PAGE_SIZE,
		}),
		meta: async () => {
			const count = await ctx.db.postsConnection(where).aggregate().count()

			return {
				nodeCount: count,
				pageCount: Math.ceil(count / PAGE_SIZE),
				pageCurrent: (page * PAGE_SIZE) / PAGE_SIZE,
				nodesPerPage: PAGE_SIZE,
			}
		},
	}
}
```

`nodes` runs the actual paginated query, and `meta` runs alongside it as its own resolver, using the same `where` clause to count the full set and work out how many pages it spans.
