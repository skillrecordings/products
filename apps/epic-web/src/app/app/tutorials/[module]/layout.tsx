import {getTutorial, type Tutorial} from 'lib/tutorials'
import {Sidebar} from './[resource]/_components/sidebar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@skillrecordings/ui/primitives/resizable'
import {prisma} from '@skillrecordings/database'
import {getServerAuthSession} from 'server/auth'
import {trpc} from 'trpc/trpc.server'
import type {ModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'

type ModuleLayoutProps = {
  params: {module: string; resource?: string}
}

const ModuleLayout: React.FC<
  React.PropsWithChildren<ModuleLayoutProps>
> = async ({children, params}) => {
  const moduleLoader = getTutorial(params.module)
  const module = await moduleLoader
  const session = await getServerAuthSession()
  const lessonIds = module?.sections.flatMap((section: any) =>
    section.lessons.flatMap((lesson: any) => lesson._id),
  )
  const moduleLessonProgress = (await trpc.moduleProgress.bySlug.query({
    slug: params.module,
  })) as ModuleProgress

  // const moduleLessonProgress = await prisma.lessonProgress.findMany({
  //   where: {
  //     lessonId: {in: lessonIds},
  //     userId: session?.user?.id,
  //   },
  // })

  return (
    <div className="flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20}>
          <Sidebar moduleLoader={moduleLoader} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div>{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ModuleLayout
