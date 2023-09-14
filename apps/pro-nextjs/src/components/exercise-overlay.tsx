import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Link from 'next/link'
import {Button} from '@skillrecordings/ui'
import {ExternalLinkIcon} from '@heroicons/react/outline'
import {trpc} from '@/trpc/trpc.client'
import {OverlayWrapper} from '@skillrecordings/skill-lesson/video/video-overlays'

const ExerciseOverlay = () => {
  const {module, lesson} = useLesson()

  const {github} = module

  // const {data: lessonResources, status: lessonResourcesStatus} =
  //   trpc.lessonResources.byLessonSlug.useQuery({slug: lesson.slug})
  // const workshopAppDetails = lessonResources && lessonResources.workshopApp

  // const {data: moduleResources, status: moduleResourcesStatus} =
  //   trpc.moduleResources.byModuleSlug.useQuery({slug: module.slug.current!})
  // const workshopApp = moduleResources && moduleResources.workshopApp

  return (
    <OverlayWrapper>
      <div>
        TODO: Instructions for running the exercise locally + GitPod link.
        {github?.repo && (
          <div className="mx-auto flex w-full max-w-lg flex-col items-center space-y-5 text-center">
            <p className="font-text text-3xl font-bold">Now it’s your turn!</p>
            <p>
              Exercises are best experienced in Workshop App. Start by clonning{' '}
              <a
                className="underline"
                href={github.repo}
                target="_blank"
                rel="noreferrer"
              >
                workshop repository
              </a>{' '}
              and follow instructions in the{' '}
              <a
                className="underline"
                href={`${github.repo}#setup`}
                target="_blank"
                rel="noreferrer"
              >
                README
              </a>{' '}
              to complete the exercise.
            </p>
            {/* {workshopAppDetails && (
            <div className="flex flex-col gap-2">
              <Button asChild variant="secondary" className="gap-2" size={'lg'}>
                <a
                  href={`http://localhost:${workshopApp?.localhost?.port}${workshopAppDetails?.path}`}
                  target="_blank"
                  onClick={() => {
                    track('clicked open in workshop app', {
                      lesson: lesson.slug,
                      module: module.slug.current,
                      location: 'exercise',
                      moduleType: module.moduleType,
                      lessonType: lesson._type,
                    })
                  }} rel="noreferrer"
                >
                  Open in Workshop App <ExternalLinkIcon className="w-4" />
                </a>
              </Button>
              {workshopApp?.localhost?.port && (
                <p className="text-sm opacity-80">
                  App must be running on localhost:{workshopApp.localhost.port}
                </p>
              )}
            </div>
          )} */}
            <hr className="h-px w-8 bg-foreground/10" />
            <div className="flex items-center justify-center gap-3 pt-2">
              <Actions />
            </div>
          </div>
        )}
      </div>
    </OverlayWrapper>
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
          className="flex gap-1"
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
