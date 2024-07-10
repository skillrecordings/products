import type {MarkdownHeading} from '@/utils/extract-markdown-headings'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import React from 'react'

export const SecondaryChapterToC: React.FC<{
  toc: MarkdownHeading[]
  visibleHeadingId: string | null
  maxWidth: string
  className?: string
}> = ({toc, visibleHeadingId, maxWidth, className}) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 flex h-screen origin-left scale-90 flex-col items-center justify-center mix-blend-difference',
        className,
      )}
    >
      <nav className="group py-16 pr-5 scrollbar-none hover:overflow-y-auto">
        <strong className="relative inline-flex translate-x-0 text-lg font-semibold text-white opacity-0 transition group-hover:translate-x-7 group-hover:opacity-100">
          In this chapter
        </strong>
        <ol className="mt-3 flex flex-col [&_*]:duration-300">
          {toc.map((item, i) => (
            <li key={item.slug}>
              <Link
                className="inline-flex min-h-3 items-center gap-2 leading-tight transition hover:text-foreground"
                href={`#${item.slug}`}
              >
                <div
                  className={cn(
                    'relative h-px w-5 bg-gray-400 transition group-hover:-translate-x-5',
                    {
                      'bg-primary opacity-100': visibleHeadingId === item.slug,
                    },
                  )}
                />
                <span
                  className={cn(
                    'relative -translate-x-10 truncate text-nowrap font-semibold text-white opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 hover:text-primary',
                    {
                      'text-primary group-hover:opacity-100':
                        visibleHeadingId === item.slug,
                    },
                  )}
                  style={{
                    maxWidth,
                  }}
                >
                  {item.text.replace(/`/g, '')}
                </span>
              </Link>
              {item.text.trim() !== 'Exercises' && item.items.length > 0 && (
                <ol>
                  {item.items
                    .filter(({level}) => level < 4)
                    .map((subItem) => (
                      <li key={subItem.slug}>
                        <Link
                          className="inline-flex min-h-3 items-center gap-2"
                          href={`#${subItem.slug}`}
                        >
                          <div
                            className={cn(
                              'relative h-px w-3 bg-gray-400 transition group-hover:-translate-x-5',
                              {
                                'bg-primary': visibleHeadingId === subItem.slug,
                              },
                            )}
                          />
                          <span
                            className={cn(
                              'relative ml-6 -translate-x-10 truncate text-nowrap opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 hover:text-primary',
                              {
                                'text-[#ADF2F2] group-hover:opacity-100':
                                  visibleHeadingId === subItem.slug,
                              },
                            )}
                            style={{
                              maxWidth,
                            }}
                          >
                            {subItem.text.replace(/`/g, '')}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

export const useChapterToCMaxWidth = (
  articleRef: React.RefObject<HTMLDivElement>,
  sidebarPlacement: string,
) => {
  const [chapterToCMaxWidth, setChapterToCMaxWidth] = React.useState('100%')

  React.useEffect(() => {
    if (sidebarPlacement === 'left') {
      const handleResize = () => {
        const articleSpaceFromLeft =
          articleRef.current?.getBoundingClientRect().left
        setChapterToCMaxWidth(
          articleSpaceFromLeft ? `${articleSpaceFromLeft - 50}px` : '100%',
        )
      }

      // Call handleResize right away so that chapterNavMaxWidth gets set initially
      handleResize()

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [articleRef, sidebarPlacement]) // Dependency on articleRef to re-run effect if it changes

  return chapterToCMaxWidth
}
