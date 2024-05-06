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
import {ResourceMenu} from '@/app/book-app/_components/resource-menu'
import {getBook, getChapterList} from '@/lib/book'
import Link from 'next/link'
import ModeToggle from '@/app/book-app/_components/mode-toggle'
import {Switch} from '@skillrecordings/ui/primitives/switch'
import {Label} from '@skillrecordings/ui/primitives/label'
import {toggleMode} from '@/app/book-app/_components/toggle-book-mode'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import {ChapterToC} from '@/app/book-app/_components/chapter-toc'
import {ChaptersIndex} from '@/app/book-app/_components/chapters-index'

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
  const chaptersLoaders = getChapterList('total-typescript')
  const chapterLoader = getChapter(params.chapter)
  const chapter = await chapterLoader
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
    <div className={cn('relative')}>
      <div
        className={cn('relative mx-auto flex w-full', {
          'max-w-4xl flex-col items-center py-16 sm:py-24': mode === 'book',
          'max-w-none flex-col py-10 sm:py-16 md:flex-row': mode === 'video',
        })}
      >
        {mode === 'video' && (
          <div className="relative">
            <div className="flex flex-col gap-5 p-5">
              <ChapterToC chaptersLoader={chaptersLoaders} />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ModeToggle disabled={!isAdmin} mode={mode} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isAdmin
                      ? `Switch to book mode`
                      : 'Buy TypeScript Essentials to unlock video mode'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        {/* <ResourceMenu
          chapterWithResourcesLoader={chapterWithResourcesLoader}
          nextResourceLoader={nextResourceLoader}
          bookLoader={bookLoader}
          resourceLoader={resourceLoader}
          chapterLoader={chapterLoader}
          chapterSlug={params.chapter}
          isSolution={isSolution}
          isAdmin={isAdmin}
          mode={mode}
        /> */}
        <article
          className={cn('w-full', {
            'max-w-4xl px-5': mode === 'book',
            '': mode === 'video',
          })}
        >
          {mode === 'book' && (
            <div className="flex w-full flex-col-reverse items-center gap-5 py-5 sm:flex-row sm:justify-between">
              <div className="flex w-full items-center gap-3 text-gray-300">
                <Link href="/book" className="text-primary hover:underline">
                  TypeScript Essentials
                </Link>
                <span>/</span>
                <span>{chapter?.title}</span>
                <span>/</span>
              </div>
              <div className="flex items-center sm:justify-end">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ModeToggle disabled={!isAdmin} mode={mode} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isAdmin
                        ? `Switch to ${mode === 'book' ? 'video' : 'book'} mode`
                        : 'Buy TypeScript Essentials to unlock video mode'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
          {children}
        </article>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 bg-white/5 px-5 py-16 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center justify-between gap-5 px-5 text-lg sm:flex-row">
          <p>
            <span>Up next: </span>
            <span className="font-semibold">
              <NextResourceTitle nextResourceLoader={nextResourceLoader} />
            </span>
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
