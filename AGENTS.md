<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Code standards

Before planning, editing, or reviewing application code, read
`~/.codex/standards/code-architecture.md` and follow these project rules:

- Keep components and functions small, with one concern each.
- Prefer one component or function per file. Keep closely coupled local helpers or types in the same file when splitting them would make the code harder to follow.
- Put utilities used by multiple features in a `shared/` directory. Keep feature-specific utilities with their feature.
- Give each component a named props type using `ComponentNameProps` (for example, `HeroCardProps` for `HeroCard`).
- Accept props as `props: ComponentNameProps`; destructure them on the first line of the function body, never in the function signature.
- Define types by name. Do not write inline type shapes in function signatures, props, or annotations.
- Validate external data with Zod where it is fetched or received, before passing it to components or domain code. This includes first-party API responses.
- Make each Zod schema the source of truth for its validated data type. Derive the TypeScript type with `z.infer<typeof Schema>` instead of maintaining a duplicate type or interface.

## Testing

Read and follow [TESTING.md](./TESTING.md) when writing or changing Vitest or Playwright tests.
