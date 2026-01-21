import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'

// Mux API response schemas
const MuxPlaybackIdResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    policy: z.string(),
    object: z.object({
      id: z.string(),
      type: z.string(),
    }),
  }),
})

const MuxStaticRenditionFileSchema = z.object({
  name: z.string(),
  ext: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  bitrate: z.number().optional(),
  filesize: z.string().optional(), // Mux returns this as string
  type: z.string().optional(),
  status: z.string().optional(),
  resolution: z.string().optional(),
  resolution_tier: z.string().optional(),
  id: z.string().optional(),
})

const MuxAssetResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    status: z.string(),
    duration: z.number().optional(),
    static_renditions: z
      .object({
        files: z.array(MuxStaticRenditionFileSchema).optional(),
      })
      .optional(),
  }),
})

// Output schema
const DownloadSchema = z.object({
  quality: z.string(),
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  bitrate: z.number().optional(),
  filesize: z.number().optional(),
})

const VideoResponseSchema = z.object({
  playbackId: z.string(),
  assetId: z.string(),
  status: z.string(),
  duration: z.number().optional(),
  downloads: z.array(DownloadSchema),
})

export type VideoResponse = z.infer<typeof VideoResponseSchema>

const MUX_AUTH = Buffer.from(
  `${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`,
).toString('base64')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  const playbackId = req.query.playbackId as string

  if (!playbackId) {
    return res.status(400).json({error: 'playbackId is required'})
  }

  try {
    // 1. Validate playbackId exists in Sanity
    const videoResource = await sanityClient.fetch(
      groq`*[_type == "videoResource" && muxAsset.muxPlaybackId == $playbackId][0]{
        _id,
        "muxPlaybackId": muxAsset.muxPlaybackId
      }`,
      {
        playbackId,
      },
    )

    if (!videoResource) {
      return res.status(404).json({error: 'Video not found'})
    }

    // 2. Fetch from Mux: playback-ids endpoint
    const playbackRes = await fetch(
      `https://api.mux.com/video/v1/playback-ids/${playbackId}`,
      {headers: {Authorization: `Basic ${MUX_AUTH}`}},
    )

    if (!playbackRes.ok) {
      const errorText = await playbackRes.text()
      console.error('Mux playback-ids API error:', errorText)
      return res.status(500).json({error: 'Failed to fetch from Mux API'})
    }

    const playbackJson = await playbackRes.json()
    const playbackData = MuxPlaybackIdResponseSchema.parse(playbackJson)

    // 3. Fetch from Mux: assets endpoint using object.id
    const assetId = playbackData.data.object.id
    const assetRes = await fetch(
      `https://api.mux.com/video/v1/assets/${assetId}`,
      {headers: {Authorization: `Basic ${MUX_AUTH}`}},
    )

    if (!assetRes.ok) {
      const errorText = await assetRes.text()
      console.error('Mux assets API error:', errorText)
      return res.status(500).json({error: 'Failed to fetch asset from Mux API'})
    }

    const assetJson = await assetRes.json()
    const assetData = MuxAssetResponseSchema.parse(assetJson)

    // 4. Build download URLs from static renditions
    const staticFiles = assetData.data.static_renditions?.files || []
    const downloads = staticFiles
      .filter((f) => f.ext === 'mp4')
      .map((f) => ({
        quality: f.name.replace('.mp4', ''), // e.g. "highest", "high", "medium", "low"
        url: `https://stream.mux.com/${playbackId}/${f.name}`,
        width: f.width,
        height: f.height,
        bitrate: f.bitrate,
        filesize: f.filesize ? parseInt(f.filesize, 10) : undefined,
      }))

    // 5. Return formatted response
    const response: VideoResponse = {
      playbackId,
      assetId,
      status: assetData.data.status,
      duration: assetData.data.duration,
      downloads,
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Error in video API:', error)
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors)
      return res.status(500).json({error: 'Invalid response from Mux API'})
    }
    return res.status(500).json({error: 'Internal server error'})
  }
}
