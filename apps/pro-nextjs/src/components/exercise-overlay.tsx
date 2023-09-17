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
      <div className="relative h-full w-full">
        {resources?.github && (
          <>
            {/* <Image
              src={require('../../public/editor-placeholder.svg')}
              layout="fill"
              className="object-cover object-left-top"
            /> */}
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-16 text-center">
              <p className="font-text pb-4 text-2xl font-semibold">
                Now it’s your turn! Try solving this exercise.
              </p>
              <p className="text-base text-gray-600">
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
                  <p className="py-4 text-base uppercase">or</p>
                  <Button
                    asChild
                    className="flex items-center gap-1 rounded py-4"
                    size="lg"
                  >
                    <Link href={resources.gitpod} target="_blank">
                      <span className="flex items-center">
                        <Icon name="Gitpod" size="20" className="mr-2" />
                        <span>Open in Gitpod</span>
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
              <div className="bottom-10 flex items-center justify-center gap-3 pt-10 md:absolute md:pt-0">
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
        className="flex gap-1 bg-card hover:bg-background hover:text-foreground"
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
          className="flex gap-1 bg-gradient-to-r from-blue-400 to-purple-400 transition hover:brightness-105"
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
          <span className="drop-shadow">Solution</span>{' '}
          <span aria-hidden="true" className="drop-shadow">
            →
          </span>
        </Button>
      )}
    </>
  )
}
