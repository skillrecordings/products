import React from 'react'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import LessonSidebar from 'components/lesson-sidebar'
import Navigation from 'components/app/navigation'
import Layout from 'components/app/layout'
import capitalize from 'lodash/capitalize'
import cx from 'classnames'
import {PortableText, PortableTextComponents} from '@portabletext/react'
import {useDeviceDetect} from 'hooks/use-device-detect'
import {hmsToSeconds} from 'utils/hms-to-seconds'
import {useMuxPlayer} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
import {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
} from 'components/lesson-overlay'

const LessonTemplate: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
}> = ({lesson, module}) => {
  const {title, lessonType} = lesson
  const muxPlayerRef = React.useRef<HTMLDivElement>()
  const pageTitle = `${title} (${capitalize(lessonType)})`
  return (
    <Layout
      meta={{title: pageTitle}}
      nav={
        <Navigation className="flex relative w-auto justify-between lg:ml-[320px]" />
      }
    >
      <div className="flex lg:flex-row flex-col-reverse">
        <LessonSidebar module={module} />
        <main className="w-full relative">
          <Video ref={muxPlayerRef} module={module} lesson={lesson} />
          <article>
            <div className="mx-auto lg:px-10 lg:py-8 px-5 py-10 relative">
              {/* <AutoPlayToggle muxPlayerRef={muxPlayerRef} /> */}
              <LessonTitle lesson={lesson} />
              <LessonDescription lesson={lesson} />
              <GitHubLink lesson={lesson} module={module} />
            </div>
            <StackblitzEmbed lesson={lesson} module={module} />
            <LessonTranscript lesson={lesson} muxPlayerRef={muxPlayerRef} />
          </article>
        </main>
      </div>
    </Layout>
  )
}

const Video: React.FC<any> = React.forwardRef(({module, lesson}, ref: any) => {
  const isExercise = Boolean(lesson.lessonType === 'exercise')

  const {muxPlayerProps, handlePlay, displayOverlay, nextLesson} = useMuxPlayer(
    ref,
    lesson,
    module,
  )

  return (
    <>
      {displayOverlay && (
        <>
          {nextLesson ? (
            <>
              {isExercise ? (
                <ExerciseOverlay
                  lesson={lesson}
                  nextLesson={nextLesson}
                  module={module}
                  handlePlay={handlePlay}
                />
              ) : (
                <DefaultOverlay
                  nextLesson={nextLesson}
                  module={module}
                  handlePlay={handlePlay}
                />
              )}
            </>
          ) : (
            <FinishedOverlay module={module} handlePlay={handlePlay} />
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
        <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
      </div>
    </>
  )
})

const AutoPlayToggle: React.FC<any> = ({muxPlayerRef}) => {
  const {autoPlay, handlePlay, setAutoPlay, setPlayerPrefs} =
    useMuxPlayer(muxPlayerRef)
  return (
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
  )
}

const GitHubLink: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
}> = ({lesson, module}) => {
  const {github} = module
  const {stackblitz} = lesson

  if (!github || !stackblitz) {
    return null
  }

  return (
    <div className="pt-16">
      <h2 className="sm:text-2xl text-xl font-semibold pb-2">Code</h2>
      <div className="flex items-center gap-2">
        <a
          href={`https://github.com/total-typescript/${github.repo}/blob/main/${lesson.stackblitz.openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800/50 hover:bg-slate-800/90 transition border border-gray-700/50 text-white rounded py-5 px-6 text-lg font-medium inline-flex items-center gap-4"
        >
          <IconGithub className="w-14 h-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="text-gray-400 font-medium"></span>
            </p>
            <p className="text-sm font-mono text-gray-400">
              /{stackblitz.openFile}
            </p>
          </div>
        </a>
      </div>
    </div>
  )
}

const LessonTitle: React.FC<{lesson: SanityDocument}> = ({lesson}) => {
  const {title, type} = lesson
  return (
    <>
      <h1 className="font-text sm:text-4xl text-3xl font-extrabold">
        {title} <span className="font-normal">({capitalize(type)})</span>
      </h1>
    </>
  )
}

const LessonDescription: React.FC<{lesson: SanityDocument}> = ({lesson}) => {
  const {body} = lesson
  return (
    <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none">
      <PortableText value={body} />
    </div>
  )
}

const StackblitzEmbed: React.FC<{
  lesson: SanityDocument
  module: SanityDocument
}> = ({lesson, module}) => {
  const {stackblitz} = lesson
  const {isSafari, isFirefox} = useDeviceDetect()
  const codeFileNumber = stackblitz.openFile.match(/\d/g).join('')
  const startCommand = `${lesson.lessonType.substring(0, 1)}-${codeFileNumber}` // e.g. s-01, e-02, etc
  const githubOrg = 'total-typescript'
  const githubRepo = module.github.repo
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz.openFile}&embed=1&view=editor&hideExplorer=1&ctl=0&terminal=${startCommand}`
  return (
    <div className="">
      <h3 className="flex items-baseline sm:text-2xl text-xl font-semibold pb-2 xl:px-10 sm:px-10 px-5">
        Editor
        {(isSafari || isFirefox) && (
          <span className="pl-2 text-base font-normal text-gray-400">
            For full experience with working terminal please use Chromium-based
            browser.
          </span>
        )}
      </h3>
      <iframe src={embedUrl} title="code editor" className="h-[800px] w-full" />
    </div>
  )
}

const LessonTranscript: React.FC<{
  lesson: SanityDocument
  muxPlayerRef: any
}> = ({lesson, muxPlayerRef}) => {
  const {transcript} = lesson
  const {handlePlay} = useMuxPlayer(muxPlayerRef)

  if (!transcript) {
    return null
  }
  return (
    <div className="prose prose-lg max-w-4xl text-white mx-auto p-10 pt-8">
      <h2 className="font-text text-3xl font-bold pt-4">Video Transcript</h2>
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
                      muxPlayerRef.current.currentTime = hmsToSeconds(timestamp)
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
  )
}

export default LessonTemplate
