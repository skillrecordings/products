import React from 'react'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {motion} from 'framer-motion'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Link from 'next/link'
import {Button} from '@skillrecordings/ui'
import {ExternalLinkIcon} from '@heroicons/react/outline'
import {trpc} from '@/trpc/trpc.client'
import MuxPlayer, {MuxPlayerRefAttributes} from '@mux/mux-player-react'

const ExerciseOverlay = () => {
  const {module, lesson} = useLesson()

  const {data: lessonResources} = trpc.lessonResources.byLessonSlug.useQuery({
    slug: lesson.slug,
  })
  const workshopAppDetailsPath = lessonResources?.workshopApp?.path

  const {data: moduleResources} = trpc.moduleResources.byModuleSlug.useQuery({
    slug: module.slug.current,
    moduleType: module.moduleType as 'tutorial' | 'workshop',
  })
  const workshopApp = moduleResources && moduleResources.workshopApp

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-16 bg-gray-950 py-0 pb-8 text-white dark:bg-black/20 sm:py-10 sm:pb-10">
      <div className="flex w-full flex-col items-center gap-8 p-5">
        <GetStartedVideo
          title={module.title}
          moduleSlug={module.slug.current}
          workshopAppUrl={workshopApp?.external?.url}
          githubRepositoryUrl={module.github?.repo}
        />
        <div className="flex max-w-lg flex-col items-center space-y-5 text-center">
          <p className="font-text text-2xl font-bold sm:text-3xl">
            Stop! 😅 This is not a video course.
          </p>
          <p className="text-lg text-gray-300">
            This {module.moduleType} is intended to be worked through by
            completing hands on exercises in your local development environment.
            It's not meant for passive consumption.
          </p>
          <div className="flex w-full max-w-xs flex-col space-y-3 pt-2">
            <Button
              asChild
              className="w-full bg-blue-500 font-semibold hover:bg-blue-400"
              size="lg"
              onClick={() => {
                track('clicked get started', {
                  lesson: lesson.slug,
                  module: module.slug.current,
                  location: 'exercise',
                  moduleType: module.moduleType,
                  lessonType: lesson._type,
                })
              }}
            >
              <Link
                target="_blank"
                href={`/get-started?module=${module.slug.current}`}
              >
                Get Started
              </Link>
            </Button>
            {workshopAppDetailsPath && (
              <div className="flex w-full flex-col gap-2">
                <Button
                  asChild
                  variant="secondary"
                  className="gap-2 bg-gray-800 hover:bg-gray-700"
                  size={'lg'}
                >
                  <a
                    href={`http://localhost:${workshopApp?.localhost?.port}${workshopAppDetailsPath}`}
                    target="_blank"
                    onClick={() => {
                      track('clicked open in workshop app', {
                        lesson: lesson.slug,
                        module: module.slug.current,
                        location: 'exercise',
                        moduleType: module.moduleType,
                        lessonType: lesson._type,
                      })
                    }}
                    rel="noreferrer"
                  >
                    Open in Workshop App <ExternalLinkIcon className="w-4" />
                  </a>
                </Button>
                {workshopApp?.localhost?.port && (
                  <p className="text-sm opacity-60">
                    Must be running on localhost:
                    {workshopApp.localhost.port}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Actions />
      </div>
    </div>
  )
}

const GetStartedVideo: React.FC<{
  workshopAppUrl?: string
  title: string
  moduleSlug: string
  githubRepositoryUrl?: string | null
}> = ({workshopAppUrl, title, moduleSlug, githubRepositoryUrl}) => {
  const [cuePoint, setCuePoint] = React.useState<{
    href: string
    label: string
  } | null>()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)

  const cuePoints: any = [
    {
      time: 0,
      value: {},
      duration: 12,
    },
    {
      time: 12,
      value: {
        href: `/get-started?module=${moduleSlug}`,
        label: 'Get Started',
      },
      duration: 17,
    },
    {
      time: 12 + 17,
      duration: 20,
      value: {},
    },
    {
      time: 49,
      duration: 18,
      value: {
        href: workshopAppUrl ? workshopAppUrl : '',
        label: `Deployed Workshop App (${title})`,
      },
    },
    {
      time: 91,
      duration: 20,
      value: {
        href: githubRepositoryUrl
          ? `${githubRepositoryUrl}?tab=readme-ov-file#setup`
          : 'https://github.com/epicweb-dev/full-stack-foundations?tab=readme-ov-file#setup',
        label: 'Setup',
      },
    },
    {
      time: 91 + 20,
      value: {},
    },
    {
      time: 1641,
      value: {
        href: '/faq',
        label: 'FAQ',
        duration: 5,
      },
    },
    {
      time: 1641 + 5,
      value: {},
    },
    {
      time: 1655,
      value: {
        href: `/get-started?module=${moduleSlug}`,
        label: 'Get Started',
      },
      duration: 5,
    },
    {
      time: 1655 + 5,
      value: {},
    },
  ]

  return (
    <>
      <div className="relative aspect-video h-full w-full max-w-xl">
        {cuePoint && cuePoint.href && (
          <motion.div
            transition={{
              duration: 0.3,
            }}
            animate={
              cuePoint
                ? {
                    y: [-10, 0],
                    opacity: [0, 1],
                  }
                : {
                    y: [0, -10],
                    opacity: [1, 0],
                  }
            }
            className="absolute right-3 top-3 z-10"
          >
            <Button
              asChild
              className="w-full gap-1 bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-gray-800 hover:underline"
              size="sm"
            >
              <Link href={cuePoint.href} target="_blank">
                {cuePoint.label} <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
        <MuxPlayer
          onLoadedData={(e) => {
            // sometimes teh time was missing so parsing it so it won't crash
            muxPlayerRef.current?.addCuePoints(
              cuePoints.map((cuePoint: any) => ({
                ...cuePoint,
                time: parseFloat(cuePoint.time) || 0,
              })),
            )
          }}
          onCuePointChange={(e) => {
            setCuePoint(e.detail.value)
          }}
          metadata={{
            video_title: `${moduleSlug} - Get Started Video`,
          }}
          ref={muxPlayerRef}
          startTime={0}
          playbackId="zd6jycd4fMq4EB702BpGbimsyj00idemYohCOEopQYe01k"
          accentColor="#3b82f6"
          className="h-full w-full rounded"
          poster="https://res.cloudinary.com/epic-web/image/upload/v1697795383/workshop-app-video-poster.jpg"
        />
      </div>
    </>
  )
}

export default ExerciseOverlay

const Actions = () => {
  const {nextExercise, path, handlePlay, muxPlayerRef, handleContinue} =
    useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()

  return (
    <>
      <Button
        variant="outline"
        className="flex gap-1"
        onClick={() => {
          track('clicked replay', {
            lesson: lesson.slug,
            module: module.slug.current,
            location: 'exercise',
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          if (router.asPath.endsWith('/exercise')) {
            router.push(router.asPath.replace('/exercise', ''))
            if (muxPlayerRef.current) {
              muxPlayerRef.current.currentTime = 0
            }
          }
          handlePlay()
        }}
      >
        <span aria-hidden="true">↺</span> Replay
      </Button>
      {nextExercise && (
        <Button
          variant="secondary"
          className="flex gap-1 bg-gray-800  hover:bg-gray-700"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue({
              router,
              module,
              nextExercise,
              handlePlay,
              path,
              section,
              ignoreSections: true,
            })
          }}
        >
          Solution <span aria-hidden="true">→</span>
        </Button>
      )}
    </>
  )
}
