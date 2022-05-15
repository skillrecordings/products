import {NextApiRequest, NextApiResponse} from 'next'
import {init} from '../../../skill/core/init'
import renderPage from '../../../skill/core/pages'
import {
  OutgoingResponse,
  SkillRecordingsAction,
  SkillRecordingsHandlerParams,
  SkillRecordingsOptions,
  SkillRecordingsRequest,
  SkillRecordingsResponse,
} from '../../../skill/core/types'

async function SkillRecordingsHandler<
  Body extends string | Record<string, any> | any[],
>(params: SkillRecordingsHandlerParams): Promise<OutgoingResponse<Body>> {
  const {options: userOptions, req} = params

  // TODO: implement errors
  const {action, error, method = 'GET'} = req

  const {options, cookies} = await init({
    userOptions,
    action,
    host: req.host,
    cookies: req.cookies,
    isPost: method === 'POST',
  })

  if (method === 'GET') {
    const render = renderPage({...options, query: req.query, cookies})

    // TODO: implement override pages
    //  pages are overrides so that you can render user defined pages
    // but not implemented here
    const {pages} = options

    switch (action) {
      case 'test':
        return render.test()
    }
  } else if (method === 'POST') {
    switch (action) {
      case 'send-feedback':
        // TODO: send feedback and render a page appropriately
        return {
          status: 200,
          body: `Your feedback was sent.` as any,
        }
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings` as any,
  }
}

/** Extract the host from the environment */
export function detectHost(forwardedHost: any) {
  // If we detect a Vercel environment, we can trust the host
  if (process.env.VERCEL) return forwardedHost
  // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
  return process.env.NEXTAUTH_URL
}

async function SkillRecordingsNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: SkillRecordingsOptions,
) {
  const {skillRecordings, ...query} = req.query

  const handler = await SkillRecordingsHandler({
    req: {
      host: detectHost(req.headers['x-forwarded-host']),
      body: req.body,
      query,
      cookies: req.cookies,
      headers: req.headers,
      method: req.method,
      action: skillRecordings?.[0] as SkillRecordingsAction,
      providerId: skillRecordings?.[1],
      error: (req.query.error as string | undefined) ?? skillRecordings?.[1],
    },
    options,
  })

  res.status(handler.status ?? 200)

  //TODO: implement cookie handling
  // handler.cookies?.forEach((cookie) => setCookie(res, cookie))

  handler.headers?.forEach((h) => res.setHeader(h.key, h.value))

  if (handler.redirect) {
    // If the request expects a return URL, send it as JSON
    // instead of doing an actual redirect.
    if (req.body?.json !== 'true') {
      // Could chain. .end() when lowest target is Node 14
      // https://github.com/nodejs/node/issues/33148
      res.status(302).setHeader('Location', handler.redirect)
      return res.end()
    }
    return res.json({url: handler.redirect})
  }

  return res.send(handler.body)
}

function NextAuth(
  ...args:
    | [SkillRecordingsOptions]
    | [NextApiRequest, NextApiResponse, SkillRecordingsOptions]
) {
  // TODO: understand what situations this affects
  if (args.length === 1) {
    return async (req: SkillRecordingsRequest, res: SkillRecordingsResponse) =>
      await SkillRecordingsNextHandler(req, res, args[0])
  }

  return SkillRecordingsNextHandler(args[0], args[1], args[2])
}

export default NextAuth
