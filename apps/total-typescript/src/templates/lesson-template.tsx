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
import Navigation from 'components/app/navigation'

const LessonTemplate: React.FC<any> = ({lesson, course}) => {
  const {title, body, video, slug, transcript, stackblitz} = lesson
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
      width: '100%',
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

  const Sidebar = () => {
    return (
      <>
        <div className="bg-slate-900 lg:max-w-xs w-full border-r border-gray-800" />
        <nav className="bg-slate-900 lg:max-w-xs w-full lg:fixed top-0  border-r border-gray-800">
          <div>
            <div className="flex items-center gap-5 px-5 lg:pt-16 pt-5 pb-5 bg-blue-600">
              <img src={course.image} className="w-20" />
              <h1 className="text-xl font-bold leading-tight font-text">
                <Link
                  href={{pathname: '/[course]', query: {course: course.slug}}}
                  passHref
                >
                  <a>{course.title}</a>
                </Link>
              </h1>
            </div>
            <h3 className="py-5 text-sm opacity-80 font-semibold uppercase px-5">
              Lessons
            </h3>
            <ul className="text-lg flex flex-col divide-y divide-black/20">
              {course.resources.map((resource: any, i: number) => {
                const isActive = router.asPath.includes(resource.slug)
                if (resource._type === 'section')
                  return (
                    <li key={resource.slug}>
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
                            <li key={lesson.slug}>
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
                                    'flex items-center py-3 px-7 border-l-4 text-base font-medium hover:bg-slate-400/20',
                                    {
                                      'border-indigo-500 bg-white/10': isActive,
                                      'border-transparent bg-white/5':
                                        !isActive,
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
                            'flex items-center py-3 px-5 border-l-4 text-base font-medium hover:bg-slate-400/20',
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
          </div>
        </nav>
      </>
    )
  }

  const OverlayEndOfChallenge = () => {
    return (
      <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video">
        <div className="z-20 absolute left-0 top-0 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
          <p className="text-3xl font-bold font-text">Now it’s your turn!</p>
          <p className="flex flex-wrap gap-1">
            Try solving this challenge inside{' '}
            <a
              href="#embed"
              className="flex items-center justify-center gap-1 font-mono text-sm py-0.5 px-1 bg-gray-800 rounded-sm"
            >
              <IconGithub /> {stackblitz.openFile}
            </a>{' '}
            file.
          </p>
          <div className="flex items-center justify-center gap-5">
            <button
              className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
              onClick={() => {
                setEnded(false)
                muxPlayerRef.current.play()
              }}
            >
              replay
            </button>
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
      </div>
    )
  }

  const OverlayEndOfSolution = () => {
    return (
      <div className="absolute top-0 left-0 flex items-center justify-center w-full bg-[#070B16] aspect-video">
        <div className="z-20 absolute left-0 top-0 w-full h-full flex flex-col gap-5 items-center justify-center text-center leading-relaxed text-lg">
          <p className="text-3xl font-bold font-text">Placeholder</p>
          <div className="flex items-center justify-center gap-5">
            <button
              className="bg-gray-900 px-5 py-3 text-lg font-semibold rounded"
              onClick={() => {
                setEnded(false)
                muxPlayerRef.current.play()
              }}
            >
              replay
            </button>
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
      </div>
    )
  }

  // VIDEO LOGIC

  const autoPlay = false
  const [isPlaying, setPlaying] = React.useState(autoPlay)
  const [hasEnded, setEnded] = React.useState(false)
  const muxPlayerRef = React.useRef<any>()
  React.useEffect(() => {
    setEnded(false)
  }, [lesson])
  const isChallenge = title.includes('Exercise') // TODO: come up with better solution such as a type field on resource (?)

  return (
    <Layout meta={{title}} nav={null} className="bg-gray-900">
      <div className="flex lg:flex-row flex-col-reverse">
        <Sidebar />
        <div className="w-full relative">
          <Navigation className="flex relative w-full justify-between" />
          <main className="relative">
            {hasEnded && (
              <>
                {isChallenge ? (
                  <OverlayEndOfChallenge />
                ) : (
                  <OverlayEndOfSolution />
                )}
              </>
            )}
            <div
              className={cx(
                'flex items-center justify-center w-full aspect-video relative',
                {
                  'opacity-0': hasEnded,
                },
              )}
            >
              <MuxPlayer
                onEnded={() => {
                  setEnded(true)
                  console.log('on ended')
                }}
                streamType="on-demand"
                playbackId={video}
                // debug
                autoPlay={autoPlay}
                currentTime={50}
                ref={muxPlayerRef}
                onProgress={() => {
                  console.log('on progress')
                }}
                onDurationChange={() => {
                  console.log('on duration change')
                }}
                onPlay={() => {
                  setPlaying(true)
                }}
                onPause={() => {
                  setPlaying(false)
                }}
                // metadata={{
                //   video_id: 'video-id-54321',
                //   video_title: 'Test video title',
                //   viewer_user_id: 'user-id-007',
                // }}
              />
            </div>
            <div>
              {/* <div className="flex items-center justify-between text-white px-5 h-20">
                <div className="" />
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/mattpocock/zod-tutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-800/50 text-white rounded px-4 py-3 text-lg font-medium"
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
              </div> */}
              <article className="mx-auto lg:p-10 p-5">
                <h1 className="font-text text-4xl font-bold">{title}</h1>
                <div className="pt-5 opacity-90 prose sm:prose-lg max-w-none">
                  <PortableText value={body} />
                </div>
              </article>
              <div className="lg:px-10 px-5">
                <h2 className="font-text text-2xl font-bold pb-2">Editor</h2>
                <div id="embed" className="h-[800px] mx-auto" />
              </div>
            </div>
            <article className="prose prose-lg max-w-4xl text-white mx-auto p-10">
              <h3>Video Transcript</h3>
              <PortableText
                value={transcript}
                components={
                  {
                    block: {
                      normal: ({children}: any) => {
                        const arrayChildren = React.Children.toArray(children)
                        const newChildren = arrayChildren.map(
                          (children: any) => {
                            if (typeof children === 'string') {
                              const match: any = children.match(
                                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/,
                              )
                              if (match) {
                                return (
                                  <p>
                                    <button
                                      className="underline inline-block after:inline-block after:content-[' ']"
                                      onClick={() => {
                                        muxPlayerRef.current.currentTime =
                                          hmsToSeconds(children)
                                        muxPlayerRef.current.play()
                                        window.scrollTo({top: 80})
                                      }}
                                    >
                                      {match && match[0]}{' '}
                                    </button>
                                    {children.replace(match[0], '')}
                                  </p>
                                )
                              }
                            }

                            return children
                          },
                        )

                        return newChildren || children
                      },
                    },
                  } as any
                }
              />
            </article>
          </main>
        </div>
      </div>
    </Layout>
  )
}

export default LessonTemplate

function hmsToSeconds(str: any) {
  let p = str.split(':'),
    s = 0,
    m = 1

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10)
    m *= 60
  }
  return s
}

const IconGithub: React.FC<{className?: string}> = ({
  className = 'w-4 h-4',
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <title>logo-github</title>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6 C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5 c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1 c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8 c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2 c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z"
        ></path>
      </g>
    </svg>
  )
}
