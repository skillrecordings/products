import * as React from 'react'
import Layout from 'components/app/layout'
import Balancer from 'react-wrap-balancer'
import {trpc} from '../trpc/trpc.client'
import pluralize from 'pluralize'
import Link from 'next/link'
import {
  PuzzleIcon,
  SearchIcon,
  LightBulbIcon,
  SparklesIcon,
  DocumentIcon,
  FastForwardIcon,
  PlayIcon,
} from '@heroicons/react/outline'
import {useRouter} from 'next/router'
import {
  ArticlesIcon,
  ExerciseIcon,
  TalkIcon,
  TipsIcon,
  TutorialsIcon,
  WorkshopsIcon,
} from 'components/app/navigation'
import {useTheme} from 'next-themes'

const Search: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 500)
  const router = useRouter()

  React.useEffect(() => {
    router.query.q && setQuery(router.query.q.toString())
  }, [router])

  const {data: searchResults} = trpc.search.resultsForQuery.useQuery({
    query: debouncedQuery,
  })

  const [isHoveredItem, setHoveredItem] = React.useState('')
  const {theme} = useTheme()

  return (
    <Layout
      meta={{
        title: 'Search Epic Web',
      }}
    >
      <main className="relative z-10 mx-auto w-full max-w-4xl rounded-t-xl border bg-card px-5 pb-10 sm:px-10">
        <h1 className="font-text px-3 pt-3 text-center text-2xl font-semibold leading-9 sm:pt-8 sm:text-left sm:text-3xl lg:px-0">
          Search Epic Web
        </h1>
        <div className="w-full px-3 pt-5 sm:text-lg lg:px-0">
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="search"
                id="search"
                placeholder="Search"
                className="mb-3 block w-full rounded border bg-card py-3 pl-11 pr-4 placeholder-gray-400 focus:border-gray-300 focus:ring-0"
                value={query}
                onChange={(e) => {
                  e.target.value === ''
                    ? router.push(router.pathname)
                    : router.push(router.pathname, {
                        query: {q: e.target.value},
                      })
                  return setQuery(e.target.value)
                }}
              />
            </div>
          </form>
        </div>

        <ul className="divide-y divide-gray-100">
          {!searchResults && <Skeleton />}
          {searchResults?.map((result: any) => {
            if (!result) return null
            const resourceSlug = getResourceSlug(result)
            const isHovered = isHoveredItem === resourceSlug

            return resourceSlug ? (
              <li key={resourceSlug}>
                <Link
                  onMouseOver={() => {
                    setHoveredItem(resourceSlug)
                  }}
                  onMouseOut={() => {
                    setHoveredItem('')
                  }}
                  className="flex w-full items-center justify-between gap-5 px-5 py-3.5 font-medium transition hover:bg-gray-50 hover:dark:bg-gray-900"
                  href={resourceSlug}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0" aria-hidden="true">
                      {getIcon(
                        result._type === 'module'
                          ? result.moduleType
                          : result._type,
                        true,
                        theme,
                      )}
                    </span>
                    <Balancer>{result.title} </Balancer>
                  </div>
                  <div className="w-16 justify-self-end font-mono text-xs font-normal uppercase text-gray-400 sm:w-24">
                    {result._type === 'module'
                      ? `${result.moduleType}`
                      : `${result._type}`}
                  </div>
                </Link>
              </li>
            ) : null
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Search

export function useDebounce(value: string = '', delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export const getIcon = (_type: string, isHovered: boolean, theme: any) => {
  switch (_type) {
    case 'tip':
      return <TipsIcon theme={theme} isHovered={isHovered} aria-hidden="true" />
      break
    case 'article':
      return (
        <ArticlesIcon theme={theme} isHovered={isHovered} aria-hidden="true" />
      )
      break
    case 'tutorial':
      return (
        <TutorialsIcon theme={theme} isHovered={isHovered} aria-hidden="true" />
      )
      break
    case 'workshop':
      return <WorkshopsIcon theme={theme} isHovered={isHovered} />
      break
    case 'exercise':
      return (
        <ExerciseIcon theme={theme} isHovered={isHovered} aria-hidden="true" />
      )
      break
    case 'talk':
      return <TalkIcon theme={theme} isHovered={isHovered} aria-hidden="true" />
      break
    case 'explainer':
      return <LightBulbIcon className="h-5 w-5" aria-hidden="true" />
      break
    default:
      return (
        <SparklesIcon className="h-5 w-5 text-pink-400" aria-hidden="true" />
      )
      break
  }
}

const Skeleton = () => {
  return (
    <>
      {new Array(5).fill(null).map((_, i) => {
        return (
          <>
            <li
              key={i}
              className="flex h-[52px] w-full animate-pulse items-center bg-gray-100 px-5"
            >
              <span className="h-4 w-48 rounded-md bg-gray-200" />
            </li>
            <li
              key={i + 'b'}
              className="flex h-[52px] w-full animate-pulse items-center bg-gray-100/50 px-5"
            >
              <span className="h-4 w-32 rounded-md bg-gray-200/50" />
            </li>
          </>
        )
      })}
    </>
  )
}

export const getResourceSlug = (result: any) => {
  let resourceSlug = ''
  switch (result._type) {
    case 'tip':
      resourceSlug = `/tips/${result.slug.current}`
      break
    case 'article':
      resourceSlug = `/${result.slug.current}`
      break
    case 'module':
      resourceSlug = `/${pluralize(result.moduleType)}/${result.slug.current}`
      break
    case 'bonus':
      resourceSlug = `/bonuses/${result.slug.current}`
      break
    case 'exercise':
      resourceSlug =
        result.module &&
        `/${pluralize(result.module.moduleType)}/${
          result.module.slug.current
        }/${result.section.slug}/${result.slug.current}`
      break
    case 'explainer':
      resourceSlug =
        result.module &&
        `/${pluralize(result.module.moduleType)}/${
          result.module.slug.current
        }/${result.section.slug}/${result.slug.current}`
      break
    default:
      resourceSlug = `/${pluralize(result._type)}/${result.slug.current}`
  }
  return resourceSlug
}
