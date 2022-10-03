### Install Dependencies

Install all of the dependencies for the entire monorepo by running the following command:

```shell
pnpm install
```

⭐️ `pnpm install` can be run from any folder in the monorepo and it will install the dependencies for all projects and apps in the monorepo.

### Configure your Dev Environment

👋 `.env` is **required by Prisma** and **only** contains `DATABASE_URL`. The full contents
of this file by default are:

```shell
DATABASE_URL=mysql://root@127.0.0.1:3309/total-typescript
```

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

The app will be served at `http://localhost:3016`.

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

The first time you run this command it will seed the database with the contents of `apps/total-typescript/seed_data`

If you want to reset the database, open docker, delete the container **and** the associated image. Otherwise nothing will be changed with the database when you run the above command but it will be running normally in the background.

The database can be stopped and started from the Docker dashboard.

⭐️ Note: the default `username` for this MySQL instance is `root` and the `password` is blank.

#### Connect to local MySQL database

You can use (Arctype)[https://arctype.com/] or any other MySQL client to connect to and manage the database. In Arctype:

- Select "Add new data source"
- Select "MySQL"
- Input credentials
  - Name: Total TypeScript
  - Host: 127.0.0.1; Port: 3309
  - User: root
  - Database: total-typescript
- Then you can test your connection, save it and view the tables.

### Migrate any schema changes

If you make changes to the schema via Prisma you'll need to push it to the DB. We don't use Prisma migrations and let Planetscale handle it:

```bash
npx prisma db push
```

## Edit content

Edit workshops with Sanity at [totaltypescript.sanity.studio](https://totaltypescript.sanity.studio/).
