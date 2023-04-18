import * as React from 'react'
import {PortableText} from '@portabletext/react'
import {type PortableTextComponents as PortableTextComponentsType} from '@portabletext/react/src/types'
import {hmsToSeconds} from '@skillrecordings/time'

import {useMuxPlayer} from 'hooks/use-mux-player'

export const VideoTranscript: React.FC<{
  transcript: any[]
  muxPlayerRef: any
}> = ({transcript, muxPlayerRef}) => {
  const {handlePlay, canShowVideo} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div data-video-transcript="">
      <h2 data-title="">Transcript</h2>
      <div data-transcript="">
        <PortableText
          value={transcript}
          components={
            {
              marks: {
                timestamp: ({value}: any) => {
                  const {timestamp} = value
                  return canShowVideo ? (
                    <button
                      data-timestamp=""
                      onClick={() => {
                        if (canShowVideo) {
                          muxPlayerRef.current.currentTime =
                            hmsToSeconds(timestamp)
                          handlePlay()
                          window.scrollTo({top: 80})
                        }
                      }}
                    >
                      {timestamp}
                    </button>
                  ) : (
                    timestamp
                  )
                },
              },
            } as PortableTextComponentsType
          }
        />
      </div>
    </div>
  )
}
