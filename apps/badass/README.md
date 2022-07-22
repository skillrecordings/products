## Start developing

Copy the template `.env.template` file to `.env.local` and `.env.production`.

```shell
cp .env.template .env.local
cp .env.template .env.production
```

`.env.production` will need new values for every variable.

Then install dependencies and start the server.

```shell
pnpm
pnpm dev
```
