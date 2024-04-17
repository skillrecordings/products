'use client'

import * as React from 'react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import {ChaptersList} from './chapters-list'
import {type Chapter, type ChapterResource} from '@/lib/chapters'
import ModeToggle from './mode-toggle'
import {NextResourceLink, NextResourceTitle} from './next-resource'
import type {Book} from '../_schema/book-schemas'
import Link from 'next/link'

export const ResourceMenu: React.FC<{
  chapterWithResourcesLoader: Promise<Chapter | null>
  nextResourceLoader: Promise<{url: string | null; label: string | null}>
  resourceLoader: Promise<ChapterResource | null>
  chapterLoader: Promise<Chapter | null>
  chapterSlug: string
  isSolution?: boolean
  bookLoader: Promise<Book | null>
  isAdmin: boolean
  mode: 'book' | 'video'
}> = ({
  chapterWithResourcesLoader,
  nextResourceLoader,
  resourceLoader,
  chapterLoader,
  chapterSlug,
  bookLoader,
  isAdmin,
  mode,
}) => {
  return (
    <aside className="sticky top-16 z-20 flex h-16 w-full items-center border border-t-0 bg-background leading-none lg:w-[calc(100%+160px)]">
      <Menubar className="space-x-0 border-0 p-0">
        <MenubarMenu>
          <MenubarTrigger className="flex h-16 w-16 items-center justify-center rounded-none border-r p-2">
            <MenuAlt1Icon className="h-6 w-6" />
          </MenubarTrigger>
          <MenubarContent className="h-full max-h-[calc(100vh-80px)] overflow-y-auto">
            <ChapterResourceList
              chapterWithResourcesLoader={chapterWithResourcesLoader}
            />
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger className="px-2 py-1 font-medium">
                Chapters
              </MenubarSubTrigger>
              <MenubarSubContent>
                <ChaptersList
                  bookLoader={bookLoader}
                  currentChapterSlug={chapterSlug}
                />
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="overflow-x-auto px-5 text-xs sm:text-base">
        <ResourceMenuTitle
          chapterLoader={chapterLoader}
          resourceLoader={resourceLoader}
        />
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
          <Tooltip>
            <TooltipTrigger>
              <NextResourceLink
                className="flex size-16 items-center justify-center border-l"
                nextResourceLoader={nextResourceLoader}
              >
                <ChevronRightIcon className="w-5" aria-hidden="true" />
              </NextResourceLink>
            </TooltipTrigger>
            <TooltipContent>
              <NextResourceTitle nextResourceLoader={nextResourceLoader} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  )
}

export const ResourceMenuTitle: React.FC<{
  chapterLoader: Promise<Chapter | null>
  resourceLoader: Promise<ChapterResource | null>
}> = ({chapterLoader, resourceLoader}) => {
  const chapter = React.use(chapterLoader)
  const resource = React.use(resourceLoader)

  if (!chapter || !resource) return null

  return (
    <div className="flex items-center gap-2">
      <Link href="/book" className="inline-block hover:underline">
        Chapters
      </Link>{' '}
      <span className="opacity-50" aria-hidden="true">
        /
      </span>{' '}
      <span>{chapter.title}</span>{' '}
      <span className="opacity-50" aria-hidden="true">
        /
      </span>{' '}
      {resource.title}
    </div>
  )
}
