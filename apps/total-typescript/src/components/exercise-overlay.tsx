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
import {Button} from '@skillrecordings/ui'
import SetLocalDevPrefsDialog from '@/exercise/local-dev-prefs/dialog'
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui/primitives/dialog'
import {CogIcon} from 'lucide-react'

const ExerciseOverlay = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
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
  const [isPrefsDialogOpen, setIsPrefsDialogOpen] = React.useState(false)

  return (
    <div className=" bg-black/30 ">
      {isStackblitzSuitable ? (
        <>
          <div className="hidden w-full items-center justify-between p-3 pl-5 font-medium sm:flex sm:text-lg">
            <div className="flex flex-col">
              <div>Now it's your turn! Try solving this exercise.</div>
            </div>
            <div className="flex justify-center gap-2">
              <Actions />
            </div>
          </div>
          <div className="relative hidden h-[500px] w-full sm:block xl:h-[750px]">
            <StackBlitzIframe exercise={lesson} module={module} />
          </div>
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
            <div className="pb-8">
              <p className="text-2xl font-semibold">
                Now it’s your turn! Try solving this exercise.{' '}
              </p>
              <p className="text-xl">This exercise needs to be run locally</p>
            </div>
            <div>
              {module.github && (
                <>
                  <div className="flex space-x-4">
                    <SetLocalDevPrefsDialog
                      resourceId={lesson._id}
                      resourceTitle={module.title}
                      githubRepositoryName={module?.github?.title as string}
                      githubRepositoryUrl={exerciseGitHubUrl as string}
                      isDialogOpen={isPrefsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="group relative flex flex-col items-center rounded-l pl-7 pr-7 sm:flex-row"
                          size="lg"
                        >
                          <CogIcon className="mr-2 h-4 w-4" /> Configure Local
                          Development
                        </Button>
                      </DialogTrigger>
                    </SetLocalDevPrefsDialog>
                    <Button
                      asChild
                      className="group relative flex flex-col items-center rounded-l bg-transparent pl-0 pr-0 sm:flex-row"
                      size="lg"
                    >
                      <Link href={exerciseGitHubUrl} target="_blank">
                        <span className="flex h-full flex-shrink-0 items-center rounded bg-gray-800 pl-7 pr-7 text-white sm:rounded-l sm:rounded-r-none sm:pr-2">
                          <Icon name="Github" size="20" className="mr-2" />
                          Exercise Files
                        </span>
                        <span className="-ml-px hidden h-full flex-shrink-0 items-center justify-center rounded-r bg-gray-800 pr-7 text-sm text-white transition sm:flex">
                          /{stackblitz}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
            {module?.github?.repo && (
              <p className="pt-3 text-sm text-gray-200 sm:pt-2">
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
      <button
        className="rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-2"
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
      </button>
      {nextExercise && (
        <button
          className="rounded bg-primary px-3 py-1 text-lg font-semibold text-primary-foreground transition hover:brightness-105 sm:px-5 sm:py-2"
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
        </button>
      )}
    </>
  )
}
