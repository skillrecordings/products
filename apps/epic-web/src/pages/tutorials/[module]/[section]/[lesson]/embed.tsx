import React from 'react'
import {GetServerSideProps} from 'next'
import {getTutorial} from 'lib/tutorials'
import {getSection} from 'lib/sections'
import {getExercise} from 'lib/exercises'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {useTheme} from 'next-themes'
import {
  VideoResourceProvider,
  useVideoResource,
} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  VideoProvider,
  useMuxPlayer,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import MuxPlayer, {
  MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {useRouter} from 'next/router'
import pluralize from 'pluralize'
import {trpc} from 'trpc/trpc.client'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/ui/templates/login'
import Spinner from 'components/spinner'

export const getServerSideProps: GetServerSideProps = async (context) => {
  // resource
  const {query} = context
  const {params} = context
  const lessonSlug = params?.lesson as string
  const sectionSlug = params?.section as string
  const moduleSlug = params?.module as string
  const module = await getTutorial(moduleSlug)
  const section = await getSection(sectionSlug)
  const lesson = await getExercise(lessonSlug, false)
  const videoResourceId = lesson.videoResourceId

  // login
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  // theme
  const theme = query.theme || 'dark'

  return {
    props: {
      module,
      section,
      lesson,
      videoResourceId,
      theme,
      login: {
        providers,
        csrfToken,
      },
    },
  }
}

type VideoEmbedPageProps = {
  module: Module
  section: Section
  lesson: Lesson
  videoResourceId: string
  theme: 'light' | 'dark'
  login: LoginTemplateProps
}

const VideoEmbedPage: React.FC<VideoEmbedPageProps> = ({
  module,
  section,
  lesson,
  videoResourceId,
  theme,
  login,
}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const router = useRouter()
  const path = `/${pluralize(module.moduleType)}`
  const addProgressMutation = trpc.progress.add.useMutation()
  const {setTheme} = useTheme()
  React.useEffect(() => {
    setTheme(theme)
  }, [theme])

  return (
    <div
      data-video-embed-page=""
      data-theme={theme}
      className="
        flex aspect-video h-full w-full items-center justify-center"
    >
      <ModuleProgressProvider moduleSlug={module.slug.current}>
        <LessonProvider lesson={lesson} module={module} section={section}>
          <VideoResourceProvider videoResourceId={videoResourceId}>
            <VideoProvider
              muxPlayerRef={muxPlayerRef}
              exerciseSlug={router.query.lesson as string}
              path={path}
              onModuleEnded={async () => {
                addProgressMutation.mutate({
                  lessonSlug: router.query.lesson as string,
                })
              }}
            >
              <Video theme={theme} login={login} />
            </VideoProvider>
          </VideoResourceProvider>
        </LessonProvider>
      </ModuleProgressProvider>
    </div>
  )
}

const Video: React.FC<
  Pick<VideoEmbedPageProps, 'theme'> & Pick<VideoEmbedPageProps, 'login'>
> = ({theme, login}) => {
  const {csrfToken, providers} = login
  const {videoResource, loadingVideoResource} = useVideoResource()
  const {muxPlayerProps, canShowVideo, loadingUserStatus} = useMuxPlayer()

  return (
    <>
      {loadingVideoResource || loadingUserStatus ? (
        <Spinner className="h-8 w-8 sm:h-10 sm:w-10" />
      ) : (
        <>
          {Boolean(canShowVideo && videoResource?.muxPlaybackId) ? (
            <MuxPlayer
              {...(muxPlayerProps as MuxPlayerProps)}
              theme={theme}
              playbackId={videoResource?.muxPlaybackId}
            />
          ) : (
            <LoginTemplate
              title="Log in to Epic Web"
              image={<LoginImage />}
              csrfToken={csrfToken}
              providers={providers}
            />
          )}
        </>
      )}
    </>
  )
}

export default VideoEmbedPage

const LoginImage = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto hidden w-16 text-foreground lg:block"
      fill="none"
      viewBox="0 0 70 70"
    >
      <path
        fill="url(#markGradient)"
        d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
      />
      <path
        fill="currentColor"
        d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
      />
      <defs>
        <linearGradient
          id="markGradient"
          x1="49.496"
          x2="20.585"
          y1="20.504"
          y2="49.431"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
