import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import sanityClient from '@sanity/client'
import {json} from 'stream/consumers'
import {uniqueId} from 'lodash'
import {randomUUID} from 'crypto'

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
      const {audiofile} = req.body

      const transcript = await fetch(
        `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.txt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`,
      )
        .then((transcript) => {
          return transcript.text()
        })
        .catch((err) => {
          console.log(err)
          res.status(500).json({
            message: 'Failed to fetch transcript .txt file from Castingwords',
          })
          return
        })

      const srt = await fetch(
        `https://castingwords.com/store/API4/audiofile/${audiofile}/transcript.srt?api_key=${process.env.CASTINGWORDS_API_TOKEN}`,
      )
        .then((srt) => {
          return srt.text()
        })
        .catch((err) => {
          console.log(err)
          res
            .status(500)
            .json({message: 'Failed to fetch .srt file from Castingwords'})
          return
        })

      const getDocumentQuery = `
        *[
          _type == "videoResource" &&
          castingwords.audioFileId == "${audiofile}"
        ] {_id, castingwords}
        `

      client
        .fetch(getDocumentQuery)
        .then((docs: any) => {
          const {_id, castingwords} = docs[0]
          client
            .patch(_id)
            .set({
              castingwords: {
                ...castingwords,
                transcript: [
                  {
                    style: 'normal',
                    _type: 'block',
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
            .then(() => {
              res.status(200).json({message: 'Video resource updated'})
              return
            })
            .catch((err) => {
              console.log(err)
              res.status(500).json({message: 'Failed to update video resource'})
              return
            })
        })
        .catch((err) => {
          console.log(err)
          res.status(500).json({
            message: `Invalid query for Sanity document`,
          })
        })
    } else {
      res.status(400).json({
        message:
          'Invalid request from Castingwords. Expected event to be TRANSCRIPT_COMPLETE',
      })
    }
  } else {
    res
      .status(400)
      .json({message: 'Invalid request from Castingwords. Expected POST'})
  }
}

export default withSentry(addTranscriptToVideoDocument)
