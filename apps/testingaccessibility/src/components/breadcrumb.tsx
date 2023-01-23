import React from 'react'
import {HomeIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {find, indexOf, isEmpty} from 'lodash'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'

type Page =
  | {
      title: string
      slug: string
      pathname?: string
      query?: {[q: string]: string}
      lessons?: Page[]
    }
  | SanityDocument

type BreadcrumbProps = {
  module?: Page
  section?: Page
  lesson?: Page
}

const BreadcrumbNav: React.FC<React.PropsWithChildren<BreadcrumbProps>> = ({
  module,
  section,
  lesson,
}) => {
  const currentLessonIndex = indexOf(
    section?.lessons,
    find(section?.lessons, {slug: lesson?.slug}),
  )
  const pages: Page[] | any = [
    {
      ...(module && {
        title: module?.title,
        slug: module?.slug,
        pathname: '/learn/[module]',
        query: {module: module?.slug},
      }),
    },
    {
      ...(section && {
        title: section?.title,
        slug: section?.slug,
        pathname: module ? '/learn/[module]/[section]' : '/[section]',
        query: module
          ? {module: module?.slug, section: section?.slug}
          : {section: section?.slug},
      }),
    },
    {
      ...(lesson && {
        title: `Lesson ${currentLessonIndex + 1}`,
        slug: lesson?.slug,
      }),
    },
  ].filter((p) => !isEmpty(p))

  return (
    <nav className="flex font-nav" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center sm:space-x-4 space-x-2">
        <li>
          <Link
            href="/learn"
            className="text-gray-400 hover:text-gray-500 w-5 block"
          >
            <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pages.map((page: Page, i: number) => {
          if (!page) return null
          const isLast = i + 1 === pages.length
          return (
            <li key={page.title} className="flex-shrink-0">
              <div className="flex items-center">
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400 pt-1"
                  aria-hidden="true"
                />
                {page.pathname && !isLast ? (
                  <Link
                    href={{
                      pathname: page.pathname,
                      query: page.query,
                    }}
                    className="flex-shrink-0 sm:ml-4 ml-2 text-sm font-medium text-gray-800 hover:text-gray-800 hover:underline"
                  >
                    {page.title}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="flex-shrink-0 sm:ml-4 ml-2 text-sm font-medium text-gray-600"
                  >
                    {page.title}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BreadcrumbNav
