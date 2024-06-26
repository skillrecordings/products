import {trpc} from '@/trpc/trpc.client'
import type {MarkdownHeading} from '@/utils/extract-markdown-headings'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {cn} from '@skillrecordings/ui/utils/cn'
import {motion, useReducedMotion} from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import {ProEssentialsBanner} from './pro-essentials-banner'

const useAbilities = () => {
  const {data: abilityRules, status: abilityRulesStatus} =
    trpc.modules.rules.useQuery({
      moduleSlug: 'typescript-pro-essentials',
      moduleType: 'workshop',
    })
  return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
}

export const PrimaryChapterToC = ({
  toc,
  fontSizeIndex,
  visibleHeadingId,
}: {
  toc: MarkdownHeading[]
  fontSizeIndex: number
  visibleHeadingId: string | null
}) => {
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewTypeScriptProEssentials = ability.can('view', 'Content')

  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isScrolledAllTheWayDown, setIsScrolledAllTheWayDown] =
    React.useState(false)

  // determine whether use scrolled all the way down inside scrollAreaRef

  React.useEffect(() => {
    const handleScroll = () => {
      const {scrollTop, scrollHeight, clientHeight} = scrollAreaRef.current!
      setIsScrolledAllTheWayDown(
        scrollHeight <= clientHeight ||
          scrollTop + clientHeight >= scrollHeight,
      )
    }

    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      // Initial check in case the content or viewport size changes
      handleScroll()
      scrollArea.addEventListener('scroll', handleScroll)

      // Resize observer to handle dynamic content or window resizing
      const resizeObserver = new ResizeObserver(handleScroll)
      resizeObserver.observe(scrollArea)

      return () => {
        scrollArea.removeEventListener('scroll', handleScroll)
        resizeObserver.unobserve(scrollArea)
      }
    }
  }, [scrollAreaRef.current])

  const shouldReduceMotion = useReducedMotion()

  // Update isScrolled state based on scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      scrollAreaRef?.current &&
        setIsScrolled(scrollAreaRef.current.scrollTop > 0)
    }

    const scrollArea = scrollAreaRef.current
    scrollArea?.addEventListener('scroll', handleScroll)

    return () => {
      scrollArea?.removeEventListener('scroll', handleScroll)
    }
  }, [scrollAreaRef.current])

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (scrollAreaRef.current && visibleHeadingId) {
      timeoutId = setTimeout(() => {
        const element =
          scrollAreaRef.current?.querySelector(`[data-active="true"]`)
        const offset = 80
        if (element) {
          const top = (element as HTMLElement).offsetTop - offset
          scrollAreaRef.current!.scrollTo({
            top,
            behavior: shouldReduceMotion ? 'instant' : 'smooth',
          })
        }
      }, 500) // 500ms delay
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [scrollAreaRef.current, visibleHeadingId])

  const bannerRef = React.useRef<HTMLAnchorElement>(null)
  const [bannerHeight, setBannerHeight] = React.useState(0)

  React.useEffect(() => {
    if (bannerRef.current) {
      const padding = 20
      setBannerHeight(bannerRef.current.clientHeight + padding)
    }
  }, [bannerRef.current, setBannerHeight])

  return (
    <aside
      className={cn('relative w-full max-w-[300px] pl-5 pt-20', {
        'hidden xl:block': fontSizeIndex === 2,
        'hidden lg:block': fontSizeIndex !== 2,
      })}
    >
      <div className="sticky top-16">
        <motion.div
          initial={{
            opacity: 1,
          }}
          animate={{opacity: isScrolledAllTheWayDown ? 0 : 1}}
          aria-hidden="true"
          style={{
            bottom: bannerHeight,
          }}
          className={`pointer-events-none absolute left-0 z-10 h-20 w-full bg-gradient-to-t from-background to-transparent`}
        />

        <motion.div
          initial={{opacity: 0}}
          animate={{
            opacity: isScrolled ? 1 : 0,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-20 w-full bg-gradient-to-b from-background to-transparent"
        />

        <div
          className={`h-full overflow-y-auto scrollbar-none`}
          style={{
            maxHeight: `calc(100vh - 7rem - ${bannerHeight}px)`,
          }}
          ref={scrollAreaRef}
        >
          <strong>On this page</strong>
          <nav className="group">
            <ol className="mt-3 flex flex-col">
              {toc.map((item, i) => (
                <li
                  key={item.slug}
                  data-active={visibleHeadingId === item.slug}
                >
                  <Link
                    className="inline-flex min-h-3 items-center gap-2 py-2 leading-tight transition hover:text-foreground"
                    href={`#${item.slug}`}
                  >
                    <span
                      className={cn(
                        'relative font-semibold text-white transition hover:text-primary',
                        {
                          'text-primary group-hover:opacity-100':
                            visibleHeadingId === item.slug,
                        },
                      )}
                    >
                      {item.text.replace(/`/g, '')}
                    </span>
                  </Link>
                  {item.items.length > 0 && (
                    <ol>
                      {item.items
                        .filter(({level}) => level < 4)
                        .map((subItem) => (
                          <li
                            key={subItem.slug}
                            data-active={visibleHeadingId === subItem.slug}
                          >
                            <Link
                              className="relative inline-flex min-h-3 items-center gap-2 py-1"
                              href={`#${subItem.slug}`}
                            >
                              <div
                                className={cn(
                                  'absolute left-1 top-0 h-full w-[2px] bg-white/10',
                                  {
                                    'bg-primary':
                                      visibleHeadingId === subItem.slug,
                                  },
                                )}
                              />
                              <span
                                className={cn(
                                  'relative pl-5 transition hover:text-primary',
                                  {
                                    'text-[#ADF2F2] group-hover:opacity-100':
                                      visibleHeadingId === subItem.slug,
                                  },
                                )}
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
        </div>
        {!canViewTypeScriptProEssentials &&
          abilityRulesStatus === 'success' && (
            <ProEssentialsBanner ref={bannerRef} />
          )}
      </div>
    </aside>
  )
}
