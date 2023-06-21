import Mux from '@mux/mux-node'

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
    const newMuxAsset = await Video.Assets.create({
      input: originalMediaUrl,
      playback_policy: ['public'],
      mp4_support: 'standard',
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
