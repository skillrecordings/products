import {useRouter} from 'next/router'
import Link from 'next/link'
import React, {useEffect} from 'react'

import {ChevronDown, ChevronRight, HomeIcon} from 'lucide-react'
import {useState} from 'react'
import {Section, type Principle, type Subsection} from 'principles/schemas'
import {ScrollArea} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'

interface PrinciplesLayoutProps {
  children: React.ReactNode
  sections: Section[]
  asideClassName?: string
}

export function PrinciplesLayout({
  children,
  sections,
  asideClassName,
}: PrinciplesLayoutProps) {
  const router = useRouter()
  const currentPath = router.asPath
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const currentSection = sections.find(
      (section) =>
        currentPath.includes(section.slug) ||
        section.principles?.some((principle) =>
          currentPath.includes(principle.slug),
        ) ||
        section.subsections?.some((sub) => currentPath.includes(sub.slug)),
    )
    return currentSection ? [currentSection.slug] : []
  })

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  React.useEffect(() => {
    // toggle current section open
    const currentSection = sections.find(
      (section) =>
        currentPath.includes(section.slug) ||
        section.principles?.some((principle) =>
          currentPath.includes(principle.slug),
        ) ||
        section.subsections?.some((sub) => currentPath.includes(sub.slug)),
    )
    if (currentSection) {
      setExpandedSections([currentSection.slug])
    }
  }, [currentPath, sections, setExpandedSections])

  const {prev, next} = findCurrentAndAdjacentItems(sections, currentPath)

  return (
    <div className="flex h-full min-h-screen justify-center gap-5">
      <div
        className={cn(
          'hidden h-auto w-1/2 items-start justify-end bg-gray-100 dark:bg-black/50 md:flex',
          asideClassName,
        )}
      >
        <aside className={cn('flex h-full w-72 border-r pt-8 sm:w-80')}>
          <ScrollArea className="h-full max-h-screen p-4">
            <nav className="space-y-2">
              <Link
                href="/principles"
                className={cn(
                  'flex items-center gap-5 rounded px-3 py-2 pl-1.5 font-bold tracking-tight transition-colors',
                  currentPath === '/principles'
                    ? 'bg-blue-500/5 text-blue-600 dark:bg-blue-300/10 dark:text-blue-300'
                    : 'hover:bg-blue-300/10 dark:hover:bg-blue-300/10',
                )}
              >
                <span>
                  <HomeIcon size={14} />
                </span>{' '}
                Epic Programming Principles
              </Link>
              {sections.map((section) => (
                <div key={section.slug}>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleSection(section.slug)}
                      className="dark:hover:bg-blue-30/100 mr-1 rounded-md p-1 hover:bg-blue-300/10"
                    >
                      {expandedSections.includes(section.slug) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <Link
                      href={`/principles/${section.slug}`}
                      className={cn(
                        'flex-1 rounded px-3 py-2 font-semibold tracking-tight transition-colors hover:text-blue-600 dark:hover:text-blue-300',
                        currentPath === `/principles/${section.slug}`
                          ? 'bg-blue-500/5 text-blue-600 dark:bg-blue-300/10 dark:text-blue-300'
                          : 'hover:bg-blue-300/10 dark:hover:bg-blue-300/10',
                      )}
                    >
                      {section.title}
                    </Link>
                  </div>
                  {expandedSections.includes(section.slug) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.principles?.map((principle) => (
                        <Link
                          key={principle.slug}
                          href={`/principles/${section.slug}/${principle.slug}`}
                          className={cn(
                            'ml-1 block rounded px-3 py-1.5 text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-300',
                            currentPath ===
                              `/principles/${section.slug}/${principle.slug}`
                              ? 'bg-blue-500/5 text-blue-600 dark:bg-blue-300/10 dark:text-blue-300'
                              : 'hover:bg-blue-300/10 dark:hover:bg-blue-300/10',
                          )}
                        >
                          {principle.title}
                        </Link>
                      ))}
                      {section.subsections?.map((subsection) => (
                        <div key={subsection.slug}>
                          <Link
                            href={`/principles/${section.slug}/${subsection.slug}`}
                            className={cn(
                              'block rounded px-3 py-1.5 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-300',
                              currentPath ===
                                `/principles/${section.slug}/${subsection.slug}`
                                ? 'bg-blue-500/5 text-blue-600 dark:bg-blue-300/10 dark:text-blue-300'
                                : 'hover:bg-blue-300/10 dark:hover:bg-blue-300/10',
                            )}
                          >
                            {subsection.title}
                          </Link>
                          {subsection.principles.map((principle) => (
                            <Link
                              key={principle.slug}
                              href={`/principles/${section.slug}/${subsection.slug}/${principle.slug}`}
                              className={cn(
                                'ml-3 block rounded px-3 py-1.5 text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-300',
                                currentPath ===
                                  `/principles/${section.slug}/${subsection.slug}/${principle.slug}`
                                  ? 'bg-blue-500/5 text-blue-600 dark:bg-blue-300/10 dark:text-blue-300'
                                  : 'hover:bg-blue-300/10 dark:hover:bg-blue-300/10',
                              )}
                            >
                              {principle.title}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </aside>
      </div>

      <main className="flex w-full flex-col items-start justify-start">
        <div className="w-full max-w-3xl px-6 py-8 sm:pb-8 sm:pt-14">
          {children}
        </div>
        <nav className="flex w-full max-w-3xl flex-col-reverse flex-wrap items-center justify-between gap-5 px-6 pb-8 text-center sm:flex-row sm:text-left">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex items-center gap-2 text-base text-blue-600 hover:underline dark:text-blue-300 sm:text-lg"
            >
              <ChevronRight className="rotate-180" />
              <span>{prev.item.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group flex items-center gap-2 text-base text-blue-600 hover:underline dark:text-blue-300 sm:text-lg"
            >
              <span>{next.item.title}</span>
              <ChevronRight />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>
    </div>
  )
}

type NavigableItem = Section | Subsection | Principle

function findCurrentAndAdjacentItems(
  sections: Section[],
  currentPath: string,
): {
  prev: {item: NavigableItem; href: string} | null
  current: NavigableItem | null
  next: {item: NavigableItem; href: string} | null
} {
  // Create flattened array maintaining hierarchy order
  const flattenedItems: {
    item: NavigableItem
    parentSlug?: string
    subsectionSlug?: string
  }[] = []

  sections.forEach((section) => {
    flattenedItems.push({item: section})

    // Add principles directly under section
    section.principles?.forEach((principle) => {
      flattenedItems.push({
        item: principle,
        parentSlug: section.slug,
      })
    })

    // Add subsections and their principles
    section.subsections?.forEach((subsection) => {
      flattenedItems.push({
        item: subsection,
        parentSlug: section.slug,
      })

      subsection.principles?.forEach((principle) => {
        flattenedItems.push({
          item: principle,
          parentSlug: section.slug,
          subsectionSlug: subsection.slug,
        })
      })
    })
  })

  // Find current item index based on full path match
  const currentIndex = flattenedItems.findIndex(
    ({item, parentSlug, subsectionSlug}) => {
      if (subsectionSlug) {
        return currentPath.includes(
          `/principles/${parentSlug}/${subsectionSlug}/${item.slug}`,
        )
      }
      if (parentSlug) {
        return currentPath.includes(`/principles/${parentSlug}/${item.slug}`)
      }
      return currentPath === `/principles/${item.slug}`
    },
  )

  const buildItemPath = (item: (typeof flattenedItems)[0]) => {
    if (item.subsectionSlug) {
      return `/principles/${item.parentSlug}/${item.subsectionSlug}/${item.item.slug}`
    }
    if (item.parentSlug) {
      return `/principles/${item.parentSlug}/${item.item.slug}`
    }
    return `/principles/${item.item.slug}`
  }

  return {
    prev:
      currentIndex > 0
        ? {
            item: flattenedItems[currentIndex - 1].item,
            href: buildItemPath(flattenedItems[currentIndex - 1]),
          }
        : null,
    current: currentIndex !== -1 ? flattenedItems[currentIndex].item : null,
    next:
      currentIndex !== -1 && currentIndex < flattenedItems.length - 1
        ? {
            item: flattenedItems[currentIndex + 1].item,
            href: buildItemPath(flattenedItems[currentIndex + 1]),
          }
        : null,
  }
}
