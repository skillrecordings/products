import type {
  SkillRecordingsAction,
  SkillRecordingsRequest,
  SkillRecordingsResponse,
} from '../core/types'
import {getDecodedToken} from '../client/get-decoded-token'
import {SkillRecordingsHandler} from '../core'
import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@skillrecordings/database'
import {tracer} from '@skillrecordings/honeycomb-tracer'
import {setupHttpTracing} from '@vercel/tracing-js'

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
  const token = await getDecodedToken({req})

  setupHttpTracing({
    name: `skill-api-${skillRecordings?.[0]}`,
    tracer,
    req,
    res,
  })

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
    token,
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

function SkillRecordings(options: SkillRecordingsOptions): any

function SkillRecordings(
  req: NextApiRequest,
  res: NextApiResponse,
  options: SkillRecordingsOptions,
): any

function SkillRecordings(
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

export type SlackFeedbackConfig = {
  channelId: string
  botUsername?: string
}
export type SlackConfig = {
  token: string
  feedback: SlackFeedbackConfig
}

export interface SkillRecordingsOptions {
  prismaClient: PrismaClient
  site: {
    supportEmail: string
    title: string
  }
  slack?: SlackConfig
}

export default SkillRecordings
