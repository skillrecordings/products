import * as React from 'react'
import {useRouter} from 'next/router'
import {type MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {customPlayFromBeginningHandler} from 'utils/custom-handlers'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import Spinner from 'components/spinner'
import type {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'

const InterviewTemplate = ({interview}: {interview: Lesson}) => {
  const router = useRouter()
  const {videoResource, loadingVideoResource, videoResourceId} =
    useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)

  const nextInterviewPath = ({lesson}: {lesson: Lesson | null}) => {
    return {
      query: {lesson: lesson?.slug},
      pathname: '/interviews/[lesson]',
    }
  }

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={interview.slug}
      handlePlayFromBeginning={customPlayFromBeginningHandler}
      nextPathBuilder={nextInterviewPath}
    >
      <div className="container max-w-6xl pb-8 pt-4 md:pb-12 md:pt-6 lg:pb-16">
        <main className="relative mx-auto w-full items-start border-t border-transparent 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
          <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
            <Video ref={muxPlayerRef} loadingIndicator={<Spinner />} />
          </div>
        </main>
        <div className="mt-12 flex flex-col lg:flex-row">
          <div className="grow">
            <h2 className="text-3xl md:text-[2.125rem] lg:text-4xl xl:text-5xl leading-tight">
              {interview.title}
            </h2>
            <article className="lg:mt-8">
              <div className="prose prose-md">
                <VideoTranscript transcript={videoResource?.transcript || ''} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </VideoProvider>
  )
}

export default InterviewTemplate
