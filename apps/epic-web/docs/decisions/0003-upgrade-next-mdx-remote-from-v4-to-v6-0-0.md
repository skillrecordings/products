---
status: accepted
date: 2026-02-20
decision-makers: cree
---

# Upgrade next-mdx-remote from v4 to v6.0.0

## Context and Problem Statement

The monorepo's apps (epic-web, total-typescript, epic-react, badass) and the shared `@skillrecordings/skill-lesson` package all use `next-mdx-remote` v4.x for MDX serialization and rendering. The upstream course-builder repository has already shipped the upgrade to v6.0.0 ([commit 35cce1f](https://github.com/badass-courses/course-builder/commit/35cce1f6e24821fdbf5a44057f13ce0de0be2cd5)). Our apps need to align.

Version 6.0.0 introduces a critical security change: JavaScript expressions in MDX are now **blocked by default** via `blockJS: true`. This addresses a [remote code execution vulnerability](https://cybersecuritynews.com/vulnerability-in-next-mdx-remote/) where untrusted MDX content could execute arbitrary JS during server-side rendering. All apps in this monorepo render MDX content that uses JS expressions (component interpolation, variable references), so they must opt in with `blockJS: false` after upgrading.

### Current versions

| Package / App | Current Version |
|---|---|
| `packages/skill-lesson` | `=4.4.1` |
| `apps/epic-web` | `=4.4.1` |
| `apps/total-typescript` | `=4.4.1` |
| `apps/epic-react` | `^4.1.0` |
| `apps/badass` | `=4.4.1` |

### Version jump: v4 → v5 → v6

- **v4 → v5**: Updated to MDX v3, added React 19 support, removed Rollup. The `serialize()` function and client-side `<MDXRemote>` component are **preserved** — the v4 API pattern still works.
- **v5 → v6**: Introduced `blockJS` and `blockDangerousJS` parameters (both default to `true`). Updated `unist-util-remove` to `^4.0.0`.

## Decision

Upgrade `next-mdx-remote` from v4.x to `6.0.0` across all four apps and the shared `skill-lesson` package. Keep the existing serialize/hydrate architecture. Add `blockJS: false` to all serialization calls since our MDX content is trusted (authored by us) and uses JS expressions.

## Consequences

### Positive

- Aligns with upstream course-builder, reducing drift
- Picks up MDX v3 improvements (better error messages, faster compilation)
- Gains React 19 compatibility
- Addresses the JS expression security vulnerability with explicit opt-in
- Single shared fix in `serializeMDX` wrapper covers the majority of call sites

### Negative

- Risk of remark/rehype plugin incompatibility with MDX v3 (particularly `remark-code-hike` and `shiki-twoslash-plugin`)
- `useDynamicImport` option used in skill-lesson may be deprecated or removed — needs verification
- Four apps to test; regressions could appear in any of them

### Follow-up tasks

- Verify `remark-code-hike` compatibility with MDX v3
- Verify `shiki-twoslash-plugin` compatibility with MDX v3
- Verify `useDynamicImport` option still works in v6 (remove if deprecated)
- Verify `MDXRemoteSerializeResult` type still exported from v6

## Non-goals

- **Not** migrating from serialize/hydrate to the RSC `<MDXRemote source={string}>` pattern from `next-mdx-remote/rsc`. That would be a much larger rewrite touching 60+ files across all apps.
- **Not** changing `blockDangerousJS` — keeping the default (`true`) which blocks dangerous globals like `eval`, `Function`, `process`, `require` even when `blockJS: false`.

## Implementation Plan

### 1. Update `packages/skill-lesson` (covers most usage)

**`packages/skill-lesson/package.json`** — bump version:
```diff
- "next-mdx-remote": "=4.4.1"
+ "next-mdx-remote": "6.0.0"
```

**`packages/skill-lesson/markdown/serialize-mdx.ts`** — add `blockJS: false` to the `serialize()` call. This is the centralized wrapper used by all four apps:
```diff
 serialize(text, {
   scope,
+  blockJS: false,
   mdxOptions: {
     useDynamicImport: true,
```

If `useDynamicImport` is removed in v6, delete that line.

### 2. Update `apps/epic-web`

**`apps/epic-web/package.json`** — bump version:
```diff
- "next-mdx-remote": "=4.4.1"
+ "next-mdx-remote": "6.0.0"
```

**`src/pages/workshops/[module]/[section]/[lesson]/index.tsx`** — direct `serialize()` call, add `blockJS: false`:
```diff
 const serialized = await serialize(lesson.body, {
+  blockJS: false,
   mdxOptions: {
     rehypePlugins: [
```

Check for any other direct `serialize()` calls in `src/pages/tutorials/` lesson pages (same pattern).

### 3. Update `apps/total-typescript`

**`apps/total-typescript/package.json`** — bump version.

**`src/pages/newsletter/[slug].tsx`** — direct `serialize()` call, add `blockJS: false`:
```diff
 await serialize(content, {
+  blockJS: false,
   scope: {...data, subscriber: 'there'}
 })
```

### 4. Update `apps/epic-react`

**`apps/epic-react/package.json`** — bump version:
```diff
- "next-mdx-remote": "^4.1.0"
+ "next-mdx-remote": "6.0.0"
```

**`src/templates/article-template.tsx`** — uses `<MDXRemote>` directly. No change needed here since the component receives pre-serialized data (blockJS is a serialization-time option, not render-time).

### 5. Update `apps/badass`

**`apps/badass/package.json`** — bump version. No direct `serialize()` calls — all usage goes through the `serializeMDX` wrapper, so the skill-lesson update covers it.

### 6. Install and verify

```bash
pnpm install
```

Build each app and verify MDX rendering:
```bash
pnpm --filter epic-web build
pnpm --filter total-typescript build
pnpm --filter epic-react build
pnpm --filter badass build
```

## Verification

- [ ] `pnpm install` succeeds with no peer dependency conflicts
- [ ] `packages/skill-lesson` builds without type errors
- [ ] `apps/epic-web` builds successfully
- [ ] `apps/total-typescript` builds successfully
- [ ] `apps/epic-react` builds successfully
- [ ] `apps/badass` builds successfully
- [ ] MDX content with JS expressions (component interpolation like `<Test />`, variable references like `{title}`) renders correctly on epic-web
- [ ] Syntax highlighting (remark-code-hike) still works on lesson/workshop pages
- [ ] `MDXRemoteSerializeResult` type resolves without errors
- [ ] No console errors or hydration mismatches in browser

## More Information

- Upstream commit: [badass-courses/course-builder@35cce1f](https://github.com/badass-courses/course-builder/commit/35cce1f6e24821fdbf5a44057f13ce0de0be2cd5)
- [next-mdx-remote v6.0.0 release notes](https://github.com/hashicorp/next-mdx-remote/releases/tag/v6.0.0)
- [next-mdx-remote repository](https://github.com/hashicorp/next-mdx-remote)
- [Security vulnerability context](https://cybersecuritynews.com/vulnerability-in-next-mdx-remote/)
