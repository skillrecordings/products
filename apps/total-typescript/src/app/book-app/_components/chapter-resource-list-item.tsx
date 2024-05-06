'use client'
import * as React from 'react'
import Link from 'next/link'
import {MenubarItem} from '@skillrecordings/ui/primitives/menubar'
import type {Chapter, ChapterResource} from '@/lib/chapters'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useParams, usePathname} from 'next/navigation'

export const ChapterResourceListItem: React.FC<{
  resource: ChapterResource
  chapter: Chapter
}> = ({resource, chapter}) => {
  const params = useParams()
  const pathname = usePathname()
  const isActive = params?.resource === resource.slug.current // || currentlyViewingSection === slug.current
  const isActiveSolution = pathname?.includes(
    `${resource.slug.current}/solution`,
  )
  return (
    <MenubarItem asChild key={resource.slug.current}>
      <Link
        className={cn('', {
          underline: isActive && !isActiveSolution,
        })}
        href={
          params?.resource
            ? `/book/${chapter.slug.current}/${resource.slug.current}`
            : `#${resource.slug.current}`
        }
      >
        {resource.title}
      </Link>
    </MenubarItem>
  )
}
