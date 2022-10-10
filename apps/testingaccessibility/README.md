# Testing Accessibility 

The working directory for this project is the same folder the README you are reading right now is located. All commands assume you are in the `{PROJECT_ROOT}/apps/testingaccessibility` in your console.

```shell
cd apps/testingaccessibility
```

## Validate your local environment

You need to ensure that you have all of the necessary system-level dependencies installed.

From `apps/testingaccessibility` you can run the following command to validate your environment:

```shell
bin/validate
```

Missing system dependencies should be installed. They will be assumed below.

## Serverless Access

You may need access to the following serverless accounts to run the app:
- Stripe (for Stripe env vars and Stripe CLI)
- Vercel (for env vars, e.g. `POSTMARK_KEY`)
- Planetscale (if needed) or use MySQL in Docker

## Install Dependencies, Build, and Test

### Install Dependencies

Install all of the dependencies for the entire monorepo by running the following command:

```shell
pnpm install
```

⭐️ `pnpm install` can be run from any folder in the monorepo and it will install the dependencies for all projects and apps in the monorepo.

### Configure your Dev Environment

Copy the template `.env.local.template` file to `.env.local` and `.env.template` to `.env`

🔒 `env.local` contains local __private environment variables__

* `ALGOLIA_API_WRITE_KEY`: Required to build the project with both `build` and `build:dev`.
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

### Build the App

Now build the app and all dependencies with the following command:

```shell
pnpm build:dev
```

This command will also `test` and `lint` the project. If you run into errors at this step, they should be addressed.

## Run the App Locally

At this point you successfully built the app without any errors, then you should be able to run it locally.

```shell
pnpm dev
```

The app will be served at `http://localhost:3013`.

You won't be able to do much without setting up a few other dependencies.

## Other App Development Dependencies

### Database

Locally we use MySQL via Docker **or** Planetscale. In production we use Planetscale. Planetscale has a CLI and this is required if you are making changes to the database schema that need to be propogated to production databases via a branch.

#### Dependencies

You'll need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/) in order to run MySQL with Docker.

#### Database URL

If you didn't already, make sure the `.env` file is availabe with the `DATABASE_URL` env var set.

See [Configure your Dev Environment](#configure-your-dev-environment) for the details.

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

Note: the default `username` for this MySQL instance is `root` and the `password` is blank.

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

## Authentication (dev)

To receive "magic link" emails you'll need a database configured and a valid postmark key.

👋 The magic links are logged to the developer console as well so you don't need Postmark configured to simply log in to the app.

⛔️ You can only log in if you have a `User` with the email you are trying to use in the database.

### Postmark

A Postmark API key is required to send email from your local environment. It is located in 1password or via Postmark and can be added to `.env.local`.

### Stripe CLI

#### Installation

You'll need to install the [Stripe CLI](https://stripe.com/docs/stripe-cli) to capture web hooks locally and make test purchases.

#### Login

If you've just installed the Stripe CLI (or just been granted access to this Stripe account), you'll need to login via the commandline. Run `stripe login` and follow the prompts to connect your `stripe` CLI to the Testing Accessibility Stripe account. To confirm your connection, you should see a _Restricted Keys_ entry for your machine in the _Developers_ > _API Keys_ section of the Stripe Dashboard.

#### Listening to Webhook Events

Listen to webhook:

```shell
pnpm dev:stripe
```

The `dev:stripe` node script is a shorthand for `stripe listen --forward-to localhost:3013/api/skill/webhook/stripe`.

`pnpm dev:stripe` starts listening for Stripe Webhook events. When it first starts, it will output a _webhook signing secret_ (`whsec_....`). You'll need to copy and paste this value into `.env.local` as the `STRIPE_WEBHOOK_SECRET`. It is required to make test purchases

👋 If you aren't listening to webhooks you can still make a purchase but your local environment will not be notified!

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

#### Minimal Seed Data

You can seed your branch with the basics that are associated with the **test mode** Stripe account. Those seeds are located in `seed_data`.

```bash
pscale database restore-dump testing-accessibility next-steps --dir ./seed_data
```

#### Production-like Seed Data

You can locally dump a copy of the `main` branch using `pscale database dump`:

```bash
pscale database dump testing-accessibility main --output ./seed_data/pscale_data_dump
```

Now the `seed_data/pscale_data_dump` folder holds a database dump you can restore to your branch:

```bash
pscale database restore-dump testing-accessibility next-steps --dir ./seed_data/pscale_data_dump --overwrite-tables
```

## Edit content

Edit workshops with Sanity at [testingaccessibility.sanity.studio](https://testingaccessibility.sanity.studio/).
