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

  const exerciseDir =
    resources && resources.gitpod && extractFolderFromUrl(resources.gitpod)

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
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-5 pb-10 pt-20 text-center md:pb-24 md:pt-16">
              <p className="font-text pb-8 text-2xl font-semibold">
                Now it’s your turn! Try solving this exercise.
              </p>
              <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
                <div className="md:max-w-sm">
                  <h2 className="pb-3 text-base font-medium tracking-wide">
                    Run locally (preferred)
                  </h2>
                  <div>
                    {resources.github && (
                      <Button
                        asChild
                        className="group relative flex items-center rounded-l bg-transparent pl-0 pr-0"
                        size="lg"
                      >
                        <Link href={resources.github} target="_blank">
                          <span className="flex h-full items-center rounded-l bg-primary pl-7 pr-2">
                            <Icon name="Github" size="20" className="mr-2" />
                            Exercise Files
                          </span>
                          <span className="flex h-full items-center justify-center rounded-r bg-primary pr-7 text-sm text-gray-300 transition group-hover:text-white">
                            /{exerciseDir}
                          </span>
                        </Link>
                      </Button>
                    )}
                  </div>
                  {module?.github?.repo && (
                    <p className="pt-2 text-base text-gray-600">
                      Start by cloning the{' '}
                      <a
                        className="underline"
                        href={module.github.repo}
                        target="_blank"
                        rel="noreferrer"
                      >
                        project repository
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
                      to complete this exercise.
                    </p>
                  )}
                </div>
                {resources?.gitpod && (
                  <div>
                    <p className="pb-3 text-base font-medium tracking-wide">
                      or
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="flex items-center gap-1 rounded py-4 hover:bg-gray-100 hover:text-foreground"
                      size="lg"
                    >
                      <Link href={resources.gitpod} target="_blank">
                        <span className="flex items-center">
                          <Icon name="Gitpod" size="20" className="mr-2" />
                          <span>Open in Gitpod</span>
                        </span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
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

function extractFolderFromUrl(url: string): string | null {
  const match = url.match(/#folder=([^/]+)/)
  return match ? match[1] : null
}
