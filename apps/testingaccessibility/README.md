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

[Install Docker](https://docs.docker.com/get-docker/)
[Install the Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html#install-hasura-cli)

### Start the Hasura server

This starts the Hasura GraphQL Engine and a Postgres database

```shell
docker compose up -d
```
You can launch the Hasura console using the CLI

```shell
cd hasura
hasura console
```

Changes to the data model in the Hasura console will automatically create migrations:

[Hasura Creates Migrations Automatically (Docs)](https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#step-5-add-a-new-table-and-see-how-migrations-and-metadata-is-updated)

You can "squash" migrations for version control:

[Squash Hasura Migrations](https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup.html#step-6-squash-migrations-and-add-checkpoints-to-version-control)

Incoming migrations are automatically applied when you start the container, but there's lots more to read about migrations:

[Hasura Migrations Docs](https://hasura.io/docs/latest/graphql/core/migrations)

### Seed Data

In the `seed_data` folder is a database dump. The command line you need to access the database is run in the Docker container.

![psql console from docker](https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/rRu17y1L/4693bd91-b729-4766-88df-f28468e90f8e.png?v=b5f3970d0f72b461e7735058d6a74ce2)

```bash
psql postgres://postgres:postgrespassword@postgres:5432/postgres < /data/dump
```

This should set up the basics that are associated with the **test mode** Stripe account


