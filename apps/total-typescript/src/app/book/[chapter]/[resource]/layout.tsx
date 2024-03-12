import * as React from 'react'
import {
  getChapter,
  getChapterPositions,
  getChapterResource,
  getResourcePositions,
} from '@/lib/chapters'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ChapterResourceList} from '@/app/book/_components/chapter-resource-list'
import {
  BookmarkIcon,
  ChevronRightIcon,
  MenuAlt1Icon,
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
  const resource =
    params.resource && (await getChapterResource(params.resource))

  const {nextChapter, currentChapterIndex, chapters} =
    await getChapterPositions(chapter)
  const resourcePositions =
    resource && (await getResourcePositions(chapter, resource))
  const {nextResource} = resourcePositions || {}

  if (!chapter) {
    notFound()
  }

  return (
    <div className="relative">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <aside className="sticky top-0 z-20 flex h-16 w-full items-center border border-t-0 bg-background leading-none lg:w-[calc(100%+160px)]">
          <Menubar className="space-x-0 border-0 p-0">
            <MenubarMenu>
              <MenubarTrigger className="flex h-16 w-16 items-center justify-center rounded-none border-r p-2">
                <MenuAlt1Icon className="h-6 w-6" />
              </MenubarTrigger>
              <MenubarContent className="max-h-[calc(100vh-80px)] overflow-y-auto">
                <ChapterResourceList chapter={chapter} />
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
          <div className="overflow-x-auto pl-3 text-xs sm:text-base">
            <div>
              <span className="font-semibold">{chapter.title}</span> /{' '}
              {resource && resource.title}
            </div>
          </div>
          <div className="ml-auto flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex size-16 items-center justify-center border-l">
                  <BookmarkIcon className="w-5" />
                </TooltipTrigger>
                <TooltipContent>Add Bookmark</TooltipContent>
              </Tooltip>
              {(nextResource || nextChapter) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {nextResource ? (
                      <Link
                        className="flex size-16 items-center justify-center border-l"
                        href={`/book/${chapter.slug.current}/${nextResource.slug.current}`}
                      >
                        <ChevronRightIcon className="w-5" />
                      </Link>
                    ) : nextChapter ? (
                      <Link
                        className="flex size-16 items-center justify-center border-l"
                        href={`/book/${nextChapter.slug}/${nextChapter.resources[0].slug}`}
                      >
                        <ChevronRightIcon className="w-5" />
                      </Link>
                    ) : null}
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
        <article className="mx-auto w-full max-w-4xl px-5 py-8 sm:py-16">
          {children}
        </article>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-5 px-5 py-16 text-center">
        {nextResource ? (
          <>
            {/* TODO: Get correct H level in respect to mdx body */}
            <p>Next Up</p>
            <strong className="text-2xl font-bold">{nextResource.title}</strong>
            <Button asChild>
              <Link href={nextResource.slug.current}>Continue ➔</Link>
            </Button>
          </>
        ) : nextChapter ? (
          <>
            <p>Next Up</p>
            <strong className="text-2xl font-bold">{nextChapter.title}</strong>
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

export default ChapterLayout
