import * as React from 'react'
import {PortableText} from '@portabletext/react'
import {type PortableTextComponents as PortableTextComponentsType} from '@portabletext/react/src/types'
import {hmsToSeconds} from '@skillrecordings/time'

import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'

export const VideoTranscript: React.FC<{
  transcript: any[]
  muxPlayerRef: any
}> = ({transcript, muxPlayerRef}) => {
  const {handlePlay, canShowVideo} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className=" mx-auto max-w-4xl p-5 py-16">
      <h2 className="flex items-baseline font-heading text-2xl font-bold sm:text-3xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-4 prose-p:text-gray-800">
        <PortableText
          value={transcript}
          components={
            {
              marks: {
                timestamp: ({value}: any) => {
                  const {timestamp} = value
                  return canShowVideo ? (
                    <button
                      className="after:content-[' '] inline-block underline after:inline-block"
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
