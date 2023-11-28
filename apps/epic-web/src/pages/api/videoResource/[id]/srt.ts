import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'

const videoThumb = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const videoResourceId = req.query.id as string
    const videoResource = await sanityClient.fetch(
      groq`*[_type in ['videoResource'] && _id == $id][0]`,
      {id: videoResourceId},
    )

    // set stale-while-revalidate to 59 seconds
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=1')
    res.send(
      videoResource?.transcript?.srt
        ? videoResource.transcript.srt
        : videoResource?.castingwords?.srt,
    )
  } else {
    res.status(200).end()
  }
}

export default videoThumb
