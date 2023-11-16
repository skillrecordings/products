import React from 'react'
import Layout from '@/components/app/layout'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import {useRouter} from 'next/router'
import {getAllWorkshops} from '@/lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {ProductCTA} from '@/components/product-cta'
import {Product, getProduct} from '@/lib/products'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {trpc} from '@/trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {Progress, Skeleton} from '@skillrecordings/ui'
import {getAllBonuses} from '@/lib/bonuses'
import {cn} from '@skillrecordings/ui/utils/cn'
import Header from '@/components/app/header'
import Container from '@/components/app/container'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()
  const bonuses = await getAllBonuses()
  const defaultProduct = await getProduct(
    process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID as string,
  )

  return {
    props: {modules: workshops, defaultProduct, bonuses},
    revalidate: 10,
  }
}

// There are multiple sections containing arrays of lessons. I'd like to flat map them into a single array of lessons.
const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const WorkshopsPage: React.FC<{
  modules: Module[]
  bonuses?: Module[]
  title: string
  defaultProduct: Product
}> = ({modules, title = 'Professional Workshops', defaultProduct, bonuses}) => {
  const workshops = modules
  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: workshops && workshops[0]?.slug.current,
        moduleType: 'workshop',
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const isRestricted = ability.can('view', 'RegionRestriction')
  const canViewContent = ability.can('view', 'Content')

  return (
    <ModulesTemplate
      title="Professional Workshops"
      modules={modules}
      bonuses={bonuses}
    />
  )
}

export default WorkshopsPage

export const ModulesTemplate: React.FC<{
  modules: Module[]
  bonuses?: Module[]
  title: string
}> = ({title, modules, bonuses}) => {
  const workshops = modules
  return (
    <Layout
      meta={{
        title,
        description: undefined,
        openGraph: {
          images: undefined,
        },
      }}
    >
      <Header
        title={title}
        // slots={[
        //   {
        //     component: (
        //       <>
        //         {canViewContent ? null : (
        //           <ProductCTA
        //             restricted={isRestricted}
        //             className="w-full"
        //             product={defaultProduct}
        //           />
        //         )}
        //       </>
        //     ),
        //   },
        // ]}
      />

      <Container as="main" className="border-b py-10">
        {workshops && (
          <ul className="flex flex-col items-center gap-5">
            {workshops.map((workshop, i) => {
              return (
                <ModuleProgressProvider moduleSlug={workshop.slug.current}>
                  <WorkshopTeaser
                    workshop={workshop}
                    key={workshop.slug.current}
                    index={i}
                  />
                </ModuleProgressProvider>
              )
            })}
          </ul>
        )}
        {bonuses && bonuses.some((bonus) => bonus.state === 'published') && (
          <ul className="flex flex-col gap-5">
            <div className="relative flex items-center justify-center py-5">
              <h3 className="relative z-10 bg-background px-3 py-1 text-center font-mono text-sm font-medium uppercase">
                Bonuses
              </h3>
              <div
                className="absolute h-px w-full bg-foreground/5"
                aria-hidden
              />
            </div>
            {bonuses.map((bonus, i) => {
              return (
                <ModuleProgressProvider moduleSlug={bonus.slug.current}>
                  <WorkshopTeaser
                    workshop={bonus}
                    key={bonus.slug.current}
                    index={i}
                  />
                </ModuleProgressProvider>
              )
            })}
          </ul>
        )}
      </Container>
    </Layout>
  )
}

const WorkshopTeaser: React.FC<{workshop: Module; index: number}> = ({
  workshop,
  index,
}) => {
  const {title, slug, image, description, sections, lessons, moduleType} =
    workshop
  const router = useRouter()
  const moduleProgress = useModuleProgress()
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: slug.current,
        moduleType: moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewContent = ability.can('view', 'Content')
  const ref = React.useRef(null)
  const lessonType =
    (sections && sectionsFlatMap(sections)[0]?._type) ||
    (lessons && lessons[0]._type) ||
    'lesson'

  const instructorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const pathBuilder = (moduleType: string) => {
    switch (moduleType) {
      case 'bonus':
        return '/bonuses/[module]'
      case 'tutorial':
        return '/tutorials/[module]'
      case 'workshop':
        return '/workshops/[module]'
      default:
        return '/workshops/[module]'
    }
  }
  return (
    <motion.li>
      <Link
        className="flex flex-col items-center gap-10 md:flex-row"
        href={{
          pathname: pathBuilder(moduleType),
          query: {
            module: slug.current,
          },
        }}
      >
        {moduleType === 'bonus' ? (
          isModuleInProgress && moduleProgress?.moduleCompleted ? (
            <div
              className={cn(
                'absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-transparent text-xs font-semibold uppercase leading-none tracking-wider text-gray-600 shadow-inner dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400',
                {
                  'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-black':
                    isModuleInProgress && moduleProgress?.moduleCompleted,
                },
              )}
            >
              ✓
            </div>
          ) : null
        ) : null}
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
        <div className="flex w-full flex-col items-center text-center md:items-start md:text-left">
          <div className="flex w-full items-center justify-center gap-3 md:justify-start">
            <h3 className="w-full max-w-xl text-2xl font-semibold sm:text-3xl">
              <Balancer>{title}</Balancer>
            </h3>
          </div>
          {isModuleInProgress ? (
            <div className="mt-3 flex w-full items-center justify-center gap-2 font-mono text-xs md:justify-start">
              <span className="uppercase opacity-75">
                {moduleProgress?.completedLessonCount}/
                {moduleProgress?.lessonCount} completed
              </span>
              <Progress
                value={moduleProgress?.percentComplete}
                className="h-1.5 max-w-[150px] dark:bg-white/5 [&>[data-indicator]]:bg-emerald-500 [&>[data-indicator]]:dark:bg-emerald-300"
                max={100}
              />
            </div>
          ) : null}
          {description && (
            <div className="pt-5">
              <p className="text-gray-600 dark:text-gray-300">
                <Balancer>{description}</Balancer>
              </p>
            </div>
          )}
          <div className="flex flex-row items-center gap-3 pt-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 overflow-hidden rounded-full sm:justify-center">
              <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                <Image
                  src={require('../../../public/instructor.png')}
                  alt={instructorName}
                  width={36}
                  height={36}
                />
              </div>
              <span>{instructorName}</span>
            </div>
            {moduleProgress?.lessonCount && (
              <>
                {'・'}
                <div>
                  {moduleProgress.lessonCount}{' '}
                  {pluralize(lessonType, moduleProgress.lessonCount)}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  )
}
