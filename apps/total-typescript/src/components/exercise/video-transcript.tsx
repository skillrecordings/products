import * as React from 'react'
import {Exercise} from '../../lib/exercises'
import {useMuxPlayer} from '../../hooks/use-mux-player'
import {PortableText} from '@portabletext/react'
import {hmsToSeconds} from '../../utils/hms-to-seconds'
import {PortableTextComponents as PortableTextComponentsType} from '@portabletext/react/src/types'

export const VideoTranscript: React.FC<{
  exercise: Exercise
  muxPlayerRef: any
}> = ({exercise, muxPlayerRef}) => {
  const transcript = exercise.transcript
  const {handlePlay, video} = useMuxPlayer()
  if (!transcript) {
    return null
  }

  return (
    <div className=" mx-auto max-w-4xl p-5 py-16">
      <h2 className="flex items-baseline text-2xl font-semibold sm:text-3xl">
        Transcript
      </h2>
      <div className="prose max-w-none pt-4 prose-p:text-gray-300 sm:prose-lg">
        <PortableText
          value={transcript}
          components={
            {
              marks: {
                timestamp: ({value}: any) => {
                  const {timestamp} = value
                  return video ? (
                    <button
                      className="after:content-[' '] inline-block underline after:inline-block"
                      onClick={() => {
                        muxPlayerRef.current.currentTime =
                          hmsToSeconds(timestamp)
                        handlePlay()
                        window.scrollTo({top: 80})
                      }}
                    >
                      {timestamp}
                    </button>
                  ) : null
                },
              },
            } as PortableTextComponentsType
          }
        />
      </div>
    </div>
  )
}
