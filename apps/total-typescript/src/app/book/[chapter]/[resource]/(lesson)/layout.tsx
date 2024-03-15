import * as React from 'react'
import {getChapter, getChapterResource} from '@/lib/chapters'
import {notFound} from 'next/navigation'
import {ChapterResourceList} from '@/app/book/_components/chapter-resource-list'
import {
  BookOpenIcon,
  BookmarkIcon,
  ChevronRightIcon,
  MenuAlt1Icon,
  PlayIcon,
} from '@heroicons/react/outline'
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@skillrecordings/ui/primitives/menubar'
import {cn} from '@skillrecordings/ui/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import {cookies, headers} from 'next/headers'
import ModeToggle from '../../../_components/mode-toggle'
import {getServerAuthSession} from '@/server/auth'
import {ChaptersList} from '../../../_components/chapters-list'
import {NextResource} from '../../../_components/next-resource'

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
  const chapter = await getChapter(params.chapter)
  const withBody = false
  const resource = await getChapterResource(params.resource as string, withBody)

  if (!chapter || !resource) {
    notFound()
  }

  const session = await getServerAuthSession()
  const isAdmin = session?.user.role === 'ADMIN' // TODO: use proper can can check
  const {mode} = getBookMode()

  const BookLayout = () => {
    return (
      <div className="relative">
        <div
          className={cn('mx-auto flex w-full flex-col items-center', {
            'max-w-4xl': mode === 'book',
            // 'max-w-screen-xl': mode === 'video',
          })}
        >
          <aside className="sticky top-0 z-20 flex h-16 w-full items-center border border-t-0 bg-background leading-none lg:w-[calc(100%+160px)]">
            <Menubar className="space-x-0 border-0 p-0">
              <MenubarMenu>
                <MenubarTrigger className="flex h-16 w-16 items-center justify-center rounded-none border-r p-2">
                  <MenuAlt1Icon className="h-6 w-6" />
                </MenubarTrigger>
                <MenubarContent className="max-h-[calc(100vh-80px)] overflow-y-auto">
                  <React.Suspense fallback={'Loading...'}>
                    <ChapterResourceList currentChapterSlug={params.chapter} />
                  </React.Suspense>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger className="px-2 py-1 font-medium">
                      Chapters
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <React.Suspense fallback={'Loading'}>
                        <ChaptersList currentChapterSlug={params.chapter} />
                      </React.Suspense>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="overflow-x-auto px-5 text-xs sm:text-base">
              <div>
                <span className="font-semibold">{chapter.title}</span> /{' '}
                {resource && resource.title}
              </div>
            </div>
            <div className="ml-auto flex">
              <TooltipProvider delayDuration={0}>
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="flex size-16 items-center justify-center border-l"
                    >
                      <ModeToggle mode={mode}>
                        {mode === 'book' ? (
                          <PlayIcon className="w-5" />
                        ) : (
                          <BookOpenIcon className="w-5" />
                        )}
                      </ModeToggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      Switch to {mode === 'book' ? 'Video' : 'Book'} Mode
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger className="flex size-16 items-center justify-center border-l">
                    <BookmarkIcon className="w-5" />
                  </TooltipTrigger>
                  <TooltipContent>Add Bookmark</TooltipContent>
                </Tooltip>
                <React.Suspense
                  fallback={
                    <div className="flex size-16 cursor-wait items-center justify-center border-l">
                      <ChevronRightIcon className="w-5" />
                    </div>
                  }
                >
                  <NextResource
                    currentChapterSlug={params.chapter}
                    currentResourceSlug={params.resource}
                    isSolution={isSolution}
                  />
                </React.Suspense>
              </TooltipProvider>
            </div>
          </aside>
          <article
            className={cn('mx-auto w-full px-5', {
              'max-w-4xl py-8 sm:py-16': mode === 'book',
              // 'max-w-screen-xl': mode === 'video',
            })}
          >
            {children}
          </article>
        </div>
        {/* TODO: Separate Pagination Component since we need to load full chapter
        data... */}
        {/* <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-16 text-center">
          {nextResource ? (
            <>
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextResource.title}
              </strong>
              <Button asChild>
                <Link href={nextResource.slug.current}>Continue ➔</Link>
              </Button>
            </>
          ) : nextChapter?.resources ? (
            <>
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextChapter.title}
              </strong>
              <Button asChild>
                <Link
                  href={`/book/${nextChapter.slug}/${nextChapter.resources[0].slug}`}
                >
                  Continue <ChevronRightIcon className="w-4" />
                </Link>
              </Button>
            </>
          ) : null}
        </div> */}
      </div>
    )
  }

  const VideoLayout = () => {
    return (
      <div className="relative">
        <div className={cn('mx-auto flex w-full flex-col items-center', {})}>
          <aside className="sticky top-0 z-20 flex h-16 w-full items-center border border-t-0 bg-background leading-none">
            <Menubar className="space-x-0 border-0 p-0">
              <MenubarMenu>
                <MenubarTrigger className="flex h-16 w-16 items-center justify-center rounded-none border-r p-2">
                  <MenuAlt1Icon className="h-6 w-6" />
                </MenubarTrigger>
                <MenubarContent className="max-h-[calc(100vh-80px)] overflow-y-auto">
                  <React.Suspense fallback={'Loading...'}>
                    <ChapterResourceList currentChapterSlug={params.chapter} />
                  </React.Suspense>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger className="px-2 py-1 font-medium">
                      Chapters
                      {/* Chapter {currentChapterIndex}: {chapter.title} */}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <React.Suspense fallback={'Loading'}>
                        <ChaptersList currentChapterSlug={params.chapter} />
                      </React.Suspense>
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="overflow-x-auto px-5 text-xs sm:text-base">
              <div>
                <span className="font-semibold">{chapter.title}</span> /{' '}
                {resource && resource.title}
              </div>
            </div>
            <div className="ml-auto flex">
              <TooltipProvider delayDuration={0}>
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className="flex size-16 items-center justify-center border-l"
                    >
                      <ModeToggle mode={mode}>
                        {mode === 'book' ? (
                          <PlayIcon className="w-5" />
                        ) : (
                          <BookOpenIcon className="w-5" />
                        )}
                      </ModeToggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      Switch to {mode === 'book' ? 'Video' : 'Book'} Mode
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger className="flex size-16 items-center justify-center border-l">
                    <BookmarkIcon className="w-5" />
                  </TooltipTrigger>
                  <TooltipContent>Add Bookmark</TooltipContent>
                </Tooltip>
                <React.Suspense
                  fallback={
                    <div className="flex size-16 cursor-wait items-center justify-center border-l">
                      <ChevronRightIcon className="w-5" />
                    </div>
                  }
                >
                  <NextResource
                    currentChapterSlug={params.chapter}
                    currentResourceSlug={params.resource}
                    isSolution={isSolution}
                    withSolution
                  />
                </React.Suspense>
              </TooltipProvider>
            </div>
          </aside>
          <article className={cn('mx-auto w-full', {})}>{children}</article>
        </div>
        {/* TODO: Pagination component */}
        {/* <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-16 text-center">
          {nextResource ? (
            <>
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextResource.title}
              </strong>
              <Button asChild>
                <Link
                  href={`/book/${params.chapter}/${nextResource.slug.current}`}
                >
                  Continue ➔
                </Link>
              </Button>
            </>
          ) : nextChapter?.resources ? (
            <>
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextChapter.title}
              </strong>
              <Button asChild>
                <Link
                  href={`/book/${nextChapter.slug}/${nextChapter.resources[0].slug}`}
                >
                  Continue <ChevronRightIcon className="w-4" />
                </Link>
              </Button>
            </>
          ) : null}
        </div> */}
      </div>
    )
  }

  return mode === 'book' ? <BookLayout /> : <VideoLayout />
}

export default BookResourceLayout

export function getBookMode() {
  const cookieStore = cookies()

  const bookPrefsCookie = cookieStore.get('bookPrefs')
  const prefs = bookPrefsCookie ? JSON.parse(bookPrefsCookie.value) : {}
  const mode: 'video' | 'book' = prefs.mode || 'book'
  return {mode}
}
