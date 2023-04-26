import * as Sentry from '@sentry/nextjs'
import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'
import * as crypto from 'crypto'
import {buffer} from 'micro'
import {parseBody} from 'next/dist/server/api-utils/node'

const dropboxWebhookReceiver = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  console.log('dropbox webhook received')
  if (req.method === 'GET') {
    res.send(req.query.challenge)
  } else if (req.method === 'POST') {
    //verify dropbox webhook signature
    const signature = req.headers['x-dropbox-signature']
    const secret = process.env.DROPBOX_WEBHOOK_SECRET
    const hash = crypto
      .createHmac('sha256', secret)
      .update(await buffer(req))
      .digest('hex')
    console.log({signature, hash})
    if (hash !== signature) {
      console.log('invalid dropbox webhook signature')
      res.status(401).end()
    }
    console.log('valid dropbox webhook signature')
    // const body = await parseBody(req, '1mb')
    // console.log('dropbox webhook body', body)
    res.status(200).end()
  } else {
    res.status(404).end()
  }
}

export default withSentry(dropboxWebhookReceiver)

export const config = {
  api: {
    externalResolver: true,
    // bodyParser: false,
  },
}
