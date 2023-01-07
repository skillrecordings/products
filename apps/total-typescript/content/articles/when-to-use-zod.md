## When should you use Zod?

You're an engineer. You're building something. The thing you're building probably has _inputs_ - points at which data is injected.

Let's say you're building a CLI called `matt`:

```bash
matt run <something>
```

Here, `<something>` is the input. It's the thing that tells the program what to do. It's totally unknown at runtime - it might not even exist.

If you're building a public-facing API, you might have inputs that are exposed to public ports on the web:

```txt
GET https://mattpocock.com/api/user/:id
POST https://mattpocock.com/api/user/:id
```

Several possible inputs come to mind:

- The `:id` parameter on the path
- Which REST method you've used (`GET` or `POST`)
- The headers on the request
- Search parameters you've added to the request: `?hello=world`
- The request body (for `POST`)

All of these are unknown at runtime, because if these API's are exposed to the world anyone can ping them. If they aren't validated, many might even be vectors for attack.

## When you don't trust the inputs

In each of these cases, you don't _trust_ the data entering your app. For those cases, you should use Zod.

For the script, you could parse the `process.argv`:

```ts
import {z} from 'zod'

// Make a schema for the arguments
const ArgSchema = z.tuple([z.any(), z.any(), z.string()])

// Use it to parse process.argv
const [, , name] = ArgSchema.parse(process.argv)

// Log it to the console safely!
console.log(name)
```

`process.argv` usually contains two useless arguments, then the dynamic one you want to extract. For more complex cases, you'll want to use [`commander`](https://www.npmjs.com/package/commander) - but for simple scripts this works great.

The nice thing about using Zod here is that `name` is inferred as a `string` without any other work needed.

For your public API, you can create Zod schemas to ensure that the request body and headers are correct.

```ts
import {z} from 'zod'
import {Request, Response} from 'express'

const CreateUserSchema = z.object({
  body: z.object({
    // Ensures that the email exists, and is an email
    email: z.string().email(),
  }),
  headers: z.object({
    // Ensures that the authorization header is present
    authorization: z.string(),
  }),
})

const handleCreateUser = (req: Request, res: Response) => {
  // Parse the request
  const result = CreateUserSchema.safeParse(req)

  // If something was missing, send back an error
  if (!result.success) {
    res.status(400).send(result.error)
    return
  }

  const {email} = result.data.body

  // Create the user
}
```

We use `.safeParse` here so that we don't throw an error - instead, we return `400` and pass back the error. Zod throws really nice, readable errors, so we can be sure the user knows what went wrong.

Thanks to Zod, you can be sure that the unknown inputs in your app are validated and safe. If I were building an app with _any_ unknown inputs, I'd add Zod right away.

Some more examples of unknown inputs:

- Forms - login forms, CRUD forms... All great use cases for Zod
- Websocket connections
- `localStorage` - users can manipulate this, or it might be out of date.

## When you 'sort of' trust the inputs

Zod's use cases are obvious for _untrustworthy_ inputs to your application. But there are other types of inputs which you 'sort of' trust.

The example that comes to mind is third-party services. If your app relies on calling a third-party API which you don't control, should you validate that API with Zod?

If that API changes its shape, that might cause subtle bugs in your application. I've been through this plenty of times as an engineer: assuming for hours that my code is wrong before realising that the API returned something I didn't expect.

Validating that data with Zod will still cause an error in your app - but that error will be thrown _early_, right when the data enters your app. This makes it _much_ easier to debug and fix.

In that case, why not validate? If bundle size is a concern, [Zod is 12kb gzipped](https://bundlephobia.com/package/zod@3.20.2) which is a little too large for some apps. Validation is also, inevitably, slightly slower than _not_ validating. So if critical-path performance is a concern, you might want to skip Zod.

However, in most apps I've built in my career, robustness is the key concern. 'Impossible data' - or data you don't expect - has been probably the most frequent cause of bugs throughout my dev life. So I'll be validating any input that's remotely untrustworthy.

Some more 'sort of' trustworthy inputs:

- Public API's, like GitHub and YouTube
- API's controlled by other teams in your organization (this is debatable, but depending on the culture I'd consider Zod as an option)

## When you control the inputs

Let's take the final case. Imagine you're building a fullstack app, using a popular framework like Remix, Next.js, SvelteKit or Nuxt.

You want to load some data from the frontend. You ping an API endpoint (which, since it's public-facing, is likely already validated with Zod). You get some data back. Should you validate that data with Zod _on the frontend_?

This is a tricky one. We completely control the API endpoint - we're in charge of deploying to it, and it's deployed in sync with the frontend. However - it's still possible that the following sequence happens:

1. A user starts a browser session on our page (without refreshing). Let's say it's a finance app, with charts that refresh every 10 seconds by pinging the API.
2. While they're browsing, we redeploy our app, with some breaking changes to the backend.
3. The user still hasn't refreshed the page, but now the backend they're pinging is out of date. The page starts breaking.

This kind of 'version drift' between frontend and backend is more common than you think, especially given how often some teams deploy. If we had Zod on the frontend, we'd be able to error as soon as any kind of version drift happened and prompt the user to refresh the page.

However, in these situations I usually opt for _not_ using Zod. With version drift, the app is usually just a browser refresh away from a better experience. Since nothing security-sensitive is exposed to frontend code, the blast radius of a bug is relatively small.

This is up for debate, though - you may want to check all the data coming into your app to error whenever a version drift happens.

## Summary

When your app has inputs you don't **trust**, use Zod.

When your app has inputs you **trust** but **don't control**, validate them with Zod.

When your app has inputs you **trust** and **control**, I usually don't validate them with Zod.

If you want to learn more about using Zod, check out my free, [10-exercise tutorial on Zod](https://www.totaltypescript.com/tutorials/zod).
