import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {uniqueId} from 'lodash'
import {sanityWriteClient} from 'utils/sanity-server'
import {getSRTText, getTranscriptText} from 'lib/castingwords'
import {z} from 'zod'

const VideoResourceSchema = z.object({
  _id: z.string(),
  castingwords: z.object({
    audioFileId: z.string(),
    orderId: z.string(),
    transcript: z.any(),
    srt: z.string(),
  }),
})

type VideoResource = z.infer<typeof VideoResourceSchema>

const CastingwordsWebhookBody = z.object({
  audiofile: z.string(),
})

const castingwordsWebhookReceiver = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    //TODO: use utils/sanityClient
    const client = sanityWriteClient
    if (req.body.event === 'TRANSCRIPT_COMPLETE') {
      try {
        const {audiofile} = CastingwordsWebhookBody.parse(req.body)

        // TODO extract into Sanity lib
        // START LIB -> writeTranscriptToVideoResource(audiofile)

        const transcript = await getTranscriptText(audiofile)
        const srt = await getSRTText(audiofile)

        const getDocumentQuery = `
        *[
          _type == "videoResource" &&
          castingwords.audioFileId == "${audiofile}"
        ][0] {_id, castingwords}
        `

        // TODO: move to lib/sanity/videoResource.ts
        const document: VideoResource = VideoResourceSchema.parse(
          await client.fetch(getDocumentQuery),
        )

        const {_id, castingwords} = document

        await client
          .patch(_id)
          .set({
            castingwords: {
              ...castingwords,
              transcript: [
                {
                  style: 'normal',
                  _type: 'block',
                  // how does this format in Portable Text?
                  children: [
                    {
                      _type: 'span',
                      marks: [],
                      _key: uniqueId('body-key-'),
                      text: transcript,
                    },
                  ],
                  markDefs: [],
                  _key: uniqueId('block-key-'),
                },
              ],
              srt: srt,
            },
          })
          .commit()

        // END LIB

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

export default withSentry(castingwordsWebhookReceiver)

export const config = {
  api: {
    externalResolver: true,
  },
}
