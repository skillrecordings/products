import {NextApiRequest, NextApiResponse} from 'next'
import {getVideoResource} from '@skillrecordings/skill-lesson/lib/video-resources'

const videoThumb = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const videoResourceId = req.query.videoResourceId as string
    const videoResource = await getVideoResource(videoResourceId)

    // load an image binary via fetch
    const response = await fetch(
      `https://image.mux.com/${videoResource.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
    )

    const blob = await response.blob()
    console.log({blob})

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    res.setHeader(
      'content-type',
      response.headers.get('content-type') || 'image/png',
    )
    res.send(blob.stream())
  } else {
    res.status(200).end()
  }
}

export default videoThumb
