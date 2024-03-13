'use client'

import * as React from 'react'
import {ChevronRightIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {
  TooltipContent,
  TooltipTrigger,
} from '@skillrecordings/ui/primitives/tooltip'

export const NextResourceButton: React.FC<{
  resource: any
  nextResource: any
  chapter: any
  nextChapter: any
}> = ({resource, nextResource, chapter, nextChapter}) => {
  const pathname = usePathname()
  const isSolution = pathname?.endsWith('/solution')
  return (
    <>
      <TooltipTrigger asChild>
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
    </>
  )
}
