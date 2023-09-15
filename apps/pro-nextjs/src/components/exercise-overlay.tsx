import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Link from 'next/link'
import {Button} from '@skillrecordings/ui'
import {ExternalLinkIcon} from '@heroicons/react/outline'
import {trpc} from '@/trpc/trpc.client'
import {OverlayWrapper} from '@skillrecordings/skill-lesson/video/video-overlays'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import Image from 'next/legacy/image'

const ExerciseOverlay = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: resources} = trpc.lessonResources.byLessonSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })

  // const {data: lessonResources, status: lessonResourcesStatus} =
  //   trpc.lessonResources.byLessonSlug.useQuery({slug: lesson.slug})
  // const workshopAppDetails = lessonResources && lessonResources.workshopApp

  // const {data: moduleResources, status: moduleResourcesStatus} =
  //   trpc.moduleResources.byModuleSlug.useQuery({slug: module.slug.current!})
  // const workshopApp = moduleResources && moduleResources.workshopApp

  return (
    <OverlayWrapper>
      <div>
        {resources?.github && (
          <>
            <Image
              src={require('../../public/editor-placeholder.svg')}
              layout="fill"
              className="object-cover object-left-top"
            />
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-center text-white">
              <p className="font-text text-3xl font-bold text-white">
                Now it’s your turn! Try solving this exercise
              </p>
              <p>
                Start by cloning{' '}
                <a
                  className="underline"
                  href={resources.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  the repository
                </a>{' '}
                and follow instructions in the{' '}
                <a
                  className="underline"
                  href={`${resources.github}#readme`}
                  target="_blank"
                  rel="noreferrer"
                >
                  README
                </a>{' '}
                to complete the exercise.
              </p>
              {resources?.gitpod && (
                <>
                  <p className="text-lg font-semibold sm:text-xl">or</p>
                  <Button
                    variant="link"
                    className="flex items-center gap-1 bg-orange-600 text-white"
                  >
                    <Link href={resources.gitpod}>
                      <span className="flex items-center">
                        <Icon name="Gitpod" size="20" className="mr-2" />
                        <span> Run on Gitpod</span>
                      </span>
                    </Link>
                  </Button>
                </>
              )}
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
          </>
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
