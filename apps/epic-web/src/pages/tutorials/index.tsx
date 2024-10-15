import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {trpc} from 'trpc/trpc.client'
import {
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useDebounce} from 'pages/search'
import type {Contributor} from 'lib/contributors'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {Search} from 'lucide-react'
import Spinner from 'components/spinner'
import type {SearchResult} from 'trpc/routers/search'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {getAllTutorials} from 'lib/tutorials'
import {Teaser} from 'pages/workshops'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  const contributors = await sanityClient.fetch(groq`
    *[_type == 'contributor'] {
      _id,
      name,
      "slug": slug.current,
      picture {
        "url": asset->url,
        alt
      },
      'tutorials': *[_type == 'module' && moduleType == 'tutorial' && references(^._id)] {
        _id,
      }
    }`)

  const contributorsWithTutorials = contributors.filter(({tutorials}: any) => {
    return tutorials.length > 0
  })

  return {
    props: {tutorials, contributors: contributorsWithTutorials},
    revalidate: 10,
  }
}

const TutorialsPage: React.FC<{
  tutorials: any[]
  contributors: Contributor[]
}> = ({tutorials, contributors}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const [query, setQuery] = React.useState('')
  const [contributor, setContributor] = React.useState('')

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
        moduleTypes: ['tutorial'],
        orderBy: 'newest',
        contributor,
      },
      {
        initialData: tutorials,
      },
    )
  return (
    <Layout
      meta={{
        title: `Free Web Development Tutorials`,
        description: `Free Web Development that will help you learn professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1704808424/card-tutorials_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#EAEBFF_0%,transparent_65%)] px-5 pt-12 dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_80%)] sm:pt-16 lg:flex-row lg:items-start">
        <div className="flex flex-col items-center space-y-5 text-center lg:items-center lg:text-center">
          <h1 className="flex flex-col text-3xl font-semibold sm:text-4xl lg:text-5xl">
            <span className="mx-auto mb-4 inline-flex bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-sm uppercase tracking-widest text-transparent dark:from-emerald-200 dark:to-cyan-300">
              Free
            </span>{' '}
            Web Development Tutorials
          </h1>
          <h2 className="w-full max-w-lg text-balance text-gray-600 dark:text-gray-400 sm:text-lg">
            A collection of exercise-driven, in-depth Web Development tutorials.
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
                placeholder="Search tutorials"
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

      {!subscriber && <PrimaryNewsletterCta className="mt-20" />}
    </Layout>
  )
}

export default TutorialsPage
