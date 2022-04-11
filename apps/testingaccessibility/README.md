## Edit content

Edit workshops with Sanity at [testingaccessibility.sanity.studio](https://testingaccessibility.sanity.studio/).

## Start developing

Copy the template `.env.template` file to `.env.local`.

```shell
cp .env.template .env.local
```

`.env.local` will need new values for every variable.

Check Vercel for Github and Google secrets needed for authentication system.

Then install dependencies and start the server.

```shell
pnpm i
pnpm dev
```

## Authentication in Development

We are using Hasura+next-auth for authentication via JWTs. You'll need to get it running locally!

### Install Tools

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

### Seed Data

When you make a new branch in Planetscale it doesn't bring data over.

In the `seed_data` folder is a database dump.

```bash
pscale database restore-dump testing-accessibility next-steps --dir ./seed_data/pscale_data_dump
```

This should set up the basics that are associated with the **test mode** Stripe account


