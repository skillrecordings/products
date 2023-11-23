import {SkillRecordingsHandlerParams} from '../../types'
import {OutgoingResponse} from '../../index'
import {getSdk} from '@skillrecordings/database'
import {Inngest} from 'inngest'
import {SYNC_SANITY_PRODUCT} from '@skillrecordings/inngest'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

const webhookSecret = process.env.SANITY_WEBHOOK_SECRET as string // TODO: rename?

export async function processSanityProductsWebhook({
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
    const isValid = isValidSignature(
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
      const product = req.body
      console.log({product, req, params})
      if (process.env.INNGEST_EVENT_KEY && product) {
        const inngest = new Inngest({
          id:
            process.env.INNGEST_APP_NAME ||
            process.env.NEXT_PUBLIC_SITE_TITLE ||
            'Sanity Products Webhook',
          eventKey: process.env.INNGEST_EVENT_KEY,
        })
        console.log('sending inngest event')
        await inngest.send({
          name: SYNC_SANITY_PRODUCT,
          data: {
            product: req.body,
          },
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
