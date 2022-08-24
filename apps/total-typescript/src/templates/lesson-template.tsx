import React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import LessonSidebar from 'components/lesson-sidebar'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
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
import {capitalize} from 'lodash'
import {useDeviceDetect} from 'hooks/use-device-detect'

const LessonTemplate: React.FC<{
  lesson: SanityDocument
  course: SanityDocument
}> = ({lesson, course}) => {
  const {title, body, type, transcript, stackblitz, github} = lesson
  const nextLesson = getNextLesson(course, lesson)

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

  const {isSafari, isFirefox} = useDeviceDetect()

  return (
    <Layout
      meta={{title}}
      className="bg-gray-900"
      nav={
        <div className="flex items-center pr-5">
          <Navigation className="flex relative w-full justify-between lg:ml-[320px]" />
        </div>
      }
    >
      <div className="flex lg:flex-row flex-col-reverse">
        <LessonSidebar course={course} />
        <div className="w-full relative">
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
              <article>
                <div className="mx-auto lg:px-10 lg:py-8 px-5 py-10 relative">
                  <label className="flex items-center gap-1.5 text-gray-200 text-sm absolute sm:right-4 right-0 cursor-pointer sm:top-3 top-0 bg-gray-900 hover:bg-gray-800 transition rounded px-3 py-2">
                    <input
                      className="accent-cyan-300"
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

                  <h1 className="font-text sm:text-4xl text-3xl font-extrabold">
                    {title}{' '}
                    <span className="font-normal">({capitalize(type)})</span>
                  </h1>
                  <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none">
                    <PortableText value={body} />
                  </div>
                  {github?.url && (
                    <div className="pt-16">
                      <h2 className="sm:text-2xl text-xl font-semibold pb-2">
                        Code
                      </h2>
                      <div className="flex items-center gap-2">
                        <a
                          href={github.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-800/50 hover:bg-slate-800/90 transition border border-gray-700/50 text-white rounded py-5 px-6 text-lg font-medium inline-flex items-center gap-4"
                        >
                          <IconGithub className="w-14 h-14" />
                          <div>
                            <p className="text-xl font-semibold">
                              {course.github.repo}
                              <span className="text-gray-400 font-medium"></span>
                            </p>
                            <p className="text-sm font-mono text-gray-400">
                              /{github.path}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="xl:px-10">
                  <h3 className="flex items-baseline sm:text-2xl text-xl font-semibold pb-2 xl:px-0 sm:px-10 px-5">
                    Editor
                    {(isSafari || isFirefox) && (
                      <span className="pl-2 text-base font-normal text-gray-400">
                        For full experience with working terminal please use
                        Chromium-based browser.
                      </span>
                    )}
                  </h3>
                  <iframe
                    tabIndex={-1}
                    onFocus={() => {
                      console.log('focused')
                    }}
                    id="embed"
                    className="h-[800px] mx-auto"
                  />
                </div>
                <div className="prose prose-lg max-w-4xl text-white mx-auto p-10 pt-8">
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
