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
