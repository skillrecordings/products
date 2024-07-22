import React from 'react'
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
import {useSession} from 'next-auth/react'
import {type LoginTemplateProps} from '@skillrecordings/skill-lesson/templates/login'
import Spinner from '@/components/spinner'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import SubscribeToReactEmailCourseCta from '@/components/subscribe-react-email-course-cta'
import groq from 'groq'
import {PortableText} from '@portabletext/react'
import ReactMarkdown from 'react-markdown'

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
  convertkitSubscriber?: any // Subscriber
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
  const {setTheme} = useTheme()
  React.useEffect(() => {
    setTheme(theme)
  }, [theme])
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
  subscriber?: any // Subscriber
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
    const isTutorial = module.moduleType === 'tutorial'

    return abilityRulesStatus !== 'success' ? (
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
          <div className="flex w-full max-w-fit flex-col px-5">
            <div>
              <Logo />
              {session ? (
                <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
                  <h1 className="py-4 text-2xl font-bold">
                    You're logged in to {process.env.NEXT_PUBLIC_SITE_TITLE} but
                    don't have access to this video.
                  </h1>
                  <div className="flex w-full max-w-xs flex-col space-y-2">
                    <Button className="w-full" asChild>
                      <Link
                        href={process.env.NEXT_PUBLIC_URL}
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
                  {isTutorial && !canShowVideo && (
                    <div className="relative flex w-full flex-col items-center justify-center  text-white  xl:aspect-video xl:flex-row">
                      <div className="flex w-full items-center justify-center gap-2">
                        <SubscribeToConvertkitForm />
                      </div>

                      <div className="w-full max-w-full sm:pr-5">
                        <div className="prose relative flex w-full max-w-full flex-col border-white/10  p-5 text-white before:absolute before:left-1/2 before:top-[-8px] before:h-4 before:w-4 before:rotate-45 before:border-l before:border-t before:border-gray-700/50  prose-p:mb-0 prose-p:text-gray-300 sm:rounded-lg sm:border xl:max-w-full xl:before:hidden xl:prose-p:mb-0 2xl:prose-p:mb-0">
                          <ReactMarkdown
                            className=""
                            components={{
                              p: ({children}) => (
                                <p style={{marginBottom: '1.0em'}}>
                                  {children}
                                </p>
                              ),
                            }}
                          >
                            {ctaText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isTutorial && !canShowVideo && (
                    <>
                      <div className="flex flex-col items-center text-center">
                        <h1 className="pb-2 pt-4 text-2xl font-bold sm:text-3xl">
                          Get access to{' '}
                          <a
                            href={process.env.NEXT_PUBLIC_URL}
                            className=" underline-offset-2 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {process.env.NEXT_PUBLIC_SITE_TITLE}
                          </a>
                        </h1>
                        <h2 className="opacity-80 sm:text-lg">
                          And continue watching this video
                        </h2>
                      </div>
                      <div className="mx-auto mt-5 flex w-full max-w-[250px] flex-col space-y-3">
                        <Button variant="outline" asChild>
                          <a
                            href="https://epicreact.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 font-semibold text-white hover:bg-blue-400"
                          >
                            Buy {process.env.NEXT_PUBLIC_SITE_TITLE}
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a
                            href="https://epicreact.dev/login"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Log in (Restore purchases)
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
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
    <div className="pt-15 mx-auto flex items-center justify-center">
      <Image
        src="/assets/flying-rocket-light-sm@2x.webp"
        alt=""
        width={300}
        height={273}
        className="mx-auto"
        priority
      />
    </div>
  )
}

const ctaText = `
## This is a free tutorial

In exchange for your email address, you'll get full access to this and other free Epic React tutorials.  

Why? First and foremost, your inbox allows us to directly communicate about the latest Epic React material. This includes free tutorials, tips, and periodic updates about trends, tools, and React happenings that I'm excited about.  

In addition to the piles of free Epic React content, you'll get the earliest access and best discounts to the paid courses when they launch.  

There won't be any spam, and every email you get will have an unsubscribe link.  

If this sounds like a fair trade, let's go!  
`
