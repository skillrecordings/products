import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllCourses, getModule} from 'lib/courses'
import {getLesson} from 'lib/lessons'
import {useMuxPlayer, VideoProvider} from 'hooks/use-mux-player'
import {SanityDocument} from '@sanity/client'
import MuxPlayer, {MuxPlayerProps} from '@mux/mux-player-react'
import {useConvertkit} from 'hooks/use-convertkit'
import cx from 'classnames'
import {Lesson, LessonSchema} from 'lib/lessons'
import Layout from 'components/layout'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const lessonSlug = params?.lesson as string

  const module = await getModule(params?.module as string)
  const lesson = await getLesson(lessonSlug)

  return {
    props: {lesson, module},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const courses = await getAllCourses()

  const paths = courses.reduce((acc: any[], course: any) => {
    return [
      ...acc,
      ...course.lessons.map((lesson: any) => {
        return {
          params: {
            module: course.slug.current,
            lesson: lesson.slug,
          },
        }
      }),
    ]
  }, [])

  return {paths, fallback: 'blocking'}
}

const path = '/courses'

const LessonPage: React.FC<{
  lesson: Lesson
  module: SanityDocument
  isSolution?: boolean
}> = ({lesson, module, isSolution = false}) => {
  const muxPlayerRef = React.useRef<HTMLDivElement>()

  lesson = LessonSchema.parse(isSolution ? lesson.solution : lesson)

  return (
    <>
      <VideoProvider
        muxPlayerRef={muxPlayerRef}
        module={module}
        lesson={lesson as Lesson}
        path={path}
      >
        <Layout>
          {lesson.title && lesson.title}
          <Video ref={muxPlayerRef} module={module} lesson={lesson} />
          <GitHubLink lesson={lesson} module={module} />
        </Layout>
      </VideoProvider>
    </>
  )
}

export default LessonPage

type VideoProps = {
  module: SanityDocument
  lesson: Lesson
  ref: any
}

const Video: React.FC<VideoProps> = React.forwardRef(
  ({module, lesson}, ref: any) => {
    const {subscriber, loadingSubscriber} = useConvertkit()
    const islesson = Boolean(lesson._type === 'lesson')
    const {muxPlayerProps, displayOverlay, nextLesson} = useMuxPlayer()

    const canShowVideo =
      (subscriber || lesson._id === module.lessons[0]._id) &&
      lesson.muxPlaybackId

    return (
      <>
        {displayOverlay && (
          <>{nextLesson ? <>{islesson ? 'lol' : 'lol'}</> : 'lol'}</>
        )}
        <div
          className={cx('relative flex w-full items-center justify-center', {
            hidden: displayOverlay,
          })}
        >
          {canShowVideo ? (
            <MuxPlayer ref={ref} {...(muxPlayerProps as MuxPlayerProps)} />
          ) : (
            <>{loadingSubscriber ? 'lol' : 'lol'}</>
          )}
        </div>
      </>
    )
  },
)

const GitHubLink: React.FC<{
  lesson: Lesson
  module: SanityDocument
}> = ({lesson, module}) => {
  const {github} = module

  if (!github || !lesson.stackblitz) {
    return null
  }

  const openFile = lesson.stackblitz?.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="pb-4 text-2xl font-semibold sm:text-3xl">Code</h2>
      <div className="flex items-center gap-2">
        <a
          href={`${github.repo}/tree/main/${openFile}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded border border-gray-700/50 bg-gray-800/50 py-5 px-6 text-lg font-medium text-white transition hover:bg-slate-800/90"
        >
          <p className="h-14 w-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="font-medium text-gray-400"></span>
            </p>
            <p className="font-mono text-sm text-gray-400">/{openFile}</p>
          </div>
        </a>
      </div>
    </div>
  )
}
