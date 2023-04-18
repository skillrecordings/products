import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useDeviceDetect} from 'hooks/use-device-detect'
import {useRouter} from 'next/router'
import {trpc} from 'trpc/trpc.client'
import {handleContinue} from '@skillrecordings/skill-lesson/video/video-overlays'
import {getExerciseGitHubUrl} from 'exercise/get-exercise-github-url'
import {StackBlitzIframe} from 'exercise/stackblitz-iframe'
import {ExclamationIcon} from '@heroicons/react/solid'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'

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

  return (
    <div className=" bg-black/30 ">
      {stackblitz ? (
        <>
          <div className="flex w-full items-center justify-between p-3 pl-5 font-medium sm:text-lg">
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
        github?.repo && (
          <div className="aspect-video">
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
            <Actions />
          </div>
        )
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
  const {nextExercise, path, handlePlay, muxPlayerRef} = useMuxPlayer()
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
          className="rounded bg-cyan-600 px-3 py-1 text-lg font-semibold transition hover:bg-cyan-500 sm:px-5 sm:py-2"
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
