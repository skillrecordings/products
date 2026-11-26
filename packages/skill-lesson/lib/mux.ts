import Mux from '@mux/mux-node'
import {presignUploadGet, redactPresignedUrls} from './upload-media-url'

type MuxAsset = {muxAssetId: string; muxPlaybackId?: string; duration?: number}

export async function createMuxAsset({
  originalMediaUrl,
  muxAsset,
  duration,
}: {
  originalMediaUrl: string
  muxAsset: {muxAssetId: string; muxPlaybackId: string}
  duration: number
}): Promise<MuxAsset> {
  if (!muxAsset?.muxAssetId) {
    const {Video} = new Mux()
    // Signed here, at the call, so the URL is never stored or returned (sec-165).
    const input = await presignUploadGet(originalMediaUrl)
    const newMuxAsset = await Video.Assets.create({
      input,
      playback_policy: ['public'],
      mp4_support: 'standard',
    }).catch((error: unknown) => {
      throw new Error(
        redactPresignedUrls(
          `Mux asset create failed: ${
            error instanceof Error ? error.message : JSON.stringify(error)
          }`,
        ),
      )
    })

    return {
      duration: newMuxAsset.duration,
      muxAssetId: newMuxAsset.id,
      muxPlaybackId: newMuxAsset.playback_ids?.find((playback_id) => {
        return playback_id.policy === 'public'
      })?.id,
    }
  }

  return {...muxAsset, duration}
}
