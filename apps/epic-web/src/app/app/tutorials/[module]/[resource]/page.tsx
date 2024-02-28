import {getExercise, type Exercise, getExerciseMedia} from 'lib/exercises'
import {getTutorial, type Tutorial} from 'lib/tutorials'
import {ResourcePlayer} from './_components/resource-player'
import {getServerAuthSession} from 'server/auth'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import {sanityQuery} from 'server/sanity.server'
import type {VideoResource} from 'lib/video-resource'
import {getCurrentAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {ProgressToggle} from './_components/progress-toggle'

const ResourcePage: React.FC<{
  params: {resource: string; module: string}
}> = async ({params}) => {
  const session = await getServerAuthSession()
  const resourceLoader = getExercise(params.resource)
  const moduleLoader = getTutorial(params.module)

  // ——— PROGRESS ———

  //   const lessonIds = module?.sections.flatMap((section: any) =>
  //     section.lessons.flatMap((lesson: any) => lesson._id),
  //   )

  //   const moduleLessonProgress = await prisma.lessonProgress.findMany({
  //     where: {
  //       lessonId: {in: lessonIds},
  //       userId: session?.user?.id,
  //     },
  //   })

  return (
    <div className="flex flex-col">
      <PlayerContainer
        slug={params.resource}
        resourceLoader={resourceLoader}
        moduleLoader={moduleLoader}
      />
      <ProgressToggle session={session} params={params} />
    </div>
  )
}

export default ResourcePage

function PlayerContainerSkeleton() {
  return (
    <div className="flex aspect-video h-full max-h-screen w-full flex-col items-center justify-center bg-foreground text-background">
      Loading...
    </div>
  )
}

async function PlayerContainer({
  slug,
  resourceLoader,
  moduleLoader,
}: {
  slug: string
  resourceLoader: Promise<Exercise | null>
  moduleLoader: Promise<Tutorial | null>
}) {
  const session = await getServerAuthSession()
  const resource = await resourceLoader
  const module = await moduleLoader
  const displayOverlay = false

  if (!resource) {
    notFound()
  }

  const ability = getCurrentAbility({
    user: session?.user,
    lesson: resource,
    module: module as any,
    section: module?.sections[0] as any,
  })
  const videoResourceLoader = sanityQuery<VideoResource>(
    `*[_type == "videoResource" && _id == "${resource.videoResourceId}"][0]`,
    {tags: ['resource', resource._id as string]},
  )

  return (
    <Suspense fallback={<PlayerContainerSkeleton />}>
      {ability.can('view', 'Content') ? (
        <ResourcePlayer
          className="max-h-screen"
          videoResourceLoader={videoResourceLoader}
        />
      ) : (
        <div className="flex aspect-video h-full max-h-screen w-full flex-col items-center justify-center bg-foreground text-background">
          Subscribe
        </div>
      )}
    </Suspense>
  )
}
