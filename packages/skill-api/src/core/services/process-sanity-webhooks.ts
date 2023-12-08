import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {Inngest} from 'inngest'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

const webhookSecret = process.env.SANITY_WEBHOOK_SECRET as string

export async function processSanityWebhooks({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {
      req,
      options: {nextAuthOptions},
    } = params
    const signature = req.headers[SIGNATURE_HEADER_NAME] as string
    const isValid = await isValidSignature(
      JSON.stringify(req.body),
      signature,
      webhookSecret,
    )

    try {
      if (!isValid) {
        return {
          status: 400,
          body: 'Invalid webhook signature',
        }
      }
      const data = req.body

      if (process.env.INNGEST_EVENT_KEY && data) {
        const inngest = new Inngest({
          id:
            process.env.INNGEST_APP_NAME ||
            process.env.NEXT_PUBLIC_SITE_TITLE ||
            'Sanity Products Webhook',
          eventKey: process.env.INNGEST_EVENT_KEY,
        })

        await inngest.send({
          name: 'sanity/webhook',
          data,
        })
      }

      return {
        status: 200,
        body: 'success!',
      }
    } catch (err: any) {
      console.error(err)
      return {
        status: 400,
        body: `Webhook Error: ${err.message}`,
      }
    }
  } catch (error: any) {
    console.error(error)
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
