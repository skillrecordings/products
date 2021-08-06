# turbo-playground

This is an exploratory project using Turborepo and pnpm to create a monorepo working environment for multiple applications and a shared common core library (or set of libraries.

You'll need [pnpm](https://twitter.com/pnpmjs) installed.

pnpm is used here based on [significant performance gains](https://twitter.com/jaredpalmer/status/1422574985323950083?s=20) reported by Jared Palmer from a customer.


```bash
pnpm i
pnpm turbo run build
```

This will build (and cache) the library packages and applications.

You can start the template next.js app:

```bash
cd apps/next-productstarter && pnpm run start
```

