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

We are using next-auth for authentication via JWTs. You'll need to get it running locally!

### Install Tools

Generate the Prisma Client:

```bash
npx prisma generate
```

This generates to an ignored folder that is recognized as an output for Turbo.

https://docs.planetscale.com/tutorials/automatic-prisma-migrations

Install the [Planetscale CLI](https://github.com/planetscale/cli).

```bash
pscale auth login
```

```bash
pscale connect testing-accessibility main --port 3309
```

Changes to your schema in Planetscale happen on a branch:

```bash
pscale branch create testing-accessibility some-branch-name
```

Changes to the schema are pushed and **Planetscale handles the migrations**.

```bash
npx prisma db push
```

When the branch is ready, it gets a deploy request made:

```bash
pscale deploy-request create testing-accessibility some-branch-name
```


