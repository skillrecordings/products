'use client'

import * as React from 'react'
import {ChevronRightIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'
import type {Chapter, ChapterResource} from '@/lib/chapters'

export const NextResourceButton: React.FC<{
  resource: ChapterResource | null
  nextResource?: ChapterResource | null
  chapter: Chapter
  nextChapter?: Chapter | null
}> = ({resource, nextResource, chapter, nextChapter}) => {
  const pathname = usePathname()
  const isSolution = pathname?.endsWith('/solution')
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          className="flex size-16 items-center justify-center border-l"
          href={
            !isSolution && resource && resource?.solution
              ? `/book/${chapter.slug.current}/${resource.slug.current}/solution`
              : nextResource
              ? `/book/${chapter.slug.current}/${nextResource.slug.current}`
              : nextChapter?.resources
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
          : nextChapter?.resources
          ? nextChapter.resources[0].title
          : null}
      </TooltipContent>
    </Tooltip>
  )
}
