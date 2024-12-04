import {useRouter} from 'next/router'
import Link from 'next/link'
import {useEffect} from 'react'

import {ChevronDown, ChevronRight} from 'lucide-react'
import {useState} from 'react'
import {Section} from 'principles/schemas'
import {ScrollArea} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'

interface PrinciplesLayoutProps {
  children: React.ReactNode
  sections: Section[]
}

export function PrinciplesLayout({children, sections}: PrinciplesLayoutProps) {
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

  useEffect(() => {
    // Reset scroll position on route changes
    window.scrollTo(0, 0)
  }, [router.asPath])

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-72 border-r bg-muted/40 pt-8 md:block">
        <ScrollArea className="h-screen p-4">
          <nav className="space-y-2">
            <Link
              href="/principles"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 transition-colors',
                currentPath === '/principles'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}
            >
              Epic Programming Principles
            </Link>
            {sections.map((section) => (
              <div key={section.slug}>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleSection(section.slug)}
                    className="mr-1 rounded-md p-1 hover:bg-muted"
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
                      'flex-1 rounded-lg px-3 py-2 transition-colors',
                      currentPath === `/principles/${section.slug}`
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted',
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
                          'block rounded-lg px-3 py-1.5 text-sm transition-colors',
                          currentPath ===
                            `/principles/${section.slug}/${principle.slug}`
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted',
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
                            'block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                            currentPath ===
                              `/principles/${section.slug}/${subsection.slug}`
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted',
                          )}
                        >
                          {subsection.title}
                        </Link>
                        {subsection.principles.map((principle) => (
                          <Link
                            key={principle.slug}
                            href={`/principles/${section.slug}/${subsection.slug}/${principle.slug}`}
                            className={cn(
                              'ml-3 block rounded-lg px-3 py-1.5 text-sm transition-colors',
                              currentPath ===
                                `/principles/${section.slug}/${subsection.slug}/${principle.slug}`
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted',
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

      <main className="flex-1 overflow-auto pt-8">
        <div className="container mx-auto max-w-4xl px-6 py-12">{children}</div>
      </main>
    </div>
  )
}
