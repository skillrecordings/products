# Testing Accessibility 

## Validate your local environment

You need to ensure that you have all of the necessary system-level dependencies installed.

From `apps/testingaccessibility` you can run the following command to validate your environment:

```shell
bin/validate
```

Missing system dependencies should be installed. They will be assumed below.

## Install Dependencies, Build, and Test

From the root of the project install all of the dependencies for the entire monorepo by running the following command:

```shell
pnpm install
```

Now build all projects and dependencies with the following command:

```shell
pnpm build:dev
```

This command will also `test` and `lint` each project. If you run into errors at this step, they should be addressed.

## Configure your Dev Environment

The working directory for this project is the same folder the README you are reading right now is located. All commands assume you are in the `{PROJECT_ROOT}/apps/testingaccessibility` in your console.

```shell
cd app/testingaccessibility
```

Copy the template `.env.local.template` file to `.env.local` and `.env.template` to `.env`

🔒 `env.local` contain local __private environment variables__

* `CONVERTKIT_API_SECRET`: not required for local development unless actively working on ConvertKit integration. Can be found in 1password.
* `POSTMARK_KEY`: not required to run in dev, but enables email sending from local environment. Can be found in 1password.
* `STRIPE_SECRET_TOKEN`: Not required unless you need to make an end to end purchase. Can be found in 1password.
* `STRIPE_WEBHOOK_SECRET`: Not required unless you need to make a purchase. This value can be acquired by running `pnpm dev:stripe` and observing it there. The value is stable for your local `stripe` cli installation.

👋 `.env` is **required by Prisma** and **only** contains `DATABASE_URL`. The full contents
of this file by default are are:

```shell
DATABASE_URL="mysql://root@localhost:3309/testing-accessibility"
```

You can use the provided templates. These files are ignored by git because they should **never be committed to the repository under any circumstances.**

```shell
cp .env.local.template .env.local
cp .env.template .env
```

`.env.local` will need new values for every variable.

#### Install Dependencies

Then install dependencies and start the dev server.

```shell
pnpm install
```

⭐️ `pnpm install` can be run from any folder in the monorepo and it will install the dependencies for all projects and apps in the monorepo.

### Database

Locally we use MySQL via Docker **or** Planetscale. In production we use Planetscale. Planetscale has a CLI and this is required if you are making changes to the database schema that need to be propogated to production databases via a branch.

#### Using MySQL

To run MySQL (via Docker) execute the following command:

```shell
pnpm db:start
pnpm db:push
```

This starts the MySQL container (running on port `3309`) and applies any schema changes as needed.

The first time you run this command it will seed the database with the contents of `apps/testingaccessibility/seed_data`

If you want to reset the database, open docker, delete the container **and** the associated image. Otherwise nothing will be changed with the database when you run the above command but it will be running normally in the background.

The database can be stopped and started from the Docker dashboard.

#### Using Planetscale

If you need to utilize the Planetscale CLI use the following command:

```bash
brew install planetscale/tap/pscale
```

You'll need to login:

```bash
pscale auth login
```

And then switch to skill-recordings org:

```bash
pscale org switch skill-recordings
```

Finally run the database:

```bash
pscale connect testing-accessibility BRANCH_NAME --port 3309
```

The production database runs on the `main` branch. Use the production database with caution!

## Run the App Locally

If you're all set up 😅 you can run the app locally:

## Authentication (dev)

To receive "magic link" emails you'll need a database configured and a valid postmark key.

👋 The magic links are logged to the developer console as well so you don't need Postmark configured to simply log in to the app.

⛔️ You can only log in if you have a `User` with the email you are trying to use in the database.

### Postmark

A Postmark API key is required to send email from your local environment. It is located in 1password or via Postmark and can be added to `.env.local`.

### Stripe CLI

You'll need to install the [Stripe CLI](https://stripe.com/docs/stripe-cli) to capture web hooks locally and make test purchases.

`stripe listen --forward-to localhost:3013/api/skill/webhook/stripe`

`pnpm dev:stripe` starts listening for Stripe Webhook events. This will also produce the value for `STRIPE_WEBHOOK_SECRET` in `.env.local` that is required to make test purchases

Listen to webhook:

```shell
pnpm dev:stripe
```

👋 If you aren't listening to webhooks you can still make a purchase but your local environment will not be notified!

### Create a .env

Prisma looks here by default for the connection URL:

```bash
DATABASE_URL='mysql://root@127.0.0.1:3309/testing-accessibility'
```

### Connect to the Planetscale database

```bash
pscale connect testing-accessibility next-steps --port 3309
```

### Migrate any schema changes

If you make changes to the schema via Prisma you'll need to push it to the DB. We don't use Prisma migrations and let Planetscale handle it:

```bash
npx prisma db push
```

### Prisma studio

Start prisma studio:

```bash
npx prisma studio
```

### Seed Data

When you make a new branch in Planetscale it doesn't bring data over.

In the `seed_data` folder is a database dump.

```bash
pscale database restore-dump testing-accessibility next-steps --dir ./seed_data/pscale_data_dump
```

This should set up the basics that are associated with the **test mode** Stripe account

## Edit content

Edit workshops with Sanity at [testingaccessibility.sanity.studio](https://testingaccessibility.sanity.studio/).