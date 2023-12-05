import React from 'react'
import {GetServerSideProps, NextApiRequest} from 'next'
import {getSection} from '@/lib/sections'
import {getExercise} from '@/lib/exercises'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {VideoResourceProvider} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  VideoProvider,
  useMuxPlayer,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {LessonProvider} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {useRouter} from 'next/router'
import pluralize from 'pluralize'
import {trpc} from '@/trpc/trpc.client'
import {getCsrfToken, getProviders, signIn, useSession} from 'next-auth/react'
import {type LoginTemplateProps} from '@skillrecordings/skill-lesson/templates/login'
import Spinner from '@/components/spinner'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'
import {
  UserSchema,
  createAppAbility,
  defineRulesForPurchases,
} from '@skillrecordings/skill-lesson/utils/ability'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '@skillrecordings/skill-lesson/utils/ck-subscriber-from-cookie'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getVideoResource} from '@skillrecordings/skill-lesson/lib/video-resources'
import {getWorkshop} from '@/lib/workshops'

export type VideoEmbedPageProps = {
  module: Module
  section: Section
  lesson: Lesson
  videoResourceId: string
  theme: 'light' | 'dark'
  login: LoginTemplateProps
  videoResource?: {
    _id?: string
    muxPlaybackId?: string
    transcript?: string | null | any
  }
  convertkitSubscriber?: any
  abilityRules: any
}

const EmbedTemplate: React.FC<VideoEmbedPageProps> = ({
  module,
  section,
  lesson,
  videoResourceId,
  videoResource,
  theme = 'light',
  login,
  abilityRules,
  convertkitSubscriber,
}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const router = useRouter()
  const path = `/${pluralize(module.moduleType)}`
  const addProgressMutation = trpc.progress.add.useMutation()

  const thumbnail = `${process.env.NEXT_PUBLIC_URL}/api/video-thumb?videoResourceId=${videoResourceId}`

  return (
    <div
      data-video-embed-page=""
      data-theme={theme}
      className="
        relative flex aspect-video h-full w-full items-center justify-center "
    >
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full opacity-10 blur-sm dark:opacity-10"
        style={{
          backgroundImage: `url(${thumbnail})`,
          backgroundSize: 'cover',
        }}
      />
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
              <Video
                theme={theme}
                ref={muxPlayerRef}
                videoResource={videoResource}
                videoResourceId={videoResourceId}
                lesson={lesson}
                module={module}
                section={section}
                subscriber={convertkitSubscriber}
                abilityRules={abilityRules}
              />
            </VideoProvider>
          </VideoResourceProvider>
        </LessonProvider>
      </ModuleProgressProvider>
    </div>
  )
}

type VideoProps = Pick<VideoEmbedPageProps, 'theme'> & {
  videoResourceId: string
  module: Module
  section: Section
  lesson: Lesson
  abilityRules: any
  subscriber?: any
  videoResource?: {
    _id?: string
    muxPlaybackId?: string
    transcript?: string | null | any
  }
}

const Video: React.FC<
  {
    ref: React.ForwardedRef<MuxPlayerRefAttributes>
  } & VideoProps
> = React.forwardRef<MuxPlayerRefAttributes, VideoProps>(
  (
    {
      theme,
      videoResourceId,
      videoResource: initialVideoResource,
      module,
      section,
      lesson,
      abilityRules: initialAbilityRules,
      subscriber,
    },
    ref,
  ) => {
    const {muxPlayerProps} = useMuxPlayer()

    const {
      data: abilityRules,
      status: abilityRulesStatus,
      refetch: refetchAbility,
    } = trpc.modules.rules.useQuery(
      {
        moduleSlug: module.slug.current,
        moduleType: module.moduleType,
        lessonSlug: lesson.slug,
        sectionSlug: section?.slug,
        isSolution: lesson._type === 'solution',
        convertkitSubscriberId: subscriber?.id,
      },
      {
        refetchOnWindowFocus: true,
        staleTime: 5000,
        refetchInterval: 5000,
        placeholderData: initialAbilityRules,
        initialData: initialAbilityRules,
      },
    )

    const ability = createAppAbility(abilityRules || [])

    const canShowVideo = ability.can('view', 'Content')

    const {
      data: videoResource,
      status: videoResourceStatus,
      refetch: refetchVideoResource,
    } = trpc.videoResource.byId.useQuery(
      {id: Boolean(canShowVideo) ? videoResourceId : ''},
      {
        refetchOnWindowFocus: true,
        staleTime: 5000,
        refetchInterval: 5000,
        placeholderData: initialVideoResource,
        initialData: initialVideoResource,
        enabled: canShowVideo,
      },
    )

    const {data: session} = useSession()

    return abilityRulesStatus === 'loading' ? (
      <Spinner className="h-8 w-8 sm:h-10 sm:w-10" />
    ) : (
      <>
        {videoResource ? (
          <MuxPlayer
            ref={ref}
            thumbnailTime={0}
            {...(muxPlayerProps as MuxPlayerProps)}
            playbackId={videoResource.muxPlaybackId}
          />
        ) : (
          <div className="flex w-full max-w-lg flex-col px-5">
            <div>
              <Logo />
              {session ? (
                <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                  <h1 className="py-4 text-2xl font-bold">
                    You're logged in to Epic Web but don't have access to this
                    video.
                  </h1>
                  <div className="flex w-full max-w-xs flex-col space-y-2">
                    <Button className="w-full" asChild>
                      <Link
                        href="https://epicweb.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Access
                      </Link>
                    </Button>
                    <Button className="w-full" asChild variant="ghost">
                      <a
                        href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                      >
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center">
                    <h1 className="pb-2 pt-4 text-2xl font-bold sm:text-3xl">
                      Get access to{' '}
                      <a
                        href="https://epicweb.dev"
                        className="decoration-primary underline-offset-2 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        EpicWeb.dev
                      </a>
                    </h1>
                    <h2 className="opacity-80 sm:text-lg">
                      And continue watching this video
                    </h2>
                  </div>
                  <div className="mx-auto mt-5 flex w-full max-w-[250px] flex-col space-y-3">
                    <Button asChild>
                      <a
                        href="https://epicweb.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold"
                      >
                        Buy Epic Web
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href="https://epicweb.dev/login"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Log in (Restore purchases)
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    )
  },
)

export default EmbedTemplate

const Logo = () => {
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

function stripAfterLastSlash(input: string): string {
  const lastSlashIndex = input.lastIndexOf('/')
  if (lastSlashIndex !== -1) {
    return input.substring(0, lastSlashIndex)
  }
  // If there is no slash in the string, return the original string
  return input
}
