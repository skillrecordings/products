'use client'

import type {Chapter} from '@/lib/chapters'
import {MenubarItem} from '@skillrecordings/ui/primitives/menubar'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import {useParams, usePathname} from 'next/navigation'
import * as React from 'react'

export const ChapterResourceList: React.FC<{chapter: Chapter}> = ({
  chapter,
}) => {
  const [currentlyViewingSection, setCurrentlyViewingSection] = React.useState<
    string | null
  >(null)
  const params = useParams()
  const pathname = usePathname()

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentlyViewingSection(entry.target.id)
          }
        })
      },
      {threshold: 0.2},
    )

    const sections = document.querySelectorAll('section')

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <>
      {chapter.resources.map(({title, slug, solution}) => {
        const isActive =
          params?.resource === slug.current ||
          currentlyViewingSection === slug.current
        const isActiveSolution = pathname?.includes(`${slug.current}/solution`)

        return (
          <MenubarItem asChild key={slug.current}>
            <Link
              className={cn('', {
                underline: isActive && !isActiveSolution,
              })}
              href={
                params?.resource
                  ? `/book/${chapter.slug.current}/${slug.current}`
                  : `#${slug.current}`
              }
            >
              {title}
            </Link>
          </MenubarItem>
        )
      })}
    </>
  )
}
