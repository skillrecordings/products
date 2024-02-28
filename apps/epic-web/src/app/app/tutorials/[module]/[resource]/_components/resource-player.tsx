'use client'

import MuxPlayer, {type MuxPlayerProps} from '@mux/mux-player-react'
import {cn} from '@skillrecordings/ui/utils/cn'
import type {VideoResource} from 'lib/video-resource'
import {use} from 'react'

export const ResourcePlayer: React.FC<{
  muxPlaybackId?: string
  videoResourceLoader: Promise<VideoResource | null>
  className?: string
}> = ({muxPlaybackId, className, videoResourceLoader}) => {
  const playerProps = {
    id: 'mux-player',
    defaultHiddenCaptions: true,
    streamType: 'on-demand',
    thumbnailTime: 0,
    playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
    maxResolution: '2160p',
    minResolution: '540p',
  } as MuxPlayerProps

  const videoResource = use(videoResourceLoader)

  const playbackId = muxPlaybackId || videoResource?.muxAsset.muxPlaybackId

  return (
    <>
      {playbackId ? (
        <MuxPlayer
          playbackId={playbackId}
          className={cn(className)}
          {...playerProps}
        />
      ) : null}
    </>
  )
}
