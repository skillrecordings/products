import * as React from 'react'
import {
  getChapter,
  getChapterPositions,
  getChapterResource,
  getResourcePositions,
} from '@/lib/chapters'
import Link from 'next/link'
import {notFound, usePathname} from 'next/navigation'
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
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@skillrecordings/ui/primitives/menubar'
import {cn} from '@skillrecordings/ui/utils/cn'
import {Button} from '@skillrecordings/ui/primitives/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import {cookies, headers} from 'next/headers'
import ModeToggle from '../../_components/mode-toggle'
import {getServerAuthSession} from '@/server/auth'
import {revalidatePath} from 'next/cache'
import {NextResourceButton} from '../../_components/next-resource-button'

export const metadata = {
  name: 'Chapter',
  description: 'Chapter',
}

type Props = {
  params: {chapter: string; resource?: string}
}

const ChapterLayout: React.FC<React.PropsWithChildren<Props>> = async ({
  children,
  params,
}) => {
  const chapter = await getChapter(params.chapter)
  const chapterLoader = getChapter(params.chapter)
  const resource =
    params.resource && (await getChapterResource(params.resource))

  const {nextChapter, currentChapterIndex, chapters} =
    await getChapterPositions(chapter)
  const resourcePositions =
    resource && (await getResourcePositions(chapter, resource))
  const {nextResource} = resourcePositions || {}
  const heads = headers()
  const pathname = heads.get('next-url')
  const isSolution = pathname?.endsWith('/solution')

  if (!chapter) {
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
                    <ChapterResourceList chapterLoader={chapterLoader} />
                  </React.Suspense>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger className="px-2 py-1 font-medium">
                      Chapters
                      {/* Chapter {currentChapterIndex}: {chapter.title} */}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      {chapters?.map((chapter, i) => {
                        const isActive = i === currentChapterIndex - 1
                        return (
                          <MenubarItem asChild key={chapter.slug}>
                            <Link
                              href={`/book/${chapter.slug}/${chapter.resources[0].slug}`}
                              className={cn('', {
                                underline: isActive,
                              })}
                            >
                              {i + 1}. {chapter.title}
                            </Link>
                          </MenubarItem>
                        )
                      })}
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
                {(nextResource || nextChapter) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        className="flex size-16 items-center justify-center border-l"
                        href={
                          nextResource
                            ? `/book/${chapter.slug.current}/${nextResource.slug.current}`
                            : `/book/${nextChapter?.slug}/${nextChapter?.resources[0].slug}`
                        }
                      >
                        <ChevronRightIcon className="w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Next:{' '}
                      {nextResource
                        ? nextResource.title
                        : nextChapter
                        ? nextChapter.resources[0].title
                        : null}
                    </TooltipContent>
                  </Tooltip>
                )}
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
        <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-16 text-center">
          {nextResource ? (
            <>
              {/* TODO: Get correct H level in respect to mdx body */}
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextResource.title}
              </strong>
              <Button asChild>
                <Link href={nextResource.slug.current}>Continue ➔</Link>
              </Button>
            </>
          ) : nextChapter ? (
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
        </div>
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
                    <ChapterResourceList chapterLoader={chapterLoader} />
                  </React.Suspense>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger className="px-2 py-1 font-medium">
                      Chapters
                      {/* Chapter {currentChapterIndex}: {chapter.title} */}
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      {chapters?.map((chapter, i) => {
                        const isActive = i === currentChapterIndex - 1
                        return (
                          <MenubarItem asChild key={chapter.slug}>
                            <Link
                              href={`/book/${chapter.slug}/${chapter.resources[0].slug}`}
                              className={cn('', {
                                underline: isActive,
                              })}
                            >
                              {i + 1}. {chapter.title}
                            </Link>
                          </MenubarItem>
                        )
                      })}
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
                {(nextResource ||
                  nextChapter ||
                  (resource && resource.solution)) && (
                  <Tooltip>
                    <NextResourceButton
                      chapter={chapter}
                      nextChapter={nextChapter}
                      nextResource={nextResource}
                      resource={resource}
                    />
                    {/* <TooltipTrigger>
                      <Link
                        className="flex size-16 items-center justify-center border-l"
                        href={
                          !isSolution && resource && resource?.solution
                            ? `/book/${chapter.slug.current}/${resource.slug.current}/solution`
                            : nextResource
                            ? `/book/${chapter.slug.current}/${nextResource.slug.current}`
                            : nextChapter
                            ? `/book/${nextChapter.slug}/${nextChapter.resources[0].slug}`
                            : ''
                        }
                      >
                        <ChevronRightIcon className="w-5" />
                      </Link>
                    </TooltipTrigger> 
                    <TooltipContent>
                      Next:{' '}
                      {!isSolution && resource && resource.solution
                        ? `Solution`
                        : nextResource
                        ? nextResource.title
                        : nextChapter
                        ? nextChapter.resources[0].title
                        : null}
                    </TooltipContent>
                    */}
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </aside>
          <article className={cn('mx-auto w-full', {})}>{children}</article>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-16 text-center">
          {nextResource ? (
            <>
              {/* TODO: Get correct H level in respect to mdx body */}
              <p>Next Up</p>
              <strong className="text-2xl font-bold">
                {nextResource.title}
              </strong>
              <Button asChild>
                <Link
                  href={`/book/${chapter.slug.current}/${nextResource.slug.current}`}
                >
                  Continue ➔
                </Link>
              </Button>
            </>
          ) : nextChapter ? (
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
        </div>
      </div>
    )
  }

  return mode === 'book' ? <BookLayout /> : <VideoLayout />
}

export default ChapterLayout

export function getBookMode() {
  const cookieStore = cookies()

  const bookPrefsCookie = cookieStore.get('bookPrefs')
  const prefs = bookPrefsCookie ? JSON.parse(bookPrefsCookie.value) : {}
  const mode: 'video' | 'book' = prefs.mode || 'book'
  return {mode}
}
