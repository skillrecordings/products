# turbo-playground

This is an exploratory project using Turborepo and pnpm to create a monorepo working environment for multiple applications and a shared common core library (or set of libraries.



## Get Started

You'll need [pnpm](https://twitter.com/pnpmjs) installed.

pnpm is used here based on [significant performance gains](https://twitter.com/jaredpalmer/status/1422574985323950083?s=20) reported by Jared Palmer from a customer.

```bash
pnpm i
pnpm turbo run build
```

This will build (and cache) the library packages and applications.

You can start the template next.js app:

```bash
cd apps/next-productstarter && pnpm run start
```

## Tools Used

### Turborepo

> abstracting the complex configuration needed for most monorepos into a single cohesive build system

Turbo is the core of the developer experience that this playground is exploring and provides cohesive logical building of a monorepo that contains many apps and library packages.

It's a closed source paid product that we are excited to use and support.

### Lerna

> 🐉 A tool for managing JavaScript projects with multiple packages.

Lerna is being used for library versioning and publishing.

One thing that should be noted is that Jared explcitly recommended not versioning libraries because it makes things more complex versus the monorepo being the "single source of truth", but we need to expot the core libraries for use in projects outside the monorepo and use [semvar](https://semver.org/) to the extent possible.

### Changset

> 🦋 A way to manage your versioning and changelogs with a focus on monorepos

Changeset is an Atlassian library that makes releasing library versions a little nicer.

### pnpm

> Fast, disk space efficient package manager

performant npm is just what it says it is and a modern evolution of npm/yarn etc that follows the same conventions and gives efficiency in a monorepo environment and can shave a lot of time off of builds.

## Resources

Here's a general tour of Turbrepo from Jared:

[![Jared Palmer gives Joel a tour of Turborepo - Watch Video](https://cdn.loom.com/sessions/thumbnails/6be074dc590d44b192ab7e126f04c36b-with-play.gif)](https://www.loom.com/embed/6be074dc590d44b192ab7e126f04c36b)

Some good examples and background in [Jared's TSDX monorepo platground](https://github.com/jaredpalmer/tsdx-monorepo).
