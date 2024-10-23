import React from 'react'
import Layout from 'components/app/layout'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/legacy/image'
import pluralize from 'pluralize'
import {useRouter} from 'next/router'
import {getAllWorkshops} from 'lib/workshops'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {trpc} from 'trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@skillrecordings/ui'
import {getAllBonuses} from 'lib/bonuses'
import {cn} from '@skillrecordings/ui/utils/cn'

import type {Workshop} from 'lib/workshops'
import {useDebounce} from 'pages/search'
import type {Contributor} from 'lib/contributors'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {Search} from 'lucide-react'
import Spinner from 'components/spinner'
import type {SearchResult} from 'trpc/routers/search'
import {track} from 'utils/analytics'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()
  const bonuses = await getAllBonuses()

  const contributors = await sanityClient.fetch(groq`
  *[_type == 'contributor'] {
    _id,
    name,
    "slug": slug.current,
    picture {
      "url": asset->url,
      alt
    },
    'workshops': *[_type == 'module' && moduleType == 'workshop' && references(^._id)] {
      _id,
    }
  }`)

  const contributorsWithWorkshops = contributors.filter(({workshops}: any) => {
    return workshops.length > 0
  })

  return {
    props: {
      workshops,
      contributors: contributorsWithWorkshops,
      bonuses,
    },
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{
  workshops: Workshop[]
  contributors: Contributor[]
  bonuses?: Module[]
}> = ({contributors, workshops, bonuses}) => {
  const [query, setQuery] = React.useState('')
  const [contributor, setContributor] = React.useState('')

  const router = useRouter()

  React.useEffect(() => {
    router.query.q && setQuery(router.query.q.toString())
    router.query.c && setContributor(router.query.c.toString())
  }, [router])

  const debouncedQuery = useDebounce(query, 500)
  const {data: resultsForQuery, isFetching} =
    trpc.search.resultsForQuery.useQuery(
      {
        query: debouncedQuery,
        resourceType: 'module',
        moduleTypes: ['workshop', 'bonus'],
        orderBy: 'newest',
        contributor,
      },
      {
        initialData: workshops,
      },
    )

  console.log('resultsForQuery', resultsForQuery)

  return (
    <Layout
      meta={{
        title: `Professional Web Development Workshops from Kent C. Dodds`,
        description: `Professional Web Development workshops by Kent C. Dodds that will help you learn professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1694113076/card-workshops_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#EAEBFF_0%,transparent_65%)] px-5 pt-12 dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_80%)] sm:pt-16 lg:flex-row lg:items-start">
        <div className="flex flex-col items-center space-y-5 text-center lg:items-center lg:text-center">
          <h1 className="flex flex-col text-3xl font-semibold sm:text-4xl lg:text-5xl">
            <span className="mx-auto mb-4 inline-flex bg-gradient-to-r from-blue-500 to-fuchsia-600 bg-clip-text text-sm uppercase tracking-widest text-transparent dark:from-blue-300 dark:to-fuchsia-400">
              ***Professional
            </span>{' '}
            Development Workshops
          </h1>
          <h2 className="w-full max-w-lg text-balance text-gray-600 dark:text-gray-400 sm:text-lg">
            A collection of exercise-driven, in-depth Web Development workshops.
          </h2>
        </div>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 pb-24 pt-8">
        <div className="flex w-full items-center justify-center gap-10 sm:justify-between">
          <div className="flex w-full flex-col items-end gap-2 sm:flex-row">
            <div className="relative flex w-full items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-500" />
              <Input
                className="w-full pl-9"
                type="search"
                placeholder="Search workshops"
                value={query}
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(
                      router.pathname,
                      {
                        query: {q: e.target.value},
                      },
                      {
                        shallow: true,
                      },
                    )
                  } else {
                    router.push(
                      router.pathname,
                      {
                        query: {},
                      },
                      {
                        shallow: true,
                      },
                    )
                  }
                  return setQuery(e.target.value)
                }}
              />
              <div className="absolute right-1 flex h-full w-8 items-center justify-center sm:hidden">
                {isFetching && <Spinner className="h-4 w-4" />}
              </div>
            </div>
            <Label htmlFor="contributor" className="w-full sm:max-w-[220px]">
              <span className="pb-2 text-sm opacity-90">Instructor</span>
              <Select
                defaultValue={contributor}
                onValueChange={(value) => {
                  return setContributor(value)
                }}
              >
                <SelectTrigger className="w-full [&_span]:flex [&_span]:items-center [&_span]:gap-1 [&_span]:pr-3">
                  <SelectValue placeholder="Instructor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={''}>All</SelectItem>
                  {contributors.map(({slug, name, picture}) => {
                    return (
                      <SelectItem
                        className="[&_span]:flex [&_span]:items-center [&_span]:gap-1"
                        value={slug}
                      >
                        {picture?.url && (
                          <Image
                            src={picture?.url}
                            alt={name}
                            className="mr-2 rounded-full"
                            width={24}
                            height={24}
                          />
                        )}
                        {name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </Label>
          </div>
          <div className="hidden h-full w-8 items-center justify-center sm:flex">
            {isFetching && <Spinner className="-mb-5 h-5 w-5" />}
          </div>
        </div>
        {resultsForQuery && (
          <ul className={cn('grid grid-cols-1 gap-5 md:grid-cols-2', {})}>
            {resultsForQuery.map((workshop: SearchResult) => {
              return (
                <ModuleProgressProvider moduleSlug={workshop.slug.current}>
                  <Teaser module={workshop} key={workshop.slug.current} />
                </ModuleProgressProvider>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopsPage

export const Teaser: React.FC<{
  module: SearchResult
  index?: number
}> = ({module, index}) => {
  let {title, slug, image, description} = module
  let instructor = 'instructor' in module ? module.instructor : null

  const moduleProgress = useModuleProgress()
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: module.slug.current,
        moduleType: module.moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewContent = ability.can('view', 'Content')
  const ref = React.useRef(null)
  const isBonus = module.moduleType === 'bonus'
  const lessonType = isBonus ? 'interview' : 'lesson'
  const lessonCount = module.lessonCount
  // content &&
  // (content?.[0]?._type === 'section'
  //   ? sectionsFlatMap(content)[0]?._type
  //   : content[0]?._type)

  return (
    <motion.li>
      <Link
        className="relative flex h-full w-full flex-col items-center gap-5 overflow-hidden rounded-md border border-gray-100 bg-white bg-gradient-to-tr from-transparent to-white/50 p-5 px-8 pb-8 shadow-soft-xl transition before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:content-[''] dark:border-transparent dark:from-gray-900 dark:to-gray-800 dark:hover:brightness-110 md:flex-col"
        href={{
          pathname: `/${pluralize(module.moduleType)}/[module]`,
          query: {
            module: slug.current,
          },
        }}
        onClick={() => {
          track(`clicked ${module.moduleType} card`, {
            title,
            module: slug.current,
            location: pluralize(module.moduleType),
          })
        }}
      >
        {module.moduleType === 'bonus' ? (
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
        ) : typeof index === 'number' ? (
          <div
            className={cn(
              'absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-transparent text-xs font-semibold uppercase leading-none tracking-wider text-gray-600 shadow-inner dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400',
              {
                'bg-emerald-500 text-white dark:bg-emerald-400 dark:text-black':
                  isModuleInProgress && moduleProgress?.moduleCompleted,
              },
            )}
          >
            {isModuleInProgress && moduleProgress?.moduleCompleted
              ? '✓'
              : `${index + 1}`}
          </div>
        ) : null}
        {image && (
          <div className="flex items-center justify-center lg:flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={250}
              height={250}
              quality={100}
              priority
            />
          </div>
        )}
        <div className="flex w-full flex-col items-center text-center md:items-center md:text-center">
          <div className="flex w-full items-center justify-center gap-3 md:justify-start">
            <h3 className="w-full max-w-xl text-balance text-2xl font-semibold sm:text-3xl">
              {title}
            </h3>
          </div>
          {isModuleInProgress ? (
            <div className="mt-3 flex w-full items-center justify-center gap-2 text-xs font-medium md:justify-center">
              <span className="uppercase opacity-75">
                <span className="font-semibold">
                  {moduleProgress?.completedLessonCount}
                </span>{' '}
                / {moduleProgress?.lessonCount} completed
              </span>
              <Progress
                value={moduleProgress?.percentComplete}
                className="h-1.5 max-w-[150px] dark:bg-white/5 [&>[data-indicator]]:bg-emerald-500 [&>[data-indicator]]:dark:bg-emerald-300"
                max={100}
              />
            </div>
          ) : (
            <div
              // spacer
              className="h-[28px]"
            />
          )}
          {description && (
            <div className="pt-3">
              <p className="text-balance text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>
          )}
          <div className="flex flex-row items-center gap-3 pt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2 overflow-hidden rounded-full sm:justify-center">
              <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                <Image
                  src={
                    instructor?.picture?.url ||
                    require('../../../public/kent-c-dodds.png')
                  }
                  alt={instructor?.name || 'Kent C. Dodds'}
                  width={36}
                  height={36}
                />
              </div>
              <span>{instructor?.name || 'Kent C. Dodds'}</span>
            </div>
            {lessonCount && (
              <>
                {'・'}
                <div>
                  {lessonCount} {pluralize(lessonType, lessonCount)}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  )
}
