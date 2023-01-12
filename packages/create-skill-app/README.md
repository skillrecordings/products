# Create Skill App

If you don't want to publish and use current package version `npm link` in `packages/create-skill-app` folder and then run `create-skill-app` command from anywhere.

```bash
cd packages/create-skill-app && npm link
```

Once that is done, you can technically run `create-skill-app` from anywhere on your machine if you fully-qualify the path, but you're better off running it from `./apps/`.

## Create a New App

The easiest way to spin up a new Skill App is by using `create-skill-app`. This CLI tool enables you to quickly start building a new Partner Product application, with everything set up for you.

To get started, use the following command and replace `APPLICATION_NAME` with the *kebab-case* name of the partner product. ex. `testing-accessibility`

```bash
# From apps/
create-skill-app APPLICATION_NAME

# From the root...
create-skill-app apps/APPLICATION_NAME
```

## Options

Other than specifying the application folder name, there are no options. The command will ask a series of questions defined in `packages/create-skill-app/index.ts` that fill in the details in the templates.

## Development

For development/modification purposes:

```bash
# From /packages/create-skill-app
pnpm dev

# From /apps, you can run the following to generate and re-generate (`apps/skill-template` is .gitignore'd)
rm -rf skill-template && create-skill-app skill-template
```

Reference: [How to develop with and add to `create-skill-app` (Roam link and Loom)](https://roamresearch.com/#/app/egghead/page/7rnK6_w8U)
