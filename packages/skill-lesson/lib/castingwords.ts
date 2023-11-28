import {z} from 'zod'
import {NextApiRequest, NextApiResponse} from 'next'
import {writeTranscriptToVideoResource} from './sanity'

export const CastingwordsWebhookBody = z.object({
  audiofile: z.string(),
  order: z.string(),
})

export async function getTranscriptText(audiofile: string) {
  return await fetch(
    `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.txt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`,
  ).then((transcript) => {
    return transcript.text()
  })
}

export async function getSRTText(audiofile: string) {
  const srtUrl = `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.srt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`
  const response = await fetch(srtUrl)
  const srt = await response.text()
  return {srt, srtUrl}
}

export function buildCastingwordsOrderUrl({
  skus,
  originalMediaUrl,
}: {
  skus: string[]
  originalMediaUrl: string
}) {
  if (!process.env.CASTINGWORDS_API_TOKEN) {
    throw new Error('Missing CASTINGWORDS_API_TOKEN')
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const urlParams = new URLSearchParams()

  for (const sku of skus) {
    urlParams.append('sku', sku)
  }

  if (process.env.NODE_ENV !== 'production') urlParams.append('test', '1')

  urlParams.append('url', originalMediaUrl)
  urlParams.append('api_key', process.env.CASTINGWORDS_API_TOKEN)

  return `https://castingwords.com/store/API4/order_url?${urlParams.toString()}`
}

export const CastingWordsOrderResponseSchema = z.object({
  audiofiles: z.array(z.number()),
  order: z.string(),
})

export type CastingwordsOrder = z.infer<typeof CastingWordsOrderResponseSchema>

export async function orderTranscript(
  originalMediaUrl: string,
  expedite: boolean = true,
) {
  // BULK2 is a quick transcript order. There is also BULK6 but it is slower
  // BCAPTION3 orders captions
  const skus = [expedite ? 'BULK2' : 'BULK6', 'BCAPTION3']
  const url = buildCastingwordsOrderUrl({skus, originalMediaUrl})
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return await fetch(url, {
    method: 'POST',
    headers,
  }).then(async (response) => {
    const order = await response.json()
    return CastingWordsOrderResponseSchema.parse(order)
  })
}

export async function createCastingWordsOrder({
  originalMediaUrl,
  castingwords,
}: {
  originalMediaUrl: string
  castingwords: {orderId: string; transcript: any[]; audioFileId: number}
}) {
  if (!castingwords?.orderId && !castingwords?.transcript) {
    return await orderTranscript(originalMediaUrl)
  }

  return {order: castingwords.orderId, audiofiles: [castingwords.audioFileId]}
}

export const castingwordsWebhookReceiver = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    if (req.body.event === 'TRANSCRIPT_COMPLETE') {
      try {
        const {audiofile, order} = CastingwordsWebhookBody.parse(req.body)
        await writeTranscriptToVideoResource(audiofile, order)
        res.status(200).json({message: 'video resource updated'})
      } catch (e) {
        res.status(500).json({
          message: `Invalid query for Sanity document`,
        })
      }
    } else {
      res.status(200).end()
    }
  } else {
    res.status(404).end()
  }
}
