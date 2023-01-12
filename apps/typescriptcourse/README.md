### Install Dependencies

Install all of the dependencies for the entire monorepo by running the following command:

```shell
pnpm install
```

⭐️ `pnpm install` can be run from any folder in the monorepo and it will install the dependencies for all projects and apps in the monorepo.

### Configure your Dev Environment

#### Dev Environment Configuration

All non-secret configuration will happen in the `.env.development` file. By and large, these values can be left as is and should provide the necessary configuration for running the app locally.

The rest of the dev environment setup is described in the following _Prisma_ and _Development Secrets_ sections.

#### Prisma

👋 `.env` is **required by Prisma** and **only** contains `DATABASE_URL`. The full contents
of this file by default are:

```shell
DATABASE_URL=mysql://root@127.0.0.1:3309/typescript-course
```

#### Development Secrets

Some of the most crucial parts of the dev environment are secret values/keys/tokens for test and sandbox environments with 3rd-party services. For instance, running through the commerce flow in development requires a Stripe secret token.

We store all of these values in Vercel. Assuming you have already logged in via the `vercel` CLI (`vercel login`) and linked the project (`vercel link`), then you can pull down the development environment variables:

```bash
pnpm dev:setup
```

This will write to the `.env.local` file. This file should never be checked in.

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

The app will be served at `http://localhost:3015`.

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

The first time you run this command it will seed the database with the contents of `apps/typescriptcourse/seed_data`

If you want to reset the database, open docker, delete the container **and** the associated image. Otherwise nothing will be changed with the database when you run the above command but it will be running normally in the background.

The database can be stopped and started from the Docker dashboard.

⭐️ Note: the default `username` for this MySQL instance is `root` and the `password` is blank.

#### Connect to local MySQL database

You can use [Table Plus](https://tableplus.com/) or _any other MySQL client_ to connect to and manage the database. In Table Plus:

- Select "Add new data source"
- Select "MySQL"
- Input credentials
  - Name: TypeScript Course
  - Host: 127.0.0.1; Port: 3309
  - User: root
  - Database: typescript-course
- Then you can test your connection, save it and view the tables.

## Edit content

Edit workshops with Sanity at [typescriptcourse.sanity.studio](https://typescriptcourse.sanity.studio/).

## Stripe

The server-side packages will need the `STRIPE_SECRET_TOKEN` and `STRIPE_WEBHOOK_SECRET` defined in the environment for Stripe to work for the commerce flows.

For development, these values you should live in the `.env.local` file which comes from running `pnpm dev:setup`.

The correct test-mode Stripe secret token should already be in `.env.local` if you pulled down the environment variables from Vercel.

After confirming you have `STRIPE_SECRET_TOKEN` set, you can generate the value for `STRIPE_WEBHOOK_SECRET` by running the Stripe CLI's webhook listener.

Run this command to start the webhook listener/proxy:

```
stripe listen --forward-to localhost:3015/api/skill/webhook/stripe
```

Now it is listening for Stripe Webhook events. When it first starts, it will output a _webhook signing secret_ (`whsec_....`). You'll need to copy and paste this value into `.env.local` as the `STRIPE_WEBHOOK_SECRET`. It is required to make test purchases. (It will proactively guide you if the value isn't currently configured properly.)
