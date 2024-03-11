'use client'

import type {Chapter} from '@/lib/chapters'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import {useParams} from 'next/navigation'
import * as React from 'react'

export const ChapterResourceList: React.FC<{chapter: Chapter}> = ({
  chapter,
}) => {
  const [currentlyViewingSection, setCurrentlyViewingSection] = React.useState<
    string | null
  >(null)
  const params = useParams()

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
    <ul className="flex list-disc flex-col gap-1.5 font-medium">
      {chapter.resources.map(({title, slug}) => {
        const isActive =
          currentlyViewingSection === slug.current ||
          params?.resource === slug.current
        return (
          <li key={slug.current}>
            <Link
              className={cn('hover:underline', {
                underline: isActive,
              })}
              href={params?.resource ? slug.current : `#${slug.current}`}
            >
              {title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
