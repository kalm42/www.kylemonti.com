---
title: Testing an Astro and TypeScript project with Jest
date: 2026-09-22
excerpt: Astro's import.meta and TypeScript's module settings both fight Jest by default. Here is the configuration that gets them working together.
tags: Astro, TypeScript, Testing
---

Setting up Jest in an Astro project written in TypeScript looks simple until you hit `import.meta.env` inside a test and Jest has no idea what to do with it. Astro's build-time syntax and Jest's Node-based runner do not agree by default, and the fix is a handful of specific files rather than one flag. This assumes a recent Node.js LTS, an existing Astro project in TypeScript, and a passing familiarity with Jest.

## Install the dependencies

```shell
npm install --save-dev jest ts-jest ts-node @types/jest jest-environment-jsdom ts-jest-mock-import-meta
```

That installs `jest` itself, `ts-jest` to let Jest run TypeScript, `ts-node`, `@types/jest` for the matcher types, `jest-environment-jsdom` for a browser-like DOM, and `ts-jest-mock-import-meta` — the piece that makes `import.meta.env` survive inside a test.

## Configure jest.config.ts

```ts title="jest.config.ts"
import type { JestConfigWithTsJest } from "ts-jest"

const tsJestConfig = {
	diagnostics: {
		ignoreCodes: [1343],
	},
	astTransformers: {
		before: [
			{
				path: "ts-jest-mock-import-meta",
				options: {
					metaObjectReplacement: {
						env: {
							MODE: "development",
							PROD: false,
							DEV: true,
							BASE_URL: "/",
							SITE: "http://localhost:4321",
						},
						url: "https://www.url.com",
					},
				},
			},
		],
	},
}

const config: JestConfigWithTsJest = {
	preset: "ts-jest",
	testEnvironment: "./jest.environment.ts",
	collectCoverageFrom: ["src/**/*.{ts}", "!src/**/*.d.ts"],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.ts?$": ["ts-jest", tsJestConfig],
		"^.+\\.tsx?$": ["ts-jest", tsJestConfig],
	},
}

export default config
```

The `astTransformers.before` entry is doing the real work: it swaps every `import.meta` reference for the object under `metaObjectReplacement` before `ts-jest` compiles the file, so `import.meta.env.SITE` resolves to a real string instead of throwing. `diagnostics.ignoreCodes: [1343]` quiets the one TypeScript error that transform otherwise triggers. `moduleNameMapper` should mirror whatever path alias your `tsconfig.json` already declares, and the 90% `coverageThreshold` is a starting point, not a rule — lower it if a given project is not there yet.

## Customize the test environment

```ts title="jest.environment.ts"
import JSDOMEnvironment from "jest-environment-jsdom"

export default class FixJSDOMEnvironment extends JSDOMEnvironment {
	async setup() {
		await super.setup()
		this.global.fetch = fetch
	}
}
```

`jest-environment-jsdom` gives tests a DOM, but it does not carry over Node's global `fetch`. This subclass copies it onto `this.global` during setup, which is enough for components that call `fetch` directly rather than going through a mocked client.

## Adjust tsconfig.json

```json title="tsconfig.json"
{
	"extends": "astro/tsconfigs/strict",
	"compilerOptions": {
		"module": "esnext",
		"verbatimModuleSyntax": false
	}
}
```

Astro's strict preset ships with `verbatimModuleSyntax` on, which is the right default for Astro's own build but breaks `ts-jest`'s module handling. Turning it off here, layered on top of the strict preset rather than replacing it, leaves the rest of the type checking untouched.

## Add a test script

```json title="package.json"
{
	"scripts": {
		"test": "jest --watch"
	}
}
```

With that in place, `npm test` runs the suite in watch mode. Between the transformer swapping out `import.meta`, the custom environment restoring `fetch`, and the relaxed module setting, Jest ends up running against something close enough to Astro's real runtime that the tests are worth trusting.
