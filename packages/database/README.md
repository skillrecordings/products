# database

## How to modify the local database schema

1. Make the desired change in the `prisma/schema.prisma` file.

2. Generate the new Prisma client (this has the side-effect of formating the schema file).

```
$ pnpm generate
```

3. Apply your schema change to a local database

First, ensure you have the correct docker database instance running and that
you aren't proxying a connect to planetscale (`pscale connect ...`).

Then, run this command which is an alias to `prisma db:push`:

```
$ pnpm db:push
```

## Deploying schema changes to production

We typically do something resembling the [Expand and Contract
pattern](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)
for our schema changes both because it avoids downtime and because planetscale
enforces it.

Additionally, [these are the
steps](https://roamresearch.com/#/app/egghead/page/0lMYUl8ah) to follow to
prepare planetscale deploy requests, update production schemas, and get the new
prisma client deployed.
