import React from 'react'
import Layout from 'components/app/layout'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import {useRouter} from 'next/router'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {getAllWorkshops} from 'lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {WorkshopAppBanner} from 'components/workshop-app'
import {ProductCTA} from 'components/product-cta'
import {Product, getProduct} from 'lib/products'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {trpc} from 'trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {Skeleton} from '@skillrecordings/ui'
import {getAllBonuses} from 'lib/bonuses'

export async function getStaticProps() {
  const bonuses = await getAllBonuses()
  const fullStackWorkshopSeriesProduct = await getProduct(
    process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
  )

  return {
    props: {bonuses, fullStackWorkshopSeriesProduct},
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

const BonusesPage: React.FC<{
  bonuses: Module[]
  fullStackWorkshopSeriesProduct: Product
}> = ({bonuses, fullStackWorkshopSeriesProduct}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: bonuses[0].slug.current,
        moduleType: 'workshop',
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewContent = ability.can('view', 'Content')

  return (
    <Layout
      meta={{
        title: `Epic Web Bonus Content`,
        description: `Professional Web Development content by Kent C. Dodds that will help you learn professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1694113076/card-workshops_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between px-5 pt-16 lg:flex-row">
        <div className="flex flex-col items-center space-y-3 text-center lg:items-start lg:text-left">
          <h1 className="flex flex-col text-4xl font-semibold">
            Epic Web Bonus Content
          </h1>
          <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
            <Balancer>
              A collection of bonus content featuring interviews with experts.
            </Balancer>
          </h2>
        </div>
        <div className="w-full max-w-md pt-16 lg:pl-8 lg:pt-0">
          {abilityRulesStatus === 'loading' ? (
            <div className="relative">
              <ProductCTA
                product={fullStackWorkshopSeriesProduct}
                className="pointer-events-none select-none opacity-0"
              />
              <Skeleton className="absolute left-0 top-0 h-full w-full rounded-md bg-foreground/5" />
            </div>
          ) : (
            <>
              {canViewContent ? null : (
                <ProductCTA product={fullStackWorkshopSeriesProduct} />
              )}
            </>
          )}
        </div>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 pb-24 pt-16">
        {bonuses && (
          <ul className="flex flex-col gap-5">
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
      </main>
    </Layout>
  )
}

export default BonusesPage

const WorkshopTeaser: React.FC<{workshop: Module; index: number}> = ({
  workshop,
  index,
}) => {
  const {title, slug, image, description, sections} = workshop
  const router = useRouter()
  const moduleProgress = useModuleProgress()
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: workshop.slug.current,
        moduleType: workshop.moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewContent = ability.can('view', 'Content')
  const ref = React.useRef(null)

  return (
    <motion.li
    // initial={{opacity: 0}}
    // whileInView={{
    //   opacity: 1,
    // }}
    // transition={{
    //   type: 'spring',
    //   damping: 20,
    //   stiffness: 100,
    // }}
    >
      <Link
        className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-md border border-gray-100 bg-white bg-gradient-to-tr from-transparent to-white/50 p-10 shadow-soft-xl transition before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:content-[''] dark:border-transparent dark:from-gray-900 dark:to-gray-800 sm:flex-row"
        href={{
          pathname: '/bonuses/[module]',
          query: {
            module: slug.current,
          },
        }}
      >
        <div className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-transparent text-xs font-semibold uppercase leading-none tracking-wider text-gray-600 shadow-inner dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
          {index + 1}
        </div>
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
        <div className="w-full">
          <div className="flex w-full items-center gap-3">
            <h3 className="w-full max-w-xl text-2xl font-semibold sm:text-3xl">
              <Balancer>{title}</Balancer>
            </h3>
          </div>
          {description && (
            <div className="pt-5">
              <p className="text-gray-600 dark:text-gray-300">
                <Balancer>{description}</Balancer>
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 pt-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full">
              <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                <Image
                  src={require('../../../public/kent-c-dodds.png')}
                  alt="Kent C. Dodds"
                  width={36}
                  height={36}
                />
              </div>
              <span>Kent C. Dodds</span>
            </div>
            {'・'}
            {sections && (
              <div>
                {sectionsFlatMap(sections).length}{' '}
                {pluralize(
                  sectionsFlatMap(sections)[0]._type,
                  sectionsFlatMap(sections).length,
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  )
}
