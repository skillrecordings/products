import * as React from 'react'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useDeviceDetect} from '@/hooks/use-device-detect'
import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import {defaultHandleContinue} from '@skillrecordings/skill-lesson/video/default-handle-continue'
import {getExerciseGitHubUrl} from '@/exercise/get-exercise-github-url'
import {StackBlitzIframe} from '@/exercise/stackblitz-iframe'
import {ExclamationIcon} from '@heroicons/react/solid'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Link from 'next/link'
import {Button, Skeleton} from '@skillrecordings/ui'
import SetLocalDevPrefsDialog from '@/exercise/local-dev-prefs/dialog'
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui/primitives/dialog'
import {CogIcon} from 'lucide-react'
import {useSession} from 'next-auth/react'
import {cn} from '@skillrecordings/ui/utils/cn'

const enableTerminalTooltip = false

const ExerciseOverlay = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: session} = useSession()
  const [isTooltipDialogOpen, setIsTooltipDialogOpen] = React.useState(false)
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const {github} = module
  const {isSafari, isFirefox} = useDeviceDetect()
  const isStackblitzCompatibleBrowser = !(isSafari || isFirefox)
  const {exerciseGitHubUrl} = getExerciseGitHubUrl({stackblitz, module})

  // Check if stackblitz URL ends with a valid extension
  const validExtensions: string[] = ['.tsx', '.ts', '.js', '.jsx']
  const stackblitzFilename: string = stackblitz?.split('/').pop() || ''
  const stackblitzExtension: string = stackblitzFilename.split('.').pop() || ''
  const isStackblitzSuitable: boolean = validExtensions.includes(
    '.' + stackblitzExtension,
  )

  return (
    <div className=" bg-black/30 ">
      {isStackblitzSuitable ? (
        <>
          <div className="hidden w-full items-center justify-between p-3 pl-5 font-medium sm:flex xl:text-lg">
            <div className="">
              <div>Now it's your turn! Try solving this exercise.</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              {github && <LocalDevActions location="secondary" />}
              <hr className="mx-2 h-8 w-px bg-white/10" />
              <Actions />
            </div>
          </div>
          <div className="relative hidden h-[500px] w-full sm:block xl:h-[750px]">
            <StackBlitzIframe exercise={lesson} module={module} />
            {enableTerminalTooltip && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-gray-900/90 px-3 py-2 text-sm text-gray-300 backdrop-blur-sm">
                <span>
                  💡 Terminal unavailable in embed. Run locally instead.
                </span>
                {session?.user ? (
                  <Button
                    size="sm"
                    className="h-7 gap-1 bg-primary/90 px-2 text-xs font-semibold hover:bg-primary"
                    onClick={() => setIsTooltipDialogOpen(true)}
                  >
                    <CogIcon className="h-3 w-3" /> Configure
                  </Button>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs text-primary underline hover:text-primary/80"
                  >
                    Log in to configure
                  </Link>
                )}
              </div>
            )}
          </div>
          {session?.user && (
            <SetLocalDevPrefsDialog
              resourceId={module._id}
              resourceTitle={module.title}
              githubRepositoryName={module.github?.title as string}
              githubRepositoryUrl={`https://github.com/total-typescript/${module.github?.repo}`}
              isDialogOpen={isTooltipDialogOpen}
              onOpenChange={setIsTooltipDialogOpen}
            >
              <></>
            </SetLocalDevPrefsDialog>
          )}
          {!isStackblitzCompatibleBrowser && (
            <div className="mx-2 mt-2 hidden rounded-md bg-gray-800 px-4 py-3 text-base sm:block">
              <p className="pb-1 font-semibold">
                <ExclamationIcon className="inline-block h-5 w-5 text-cyan-300" />{' '}
                StackBlitz is poorly supported outside of Chrome.
              </p>
              <p>
                {isFirefox && (
                  <>
                    {
                      'Please use Chromium-based browser to work on this exercise. Or '
                    }
                    <a
                      href={`https://gitpod.io#${exerciseGitHubUrl}`}
                      target="_blank"
                      onClick={() => {
                        track('clicked gitpod code link', {
                          lesson: lesson.slug,
                          module: module.slug.current,
                          moduleType: module.moduleType,
                          lessonType: lesson._type,
                        })
                      }}
                      className="text-cyan-200 underline"
                      rel="noreferrer"
                    >
                      view on Gitpod
                    </a>
                    {'.'}
                  </>
                )}
                {isSafari && (
                  <>
                    {
                      'Please use Chromium-based browser to work on this exercise. Or '
                    }
                    <a
                      href={`https://gitpod.io#${exerciseGitHubUrl}`}
                      target="_blank"
                      onClick={() => {
                        track('clicked gitpod code link', {
                          lesson: lesson.slug,
                          module: module.slug.current,
                          moduleType: module.moduleType,
                          lessonType: lesson._type,
                        })
                      }}
                      className="text-cyan-200 underline"
                      rel="noreferrer"
                    >
                      view on Gitpod
                    </a>
                    {'.'}
                  </>
                )}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="aspect-video">
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-5 pb-10 pt-20 text-center md:pb-24 md:pt-16">
            <div className="pb-4">
              <p className="text-2xl font-semibold text-white">
                Now it’s your turn! Try solving this exercise.{' '}
              </p>
              <p className="pt-2 text-xl">
                This exercise needs to be run locally.
              </p>
            </div>
            <div>{module.github && <LocalDevActions />}</div>
            {module?.github?.repo && (
              <p className="pt-3 text-sm text-foreground sm:pt-2">
                Start by cloning the{' '}
                <a
                  className="underline"
                  href={`https://github.com/total-typescript/${module.github.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  project repository
                </a>{' '}
                and follow instructions in the{' '}
                <a
                  className="underline"
                  href={`https://github.com/total-typescript/${module.github.repo}#readme`}
                  target="_blank"
                  rel="noreferrer"
                >
                  README
                </a>{' '}
                to complete this exercise.
              </p>
            )}

            <div className="bottom-10 flex items-center justify-center gap-3 pt-10 md:absolute md:pt-0">
              <Actions />
            </div>
          </div>
        </div>
      )}
      {github?.repo && (
        <div className="flex aspect-video flex-col items-center justify-center gap-5 p-3 text-center sm:hidden">
          <p className="font-text text-3xl font-bold">Now it’s your turn!</p>
          <p className="">
            Try solving this exercise inside{' '}
            <a
              href={`https://github.com/total-typescript/${github.repo}/blob/main/${stackblitz}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-sm bg-gray-800 px-1 py-0.5 font-mono text-sm"
            >
              <Icon name="Github" /> {stackblitz}
            </a>{' '}
            file.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Actions />
          </div>
        </div>
      )}
    </div>
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
        variant="secondary"
        className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
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
          variant="outline"
          className="gap-2 border-primary bg-transparent font-semibold text-primary hover:bg-primary/10 hover:text-primary"
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
            })
          }}
        >
          Solution <span aria-hidden="true">→</span>
        </Button>
      )}
    </>
  )
}

const LocalDevActions = ({
  location = 'default',
}: {
  location?: 'default' | 'secondary'
}) => {
  const {lesson, module} = useLesson()
  const [isPrefsDialogOpen, setIsPrefsDialogOpen] = React.useState(false)
  const router = useRouter()
  const {data: session, status: sessionStatus} = useSession()
  const {data: userPrefs, status: userPrefsStatus} =
    trpc.userPrefs.getLocal.useQuery(
      {
        resourceId: module._id,
      },
      {
        enabled: Boolean(session?.user && module),
      },
    )
  const {data: stackblitz, status: stackblitzStatus} =
    trpc.stackblitz.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })
  const canOpenExerciseInLocalEditor = Boolean(userPrefs)
  const openInLocalEditorUrl = userPrefs?.editorLaunchProtocol.includes(
    'jetbrains',
  )
    ? `jetbrains://web-storm/navigate/reference?project=${
        module?.github?.repo
      }&path=${stackblitz?.split(',')[0]}`
    : `${userPrefs?.editorLaunchProtocol}${userPrefs?.localDirectoryPath}/${
        stackblitz?.split(',')[0]
      }`

  const {exerciseGitHubUrl} = getExerciseGitHubUrl({stackblitz, module})

  return (
    <>
      <div className="flex w-full gap-1">
        {userPrefsStatus === 'loading' ||
        stackblitzStatus === 'loading' ||
        sessionStatus === 'loading' ? (
          <Skeleton className="flex h-10 w-full min-w-[250px] rounded-lg bg-white/10" />
        ) : session?.user ? (
          <>
            {canOpenExerciseInLocalEditor ? (
              <div className="flex items-center">
                <Button
                  asChild
                  disabled={!canOpenExerciseInLocalEditor}
                  className="rounded-r-none font-semibold"
                >
                  <Link href={openInLocalEditorUrl}>Open in Editor</Link>
                </Button>
                <SetLocalDevPrefsDialog
                  resourceId={module._id}
                  resourceTitle={module.title}
                  githubRepositoryName={module.github?.title as string}
                  githubRepositoryUrl={`https://github.com/total-typescript/${module.github?.repo}`}
                  isDialogOpen={isPrefsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-1 rounded-l-none bg-primary/80 px-2.5">
                      <CogIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </SetLocalDevPrefsDialog>
              </div>
            ) : (
              <SetLocalDevPrefsDialog
                resourceId={module._id}
                resourceTitle={module.title}
                githubRepositoryName={module.github?.title as string}
                githubRepositoryUrl={`https://github.com/total-typescript/${module.github?.repo}`}
                isDialogOpen={isPrefsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant={location}
                    className={cn('gap-2', {
                      'border border-white/5 bg-white/5 text-white hover:bg-white/10':
                        location === 'secondary',
                      'bg-primary font-semibold': location === 'default',
                    })}
                  >
                    <CogIcon className="h-4 w-4" /> Configure Local Development
                  </Button>
                </DialogTrigger>
              </SetLocalDevPrefsDialog>
            )}
            {/* <Button
              variant="secondary"
              asChild
              className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href={exerciseGitHubUrl} target="_blank">
                <Icon name="Github" size="16" />
                GitHub
              </Link>
            </Button> */}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-sm">
              <Link href="/login" className="text-primary underline">
                Log in
              </Link>{' '}
              to open in your editor
            </p>
            {/* <Button
              variant="secondary"
              asChild
              className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href={exerciseGitHubUrl} target="_blank">
                <Icon name="Github" size="16" />
                GitHub
              </Link>
            </Button> */}
          </div>
        )}
      </div>
    </>
  )
}
