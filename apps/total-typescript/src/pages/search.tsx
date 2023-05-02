import * as React from 'react'
import {getProviders, signIn} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {getToken} from 'next-auth/jwt'
import {trpc} from '../trpc/trpc.client'
import {isEmpty} from 'lodash'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import pluralize from 'pluralize'
import Link from 'next/link'

const Profile: React.FC<React.PropsWithChildren<{providers: any}>> = ({
  providers,
}) => {
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 500)

  const {data: searchResults} = trpc.search.resultsForQuery.useQuery({
    query: debouncedQuery,
  })

  return (
    <Layout footer={null} meta={{title: 'Search Total TypeScript'}}>
      <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center pb-16 pt-16 text-white sm:p-5 sm:pt-40 md:pb-40">
        <Image
          src={require('../../public/assets/landing/bg-divider-3.png')}
          fill={true}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none object-contain object-top"
        />
        <main className="relative z-10 rounded-lg border-gray-800 p-5 shadow-black/60 sm:mx-auto sm:border sm:bg-gray-800/90 sm:p-10 sm:shadow-2xl">
          <div className="relative z-10 mx-auto flex w-20 max-w-sm items-center justify-center sm:-mt-24 sm:w-full">
            <Image
              placeholder="blur"
              src={require('../../public/assets/gem.png')}
              alt=""
              quality={100}
              width={120}
              height={120}
              priority
              aria-hidden="true"
            />
          </div>
          <h1 className="pt-3 text-center font-text text-4xl font-extrabold leading-9 sm:pt-8 sm:text-4xl">
            Search Total TypeScript
          </h1>
          <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md sm:pt-10 sm:text-lg">
            <form method="post" action="/api/auth/signin/email">
              <label
                htmlFor="email"
                className="block pb-1 leading-5 text-gray-200"
              >
                Search
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  className="mb-3 block w-full rounded-md border border-white border-opacity-20 bg-gray-900 py-4 pl-10 text-white placeholder-gray-400 focus:border-cyan-300 focus:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {searchResults?.map((result: any) => {
            let resourceSlug = ''

            switch (result._type) {
              case 'tip':
                resourceSlug = `/tips/${result.slug.current}`
                break
              case 'article':
                resourceSlug = `/${result.slug.current}`
                break
              case 'module':
                resourceSlug = `/${pluralize(result.moduleType)}/${
                  result.slug.current
                }`
                break
              case 'exercise':
                resourceSlug = `/${pluralize(result.module.moduleType)}/${
                  result.module.slug.current
                }/${result.section.slug}/${result.slug.current}`
                break
              case 'explainer':
                resourceSlug = `/${pluralize(result.module.moduleType)}/${
                  result.module.slug.current
                }/${result.section.slug}/${result.slug.current}`
                break
              default:
                resourceSlug = `/${pluralize(result._type)}/${
                  result.slug.current
                }`
            }

            return (
              <div className="flex items-center justify-between border-b border-gray-800 py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link
                      className="font-semibold hover:underline"
                      href={resourceSlug}
                    >
                      {result.title}{' '}
                      {result._type === 'module'
                        ? `(${result.moduleType})`
                        : `(${result._type})`}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </main>
      </div>
    </Layout>
  )
}

export default Profile

function useDebounce(value: string = '', delay: number) {
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
