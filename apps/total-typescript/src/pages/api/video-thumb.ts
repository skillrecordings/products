import {NextApiRequest, NextApiResponse} from 'next'
import {getVideoResource} from '@skillrecordings/skill-lesson/lib/video-resources'

const videoThumb = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const videoResourceId = req.query.videoResourceId as string
    const videoResource = await getVideoResource(videoResourceId)
    const url = `https://image.mux.com/${videoResource.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve&time=0`

    // load an image binary via fetch
    const response = await fetch(url)

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'image/png',
    )

    const reader = response.body?.getReader()

    if (reader) {
      const writeChunks = async () => {
        while (true) {
          const {done, value} = await reader.read()
          if (done) break
          res.write(value)
        }
        res.end()
      }

      writeChunks().catch((err) => {
        console.error(err)
        res.status(500).end()
      })
    } else {
      res.status(500).end()
    }
  } else {
    res.status(200).end()
  }
}

export default videoThumb
