import React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import LessonNavigator from 'components/lesson-navigator'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
import Link from 'next/link'
import cx from 'classnames'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import {useStackblitzEmbed} from 'hooks/use-stackblitz-embed'
import {getNextLesson} from 'utils/get-next-lesson'
import {hmsToSeconds} from 'utils/hms-to-seconds'
import {useMuxPlayer} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
} from 'components/lesson-overlay'
import LessonSidebar from 'components/lesson-sidebar'

const LessonTemplate: React.FC<{
  lesson: SanityDocument
  course: SanityDocument
}> = ({lesson, course}) => {
  const {title, body, type, transcript, stackblitz} = lesson
  const nextLesson = getNextLesson(course, lesson)
  const embedRef = React.useRef<HTMLDivElement>()

  useStackblitzEmbed(stackblitz.projectId, stackblitz.openFile, 'embed')

  const muxPlayerRef = React.useRef<any>()
  const {
    muxPlayerProps,
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    handlePlay,
    displayOverlay,
  } = useMuxPlayer(muxPlayerRef, lesson, course, nextLesson)

  const isExercise = type === 'exercise'

  return (
    <Layout
      meta={{title}}
      nav={
        <Navigation className="flex relative w-auto justify-between ml-[320px]" />
      }
      className="bg-gray-900"
    >
      <div className="flex lg:flex-row flex-col-reverse">
        <LessonSidebar course={course} />
        <div className="w-full relative">
          {/* <Navigation className="flex relative w-full justify-between" /> */}
          <main className="relative">
            {displayOverlay && (
              <>
                {nextLesson ? (
                  <>
                    {isExercise ? (
                      <ExerciseOverlay
                        lesson={lesson}
                        nextLesson={nextLesson}
                        course={course}
                        handlePlay={handlePlay}
                      />
                    ) : (
                      <DefaultOverlay
                        nextLesson={nextLesson}
                        course={course}
                        handlePlay={handlePlay}
                      />
                    )}
                  </>
                ) : (
                  <FinishedOverlay course={course} handlePlay={handlePlay} />
                )}
              </>
            )}
            <div
              className={cx(
                'flex items-center justify-center w-full aspect-video relative',
                {
                  'opacity-0': displayOverlay,
                },
              )}
            >
              <MuxPlayer
                ref={muxPlayerRef}
                {...(muxPlayerProps as MuxPlayerProps)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-white p-5">
                <div className="" />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1">
                    <input
                      checked={autoPlay}
                      onChange={() => {
                        !autoPlay && handlePlay()
                        setAutoPlay(!autoPlay)
                        setPlayerPrefs({autoplay: !autoPlay})
                      }}
                      type="checkbox"
                    />
                    Autoplay{' '}
                  </label>
                  <a
                    href="https://github.com/mattpocock/zod-tutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800/50 text-white rounded px-4 py-3 text-lg font-medium flex items-center gap-2"
                  >
                    <IconGithub className="w-4 h-4" /> Code
                  </a>
                </div>
              </div>
              <article>
                <div className="mx-auto lg:p-10 p-5">
                  <h1 className="font-text text-4xl font-bold">{title}</h1>
                  <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none">
                    <PortableText value={body} />
                  </div>
                </div>
                <div className="lg:px-10 px-5">
                  <h2 className="font-text text-2xl font-bold pb-2">Editor</h2>
                  <div id="embed" className="h-[800px] mx-auto" />
                </div>
                <div className="prose prose-lg max-w-4xl text-white mx-auto p-10">
                  <h2 className="font-text text-3xl font-bold pt-4">
                    Video Transcript
                  </h2>
                  <PortableText
                    value={transcript}
                    components={
                      {
                        marks: {
                          timestamp: ({value}: any) => {
                            const {timestamp} = value
                            return (
                              <button
                                className="underline inline-block after:inline-block after:content-[' ']"
                                onClick={() => {
                                  muxPlayerRef.current.currentTime =
                                    hmsToSeconds(timestamp)
                                  handlePlay()
                                  window.scrollTo({top: 80})
                                }}
                              >
                                {timestamp}
                              </button>
                            )
                          },
                        },
                      } as PortableTextComponents
                    }
                  />
                </div>
              </article>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default LessonTemplate
