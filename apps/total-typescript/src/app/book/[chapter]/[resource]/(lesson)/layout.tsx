import * as React from 'react'
import {
  getChapter,
  getChapterResource,
  getChapterWithResources,
  nextResourceUrlBuilder,
} from '@/lib/chapters'
import {ChevronRightIcon} from '@heroicons/react/outline'
import {cn} from '@skillrecordings/ui/utils/cn'
import {cookies} from 'next/headers'
import {getServerAuthSession} from '@/server/auth'
import {
  NextResourceLink,
  NextResourceTitle,
} from '../../../_components/next-resource'
import {Button} from '@skillrecordings/ui/primitives/button'
import {ResourceMenu} from '@/app/book/_components/resource-menu'
import {getBook} from '@/lib/book'

export const metadata = {
  name: 'Chapter',
  description: 'Chapter',
}

type BookResourceLayoutProps = {
  params: {chapter: string; resource: string; solution?: string}
  isSolution?: boolean
}

const BookResourceLayout: React.FC<
  React.PropsWithChildren<BookResourceLayoutProps>
> = async ({children, isSolution, params}) => {
  const session = await getServerAuthSession()
  const adminRoles = ['ADMIN' || 'SUPERADMIN']
  const isAdmin = adminRoles.includes(session?.user?.role || 'user') // TODO: use proper can can check
  const withBody = false
  const resourceLoader = getChapterResource(params.resource, withBody)
  const chapterLoader = getChapter(params.chapter)
  const chapterWithResourcesLoader = getChapterWithResources(params.chapter)
  const bookLoader = getBook('total-typescript')
  const {mode} = getBookMode()
  const nextResourceLoader = nextResourceUrlBuilder(
    params.resource,
    params.chapter,
    mode === 'video',
    isSolution,
  )

  return (
    <div className="relative">
      <div
        className={cn('mx-auto flex w-full flex-col items-center', {
          'max-w-4xl': mode === 'book',
          'max-w-screen-xl': mode === 'video',
        })}
      >
        <ResourceMenu
          chapterWithResourcesLoader={chapterWithResourcesLoader}
          nextResourceLoader={nextResourceLoader}
          bookLoader={bookLoader}
          resourceLoader={resourceLoader}
          chapterLoader={chapterLoader}
          chapterSlug={params.chapter}
          isSolution={isSolution}
          isAdmin={isAdmin}
          mode={mode}
        />
        <article
          className={cn('w-full px-5', {
            'max-w-4xl py-8 sm:py-16': mode === 'book',
            '': mode === 'video',
          })}
        >
          {children}
        </article>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 bg-secondary px-5 py-16 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-5 px-5 text-lg sm:flex-row">
          <p>
            <span>Up next: </span>
            <strong>
              <NextResourceTitle nextResourceLoader={nextResourceLoader} />
            </strong>
          </p>
          <Button asChild>
            <NextResourceLink
              className="flex"
              nextResourceLoader={nextResourceLoader}
            >
              Continue{' '}
              <ChevronRightIcon className="-mr-1.5 w-4" aria-hidden="true" />
            </NextResourceLink>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BookResourceLayout

export function getBookMode() {
  const cookieStore = cookies()

  const bookPrefsCookie = cookieStore.get('bookPrefs')
  const prefs = bookPrefsCookie ? JSON.parse(bookPrefsCookie.value) : {}
  const mode: 'video' | 'book' = prefs.mode || 'book'
  return {mode}
}
