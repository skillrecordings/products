---
title: Create new Skill App
description: How to use `create-skill-app` to scaffold a new Skill Application
---

The easiest way to spin up a new Skill App is by using `create-skill-app`. This CLI tool enables you to quickly start building a new Partner Product application, with everything set up for you.

## Setup

First of all you'll need to clone and install [skillrecordings/products](https://github.com/skillrecordings/products) project from GitHub.

### Clone

```bash
git clone https://github.com/skillrecordings/products.git
```

### Install

You'll need [PNPM](https://pnpm.io/) installed.

```bash
npm i pnpm@7.12.2 -g
```

Install all dependencies (all apps and packages) and build all apps and packages

```bash
pnpm install
pnpm build
```

This will build (and cache) the library packages and applications.

{% callout title="Developing an app or package" %}
You can now start an app or package for development:

```bash
cd apps/{{appname}} && pnpm dev
```

```bash
cd packages/{{packagename}} && pnpm dev
```

{% /callout %}

### Link

The latest package version isn't published to NPM and we suggest using `npm link` to run the `create-skill-app` command from anywhere.

```bash
cd packages/create-skill-app && npm link
```

Once that is done, you can technically run `create-skill-app` from anywhere on your machine if you fully-qualify the path, but you're better off running it from `./apps/`.

## Create new Skill App

To get started, use the following command and replace `APPLICATION_NAME` with the _kebab-case_ name of the partner product. ex. `total-typescript`

```bash
# From apps/
create-skill-app APPLICATION_NAME

# From the root...
create-skill-app apps/APPLICATION_NAME
```

The command will ask a series of questions defined [here](https://github.com/skillrecordings/products/blob/main/packages/create-skill-app/index.ts#L51) that fill in the details in the templates.

Once done, you can run `pnpm dev` from within the directory you've created to start development server.
