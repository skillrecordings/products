'use client'

import type {Chapter} from '@/lib/chapters'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import React from 'react'
import ModeToggle from './mode-toggle'

export const ChapterToC: React.FC<{chapter: Chapter}> = ({chapter}) => {
  const [activeResource, setActiveResource] = React.useState<string | null>(
    null,
  )
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveResource(entry.target.id)
          }
        })
      },
      {threshold: 0},
    )

    const resources = chapter?.resources || []
    resources.forEach((resource) => {
      const el = document.getElementById(resource.slug.current)
      if (el) observer.observe(el)
    })

    return () => {
      resources.forEach((resource) => {
        const el = document.getElementById(resource.slug.current)
        if (el) observer.unobserve(el)
      })
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div className="sticky top-5">
      {/* <Link href={`/book/${chapter.slug.current}/${activeResource}`}>nav</Link>
      <ModeToggle>change mode</ModeToggle> */}
      <strong>In this chapter</strong>
      {chapter?.resources && (
        <ul className="mt-3 flex flex-col gap-2">
          {chapter?.resources?.map((resource) => {
            const isActive = activeResource === resource.slug.current
            return (
              <li key={resource.slug.current}>
                <Link
                  className={cn('', {
                    'font-semibold': isActive,
                  })}
                  href={`#${resource.slug.current}`}
                >
                  {resource.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
