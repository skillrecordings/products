# This is a starting point for a Skill Recordings Product.

It was generated using `create-skill-app` and is meant as a starting point for a Skill Recordings Product. As a starting point, it is incomplete and there are several chores left to do.

## Update the environment variables

Both `.env.development` and `.env.production` files are used to store environment variables. They have some basic default values that need to be updated for the product and client. This would be a lot better if they were generated with the answers to questions when you run `create-skill-app`, but that isn't the case today.  Feel free to add it!

- [ ] Update `.env.development` and `.env.production` with real values
- [ ] Copy `.env.development.local.example` to `env.development.local` and populate any needed real values

## Database

There is a `docker-compose.yml` file that is used to run the database. It is configured to run on port `3306` and is named `skill-recordings-product-db`. You'll might want to change these. When changing the port value, the FIRST entry is your "host" machine, so change that one. `3306` is the default port for MySQL and the docker container uses that port internally so this change maps a port from your computer (the host) to the port that the container uses.

The `.env` is used by prisma to access the `DATABASE_URL` env variable. It can't be accessed from the other env variable files and only Prisma uses it. 🆒


### The actual data

There are some SQL files in the `seed_data` directory and when you run `docker compose up` they will be loaded into the database.

⛔️ the seed data **isn't complete**. Stripe identifiers have been stripped out, prices are incorrect, etc. This isn't really a big deal and it will run, but it's worth noting. You can always delete the local database and reseed it when these values are available!

## Auth

`next-auth` is configured in a basic way. `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, and `POSTMARK_KEY` all need to be available for the magic link email to work. The `NEXTAUTH_URL` and `NEXTAUTH_SECRET` also need to be set. 

Don't leak the Postmark key or `next-auth` secrets. Use `.env.local` for that sort of thing and make sure it doesn't get committed.

Definitely needs templates.

- [ ] update all the env variables for auth

## Sanity

Sanity Studio needs to be added for the project. Sanity has its own templates, but we can also consider templating our own for this process since it's standard. For now this is still cut and paste and some pages (`/articles/**`) will not function.

Sanity needs `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET_ID`, and `NEXT_PUBLIC_SANITY_API_VERSION` to be set.

## Monitoring

Sentry is not connected yet.

`HONEYCOMB_WRITE_KEY` needs to be set in `.env.local` and on the server for that to function. It's used for tracing and writes to the `skillrecordings` dataset acrss accounts.

- [ ] update `HONEYCOMB_WRITE_KEY` in `.env.local`

## Stripe

The `STRIPE_SECRET_TOKEN` (test) must be set in `.env.local` for commerce to function. 

- [ ] update `STRIPE_SECRET_TOKEN` in `.env.local`

## React Email

If you want to run the dev server with `react-email`, you have to opt-in to
that by include the `WITH_EMAIL` environment variable like so:

```bash
$ WITH_EMAIL=TRUE pnpm dev
```
