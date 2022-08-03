import type {
  SkillRecordingsAction,
  SkillRecordingsRequest,
  SkillRecordingsResponse,
} from '../core/types'
import {getDecodedToken} from '../client/get-decoded-token'
import {SkillRecordingsHandler} from '../core'
import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@skillrecordings/database'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'
import {NextAuthOptions} from 'next-auth'
import {parseBody} from 'next/dist/server/api-utils/node'

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
  setupHttpTracing({
    name: `skill-api-${skillRecordings?.[0]}`,
    tracer,
    req,
    res,
  })

  // if it has a `stripe-signature` that we need to validate
  // then we don't want to parse the request body or else
  // the validation won't work. if we add additional webhook
  // providers that have similar validation mechanism (it's
  // common) they will need to be added to the array.
  const isWebhook = ['stripe-signature'].every(
    (prop: string) => prop in req.headers,
  )

  const body = isWebhook ? req.body : await parseBody(req, '1mb')
  const token = await getDecodedToken({req})

  const handler = await SkillRecordingsHandler({
    req: {
      host: detectHost(req.headers['x-forwarded-host']),
      body,
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
    ...(isWebhook && {rawReq: req}),
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
    return async (
      req: SkillRecordingsRequest,
      res: SkillRecordingsResponse,
    ) => {
      return await SkillRecordingsNextHandler(req, res, args[0])
    }
  }

  return SkillRecordingsNextHandler(args[0], args[1], args[2])
}

export type SlackFeedbackConfig = {
  channelId: string
  botUsername?: string
}
export type SlackConfig = {
  token: string
  feedback?: SlackFeedbackConfig
  redeem?: SlackFeedbackConfig
}

export interface SkillRecordingsOptions {
  site: {
    supportEmail: string
    title: string
  }
  slack?: SlackConfig
  nextAuthOptions?: NextAuthOptions
  parseBody?: boolean
}

export default SkillRecordings
