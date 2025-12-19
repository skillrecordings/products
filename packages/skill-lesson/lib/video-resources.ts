import groq from 'groq'
import {
  type VideoResource,
  VideoResourceSchema,
} from '../schemas/video-resource'
import {sanityClient} from '../utils/sanity-client'
import * as mysql from 'mysql2/promise'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const getVideoResource = async (id: string): Promise<VideoResource> => {
  if (process.env.COURSE_BUILDER_DATABASE_URL) {
    try {
      const connection = await mysql.createConnection(access)

      const [rows] = await connection.execute(
        `SELECT * FROM zEW_ContentResource 
         WHERE type = 'videoResource'
         AND id = ?
         AND deletedAt IS NULL`,
        [id],
      )

      if (Array.isArray(rows) && rows.length > 0) {
        const videoRow = rows[0] as any
        const fields =
          typeof videoRow.fields === 'string'
            ? JSON.parse(videoRow.fields)
            : videoRow.fields || {}

        const videoResource = {
          _id: videoRow.id,
          muxPlaybackId: fields.muxPlaybackId || null,
          transcript:
            fields.transcript?.text || fields.castingwords?.transcript || null,
          poster: fields.poster || null,
          duration: fields.duration || null,
        }

        return VideoResourceSchema.parse(videoResource)
      }
    } catch (error) {
      console.error('[getVideoResource] Error fetching from database:', error)
      // Fall through to Sanity
    }
  }

  const videoResource = await sanityClient.fetch(
    groq`*[_type in ['videoResource'] && _id == $id][0]{
      _id,
      "transcript": castingwords.transcript,
      "muxPlaybackId": muxAsset.muxPlaybackId,
      "duration": duration,
      poster,
    }`,
    {id},
  )

  if (!videoResource) {
    throw new Error(`VideoResource not found with id: ${id}`)
  }

  return VideoResourceSchema.parse(videoResource)
}
