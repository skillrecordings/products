import {useRouter} from 'next/router'
import Link from 'next/link'
import {useEffect} from 'react'

import {ChevronDown, ChevronRight, HomeIcon} from 'lucide-react'
import {useState} from 'react'
import {Section} from 'principles/schemas'
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

      <main className="flex  w-full justify-start">
        <div className="w-full max-w-3xl px-6 py-8 sm:py-14">{children}</div>
      </main>
    </div>
  )
}
