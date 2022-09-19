import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

const secret = process.env.SANITY_WEBHOOK_ORDER_TRANSCRIPT_SECRET

const createCastingwordsOrder = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  if (!isValid) {
    res.status(401).json({success: false, message: 'Invalid signature'})
    return
  }

  const {_id, originalMediaUrl} = req.body

  // BULK3 is a quick transcript order. There is also BULK6 but it is slower
  // BCAPTION3 orders captions
  const SKUs = ['BULK2', 'BCAPTION3']

  const SKUParams = (skus: string[]) => {
    const queryParams = skus.map((sku: any) => {
      return `&sku=${sku}`
    })

    return queryParams.join('')
  }

  const encodedOriginalMediaUrl = encodeURIComponent(originalMediaUrl)

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Cookie', 'visited=1')

  const developmentTestOrder =
    process.env.NODE_ENV === 'development' ? '&test=1' : ''

  fetch(
    `https://castingwords.com/store/API4/order_url?api_key=${
      process.env.CASTINGWORDS_API_TOKEN
    }${SKUParams(SKUs)}${developmentTestOrder}?url=${encodedOriginalMediaUrl}`,
    {
      method: 'POST',
      headers,
    },
  )
    .then((response) => response.text())
    .then((result) => {
      console.debug(result)
    })
    .catch((error) => console.error('error', error))

  res.json({success: true})
}

export default withSentry(createCastingwordsOrder)
