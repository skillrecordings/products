import React from 'react'
import Layout from '@/components/app/layout'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {getAllWorkshops, Workshop} from '@/lib/workshops'
import {getAllBonuses, type Bonus} from '@/lib/bonuses'
import {Progress} from '@skillrecordings/ui'
import pluralize from 'pluralize'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()
  const bonuses = await getAllBonuses()

  return {
    props: {
      workshops,
      bonuses,
    },
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{
  workshops: Workshop[]
  bonuses: Bonus[]
}> = ({workshops, bonuses}) => {
  return (
    <Layout
      meta={{
        title: `Professional React Workshops from Kent C. Dodds`,
        description: `Professional React workshops by Kent C. Dodds that will help you learn professional web development through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1726226118/epic-react-v2-workshops-card_2x.jpg',
          alt: 'Epic React Workshops',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pt-16">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="flex flex-col text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="mb-2 inline-block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-sm uppercase tracking-widest text-transparent dark:from-blue-300 dark:to-blue-500">
              Professional
            </span>{' '}
            Epic React Workshops
          </h1>
          <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
            <Balancer>
              A collection of exercise-driven, in-depth React workshops.
            </Balancer>
          </h2>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 pb-24 pt-16">
        <ul className="flex flex-col gap-5">
          {[
            ...workshops,
            ...bonuses.filter(
              (module) => module.slug.current === 'interviews-with-experts',
            ),
          ].map((module, i) => {
            return (
              <ModuleProgressProvider
                key={module._id}
                moduleSlug={module.slug.current}
              >
                <Teaser module={module} key={module.slug.current} index={i} />
              </ModuleProgressProvider>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default WorkshopsPage

const Teaser: React.FC<{
  module: Workshop | Bonus
  index?: number
}> = ({module}) => {
  const {title, slug, image, description, moduleType} = module

  const sectionCount =
    'sections' in module
      ? module.sections?.filter((resource: any) => resource._type === 'section')
          .length
      : 0

  const moduleProgress = useModuleProgress()
  const lessonCount = module.lessonCount
  const isBonusModule = module.moduleType === 'bonus'

  return (
    <Link
      className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-md border bg-white p-5 shadow-2xl shadow-gray-500/20 transition dark:bg-white/5 dark:shadow-none dark:hover:bg-gray-800 md:flex-row md:p-10 md:pl-16"
      href={{
        pathname: `/${pluralize(module.moduleType)}/[module]`,
        query: {
          module: slug?.current,
        },
      }}
    >
      {image && (
        <div className="flex items-center justify-center lg:flex-shrink-0">
          <Image
            src={image}
            alt={title}
            width={300}
            quality={100}
            height={300}
            priority
          />
        </div>
      )}
      <div className="flex w-full flex-col items-start text-left">
        {moduleType === 'bonus' && (
          <span className="mb-3 inline-flex rounded-full  bg-gradient-to-b from-[#F2BA24] to-[#FFA721] px-2.5 py-0.5 text-sm font-bold uppercase tracking-wide text-[#442D00] ">
            Bonus
          </span>
        )}
        <div className="flex w-full items-center gap-3">
          <h3 className="w-full max-w-xl text-balance text-2xl font-semibold leading-tight sm:text-3xl">
            {title}
          </h3>
        </div>
        <div className="mt-3 pb-3 font-mono text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
          <>
            {sectionCount !== 0 && <>{sectionCount} sections,</>} {lessonCount}{' '}
            {isBonusModule ? 'interviews' : 'lessons'}
          </>
        </div>
        {moduleProgress ? (
          <div className="flex w-full items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tabular-nums text-blue-500 dark:text-blue-400">
              {moduleProgress.completedLessonCount}/{moduleProgress.lessonCount}{' '}
              completed
            </span>
            <Progress
              className="h-2 max-w-[200px]"
              value={moduleProgress.percentComplete}
            />
          </div>
        ) : (
          <div className="flex h-[16px]" aria-hidden="true" />
        )}
        {description && (
          <div className="w-full pt-3">
            <p className="text-balance text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
