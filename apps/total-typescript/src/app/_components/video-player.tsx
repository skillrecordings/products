'use client'

import * as React from 'react'
import {type MuxPlayerProps} from '@mux/mux-player-react'
import MuxPlayer from '@mux/mux-player-react/lazy'
import {use} from 'react'
import {cn} from '@skillrecordings/ui/utils/cn'

export default function VideoPlayer({
  muxPlaybackId,
  className,
  videoResourceLoader,
  title,
  ...props
}: {
  muxPlaybackId?: string
  videoResourceLoader?: Promise<{muxPlaybackId: string} | null>
  className?: string
  title?: string
}) {
  const playerProps = {
    id: 'mux-player',
    title: title,
    defaultHiddenCaptions: true,
    streamType: 'on-demand',
    thumbnailTime: 0,
    playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
    maxResolution: '2160p',
    minResolution: '540p',
  } as MuxPlayerProps

  const videoResource = videoResourceLoader && use(videoResourceLoader)

  const playbackId = muxPlaybackId || videoResource?.muxPlaybackId // || (videoResource?.state === 'ready' ? videoResource?.muxPlaybackId : undefined)

  return (
    <>
      {playbackId ? (
        <MuxPlayer
          playbackId={playbackId}
          className={cn('aspect-video h-full w-full', className)}
          metadata={{
            video_title: title,
          }}
          {...playerProps}
          {...props}
        />
      ) : null}
    </>
  )
}
