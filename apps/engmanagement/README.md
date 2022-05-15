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

### Stripe CLI

You'll need the [Stripe CLI](https://stripe.com/docs/stripe-cli) to capture web hooks locally.

When you run the CLI it gives you your webhook signing secret that you can set in `.env.local`.

The Stripe test secret token is also required!

see: `.env.local.template`

Listen to webhook:

```bash
stripe listen --forward-to localhost:3013/api/stripe/webhook
```

### Postmark

A `POSTMARK_KEY` should be added to your `.env.local` to send email. 

You can find one for this project in the vercel environment variables.

Postmark uses standard (public) values for  `EMAIL_SERVER_HOST` and `EMAIL_SERVER_PORT` so these are committed in `.env.development` and `.env.production`

The email server is configured for `next-auth` with `EmailProvider`

```js
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.POSTMARK_KEY,
          pass: process.env.POSTMARK_KEY,
        },
      },
```
## Authentication in Development

We are using Prisma+next-auth for authentication. With Postmark set

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
DATABASE_URL='mysql://root@127.0.0.1:3309/engineering-management'
```

### Connect to the Planetscale database

```bash
pscale connect engineering-management $DEV_BRANCH_NAME --port 3309
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
pscale database restore-dump engineering-management $DEV_BRANCH_NAME --dir ./seed_data/pscale_data_dump
```

This should set up the basics that are associated with the **test mode** Stripe account
