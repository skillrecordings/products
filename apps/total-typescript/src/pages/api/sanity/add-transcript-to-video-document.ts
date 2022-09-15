import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import sanityClient from '@sanity/client'

const addTranscriptToVideoDocument = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    const client = sanityClient({
      projectId: 'z9io1e0u',
      dataset: 'production',
      useCdn: process.env.NODE_ENV !== 'development', // `false` if you want to ensure fresh data
      apiVersion: '2021-10-19',
      token: process.env.SANITY_API_TOKEN,
    })

    if (req.body.event === 'TRANSCRIPT_COMPLETE') {
      const {audiofile, originallink, order} = req.body

      const getDocumentQuery = `
        *[
          _type == "videoResource" && 
          castingwordsAudioFileId == "${audiofile}"
        ] {_id}
      `

      client.fetch(getDocumentQuery).then((docs: any) => {
        console.log('TEST')
        console.log(docs)
      })

      res.status(200).json({message: 'success'})
    }
  }
}

export default withSentry(addTranscriptToVideoDocument)
