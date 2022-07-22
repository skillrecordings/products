import {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import {sanityClient} from 'utils/sanity-client'

const srt = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const {videoResourceId} = req.query

      const videoResource = await sanityClient
        .fetch(
          `*[_type == "videoResource" && _id == "${videoResourceId}"][0]{srt}`,
        )
        .catch((error) => {
          console.error(error)
          res.status(500).end()
        })

      if (videoResource?.srt) {
        const webvtt = `WEBVTT \n\n${videoResource?.srt
          .replace(/,/gi, '.')
          .trim()}`
        res.setHeader('Content-Type', 'text/vtt')
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
        res.status(200).send(webvtt)
      } else {
        res.status(200).end()
      }
    } catch (error) {}
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default withSentry(srt)

export const config = {
  api: {
    externalResolver: true,
  },
}
