import type {NextApiRequest, NextApiResponse} from 'next'
import * as Sentry from '@sentry/nextjs'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'
import {getEmoji} from 'utils/get-feedback-emoji'
import {withSentry} from '@sentry/nextjs'
import {htmlToText} from 'html-to-text'
import postmarkTransport from 'nodemailer-postmark-transport'
import sanitizeHtml from 'sanitize-html'
import nodemailer from 'nodemailer'
import prisma from '../../db'

const transport = nodemailer.createTransport(
  postmarkTransport({
    auth: {
      apiKey: process.env.POSTMARK_KEY,
    },
  }),
)

const feedbackHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: feedbackHandler.name, tracer, req, res})
  if (req.method === 'POST') {
    try {
      const token = await getDecodedToken(req)
      const user = await prisma.user.findUnique({
        where: {
          id: token?.sub,
        },
      })
      if (!user) {
        res.status(403).end('not authorized')
      } else {
        const comment = await prisma.comment.create({
          data: {
            userId: user.id,
            text: htmlToText(req.body.text),
            context: req.body.context,
            updatedAt: new Date(),
          },
        })

        const html = `${
          getEmoji(req.body.context.emotion).image
        } ${sanitizeHtml(req.body.text)}`

        const info = await transport.sendMail({
          from: `Testing Accessibility Feedback <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>`,
          to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
          replyTo: user.email,
          subject: `Feedback from ${
            user.name ? user.name : user.email
          } about Testing Accessibility`,
          text: comment.text,
          html,
        })

        //TODO: maybe send to slack?

        res.status(200).json(info)
      }
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default withSentry(feedbackHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
