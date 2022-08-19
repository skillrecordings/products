import React from 'react'
import Layout from 'components/app/layout'
import cx from 'classnames'
import sdk from '@stackblitz/sdk'
import MuxPlayer from '@mux/mux-player-react'
import {PortableText} from '@portabletext/react'
import {isSafari, CustomView} from 'react-device-detect'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {find, flatMapDeep, indexOf} from 'lodash'

const LessonTemplate: React.FC<any> = ({lesson, course}) => {
  const {title, video, slug, transcript, stackblitz} = lesson
  React.useEffect(() => {
    sdk.embedProjectId('embed', stackblitz.projectId, {
      forceEmbedLayout: true,
      openFile: stackblitz.openFile,
      showSidebar: false,
      view: 'editor',
      terminalHeight: 40,
      theme: 'dark',
      hideExplorer: true,
      hideNavigation: true,
      clickToLoad: false,
    })
  }, [stackblitz])
  const router = useRouter()

  const getNext = () => {
    const lessons = flatMapDeep(
      course.resources,
      (section) => section.resources,
    )
    const currentLesson = find(lessons, {slug})
    const nextLessonIndex = indexOf(lessons, currentLesson) + 1
    const nextLesson = lessons[nextLessonIndex]
    return nextLesson
  }

  const nextLesson = getNext()

  return (
    <Layout className="bg-black">
      <div className="flex lg:flex-row flex-col-reverse pt-20">
        <nav className="bg-neutral-900/80 lg:max-w-xs w-full">
          <div className="flex items-center gap-5 p-5">
            <img src={course.image} className="w-20" />
            <h1 className="text-xl font-bold leading-tight">
              <Link
                href={{pathname: '/[course]', query: {course: course.slug}}}
                passHref
              >
                <a>{course.title}</a>
              </Link>
            </h1>
          </div>
          <h3 className="pb-5 text-sm opacity-80 font-semibold uppercase px-5">
            Lessons
          </h3>
          <ul className="text-lg flex flex-col divide-y divide-black/20">
            {course.resources.map((resource: any, i: number) => {
              const isActive = router.asPath.includes(resource.slug)
              if (resource._type === 'section')
                return (
                  <li>
                    <div className="px-4 font-semibold pb-2">
                      <span
                        aria-hidden="true"
                        className="text-sm pr-2 opacity-50"
                      >
                        {i + 1}
                      </span>{' '}
                      {resource.title}
                    </div>
                    <ul>
                      {resource.resources.map((lesson: any, i: number) => {
                        const isActive = router.query.lesson === lesson.slug
                        return (
                          <li>
                            <Link
                              href={{
                                pathname: '/[course]/[lesson]',
                                query: {
                                  course: course.slug,
                                  lesson: lesson.slug,
                                },
                              }}
                              passHref
                            >
                              <a
                                className={cx(
                                  'flex items-center py-3 px-7 border-l-4 text-base font-medium hover:bg-neutral-400/20',
                                  {
                                    'border-indigo-500 bg-white/10': isActive,
                                    'border-transparent bg-white/5': !isActive,
                                  },
                                )}
                              >
                                {lesson.title}
                              </a>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              if (resource._type === 'lesson')
                return (
                  <li>
                    <Link
                      href={{
                        pathname: '/[course]/[lesson]',
                        query: {course: course.slug, lesson: resource.slug},
                      }}
                      passHref
                    >
                      <a
                        className={cx(
                          'flex items-center py-3 px-5 border-l-4 text-base font-medium hover:bg-neutral-400/20',
                          {
                            'border-indigo-500 bg-white/10': isActive,
                            'border-transparent bg-white/5': !isActive,
                          },
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="text-sm pr-4 opacity-50"
                        >
                          {i + 1}
                        </span>{' '}
                        {resource.title}
                      </a>
                    </Link>
                  </li>
                )
            })}
          </ul>
        </nav>
        <div className="w-full">
          <main>
            <div className="flex items-center justify-center w-full bg-black">
              <MuxPlayer
                streamType="on-demand"
                playbackId={video}
                // metadata={{
                //   video_id: 'video-id-54321',
                //   video_title: 'Test video title',
                //   viewer_user_id: 'user-id-007',
                // }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-white px-5 h-20">
                <div className="flex items-center gap-10">
                  <div className="text-xl font-medium">Code</div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/mattpocock/zod-tutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-800/50 text-white rounded px-4 py-3 text-lg font-medium"
                  >
                    GitHub
                  </a>
                  {nextLesson && (
                    <Link
                      href={{
                        pathname: '/[course]/[lesson]',
                        query: {
                          course: course.slug,
                          lesson: nextLesson.slug,
                        },
                      }}
                      passHref
                    >
                      <a className="text-lg bg-indigo-500 rounded px-5 py-3 font-semibold">
                        Continue →
                      </a>
                    </Link>
                  )}
                </div>
              </div>
              <div id="embed" className="h-[800px]" />
            </div>
            <article className="prose prose-lg text-white mx-auto p-10">
              <h3>Video Transcript</h3>
              <PortableText value={transcript} />
            </article>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default LessonTemplate
