import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'
import {getDecodedToken} from '../../utils/get-decoded-token'
import nodemailer from 'nodemailer'
import postmarkTransport from 'nodemailer-postmark-transport'
import prisma from '../../db'
import parseMarkdown from 'markdown-it'
import removeMarkdown from 'remove-markdown'

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
            text: req.body.text,
            context: req.body.context,
            updatedAt: new Date(),
          },
        })

        const info = await transport.sendMail({
          from: `Testing Accessibility Feedback <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>`,
          to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
          replyTo: user.email,
          subject: `Feedback from ${
            user.name ? user.name : user.email
          } about Testing Accessibility`,
          text: removeMarkdown(comment.text),
          html: parseMarkdown().render(comment.text),
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
