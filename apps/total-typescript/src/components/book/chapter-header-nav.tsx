import type {Book, BookChapter} from '@/lib/book'
import {AArrowDown, AArrowUp} from 'lucide-react'
import Image from 'next/image'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {AccountDropdown} from '../app/navigation'
import {ChaptersIndexMenu} from './chapters-index-menu'
import React from 'react'

const FONT_SIZES = ['sm', 'base', 'lg']
const SIDEBAR_PLACEMENTS = ['left', 'right'] as const
export type SidebarPlacementOptions = (typeof SIDEBAR_PLACEMENTS)[number]

export const ChapterHeaderNav = ({
  book,
  chapter,
  isScrolledPastHero,
  fontSizeIndex,
  setFontSizeIndex,
  sidebarPlacement,
  setSidebarPlacement,
}: {
  book: Book
  chapter: BookChapter
  isScrolledPastHero: boolean
  fontSizeIndex: number
  setFontSizeIndex: React.Dispatch<number>
  sidebarPlacement: string
  setSidebarPlacement: React.Dispatch<SidebarPlacementOptions>
}) => {
  const {status: sessionStatus} = useSession()
  const [isChaptersMenuOpen, setIsChaptersMenuOpen] = React.useState(false)
  React.useEffect(() => {
    chapter && setIsChaptersMenuOpen(false)
  }, [chapter])

  return (
    <>
      <ChaptersIndexMenu
        book={book}
        chapter={chapter}
        isMenuOpen={isChaptersMenuOpen}
        setIsMenuOpen={setIsChaptersMenuOpen}
      />
      <header className="fixed left-0 top-0 z-20 h-10 w-full border-b border-gray-800 bg-background px-3 sm:px-5 lg:border-none">
        <nav className="flex h-10 items-center justify-between gap-5">
          <Link
            href={`/books/${book.slug.current}`}
            className="flex flex-shrink-0 items-center justify-center font-heading text-base font-medium text-foreground transition ease-in-out hover:text-primary"
          >
            <span className="hidden items-center lg:flex">
              <Image
                src={require('../../../public/assets/ts-essentials-desktop-logo-bg@2x.png')}
                width={118}
                priority
                quality={100}
                className="pointer-events-none absolute left-0 top-0 z-50"
                alt={''}
                aria-hidden="true"
              />
              <Image
                src={require('../../../public/assets/ts-essentials-desktop-logo@2x.png')}
                width={158}
                priority
                quality={100}
                className="absolute left-5"
                alt={book.title}
              />
            </span>
            <Image
              src={require('../../../public/assets/ts-essentials-mobile-logo@2x.png')}
              width={158}
              priority
              quality={100}
              className="absolute left-0 top-0 inline-block lg:hidden"
              alt={book.title}
            />
          </Link>
          <div className="pointer-events-none absolute left-0 top-2.5 flex w-full items-center justify-center">
            <motion.div
              className="hidden truncate overflow-ellipsis text-center font-sans text-sm font-medium sm:block"
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: isScrolledPastHero ? 1 : 0,
                y: isScrolledPastHero ? 0 : -10,
              }}
            >
              <Link
                href={`/books/${book.slug.current}/${chapter.slug}`}
                className="transition ease-in-out hover:text-primary"
              >
                {chapter.title}
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center gap-3">
            {sessionStatus === 'loading' ? null : (
              <>
                <div className="flex items-stretch">
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <Popover>
                        <TooltipTrigger asChild>
                          <PopoverTrigger
                            aria-label={'Text & Layout Options'}
                            className="group flex h-full items-stretch justify-center p-1 transition ease-in-out hover:text-primary"
                          >
                            <svg
                              className="transition duration-500 ease-in-out group-hover:rotate-90"
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              aria-hidden="true"
                            >
                              <g
                                strokeWidth="1"
                                fill="none"
                                stroke="currentColor"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="2.5"
                                  stroke="currentColor"
                                />
                                <path d="M13.5,8 c0-0.465-0.064-0.913-0.172-1.344l1.917-1.107l-1.5-2.598L11.83,4.057c-0.644-0.626-1.441-1.093-2.33-1.344V0.5h-3v2.212 C5.612,2.964,4.815,3.431,4.17,4.057L2.255,2.951l-1.5,2.598l1.917,1.107C2.564,7.087,2.5,7.535,2.5,8 c0,0.464,0.064,0.913,0.172,1.344l-1.917,1.107l1.5,2.598l1.916-1.106c0.644,0.626,1.441,1.093,2.33,1.344V15.5h3v-2.212 c0.889-0.252,1.685-0.719,2.33-1.344l1.916,1.106l1.5-2.598l-1.917-1.107C13.436,8.913,13.5,8.464,13.5,8z"></path>{' '}
                              </g>
                            </svg>
                            <span className="sr-only">
                              Text & Layout Options
                            </span>
                          </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background text-foreground">
                          Text{' '}
                          <span className="hidden lg:inline-block">
                            & Layout
                          </span>{' '}
                          options
                        </TooltipContent>
                        <PopoverContent className="flex w-auto flex-col items-start gap-2 bg-background text-foreground">
                          <div className="flex flex-col">
                            <label
                              htmlFor="font-size-slider"
                              className="mb-1 text-sm text-opacity-75"
                            >
                              Text size
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                aria-label="Decrease font size"
                                disabled={fontSizeIndex === 0}
                                type="button"
                                className={cn('opacity-70 transition ', {
                                  'hover:opacity-100': fontSizeIndex !== 0,
                                })}
                                onClick={() => {
                                  if (fontSizeIndex !== 0) {
                                    setFontSizeIndex(fontSizeIndex - 1)
                                  }
                                }}
                              >
                                <AArrowDown className="w-4" />
                              </button>
                              <Slider
                                aria-label="Font size slider"
                                id="font-size-slider"
                                className="w-24 transition hover:brightness-125"
                                value={[fontSizeIndex]}
                                min={0}
                                max={FONT_SIZES.length - 1}
                                onValueChange={(value) => {
                                  setFontSizeIndex(value[0])
                                }}
                              />
                              <button
                                aria-label="Increase font size"
                                disabled={
                                  fontSizeIndex === FONT_SIZES.length - 1
                                }
                                type="button"
                                className={cn('opacity-70 transition ', {
                                  'hover:opacity-100':
                                    fontSizeIndex < FONT_SIZES.length - 1,
                                })}
                                onClick={() => {
                                  if (fontSizeIndex < FONT_SIZES.length - 1) {
                                    setFontSizeIndex(fontSizeIndex + 1)
                                  }
                                }}
                              >
                                <AArrowUp className="w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="hidden flex-col lg:flex">
                            <label
                              htmlFor="sidebar-position"
                              className="mb-1 text-sm text-opacity-75"
                            >
                              Table of contents position
                            </label>
                            <div className="flex items-center">
                              {SIDEBAR_PLACEMENTS.map((placement, i) => (
                                <button
                                  id="sidebar-position"
                                  key={placement}
                                  type="button"
                                  aria-label={`Table of contents position: ${placement}`}
                                  aria-selected={sidebarPlacement === placement}
                                  onClick={() => setSidebarPlacement(placement)}
                                  className={cn(
                                    'border p-2 transition ease-in-out',
                                    {
                                      'border-primary bg-primary text-background':
                                        placement === sidebarPlacement,
                                      'border-gray-700 bg-white/10 text-foreground transition hover:bg-white/20':
                                        placement !== sidebarPlacement,
                                      'rounded-l': i === 0,
                                      'rounded-r':
                                        i === SIDEBAR_PLACEMENTS.length - 1,
                                    },
                                  )}
                                >
                                  <span className="sr-only">{placement}</span>
                                  {placement === 'left' ? (
                                    <svg
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17"
                                      height="14"
                                      fill="none"
                                      viewBox="0 0 17 14"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.5.5h-12A1.5 1.5 0 0 0 1 2v10a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 16 12V2A1.5 1.5 0 0 0 14.5.5ZM5 .5v13M1 7h2M1 4h2m-2 6h2"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="14"
                                      fill="none"
                                      viewBox="0 0 16 14"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14 .5H2A1.5 1.5 0 0 0 .5 2v10A1.5 1.5 0 0 0 2 13.5h12a1.5 1.5 0 0 0 1.5-1.5V2A1.5 1.5 0 0 0 14 .5ZM8.5.5v13M11 7h2m-2-3h2m-2 6h2"
                                      />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* <div className="relative h-3 w-16 border border-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full w-full origin-left bg-primary"
                style={{
                  scaleX: scrollYProgress,
                }}
              />
            </div> */}
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-expanded={isChaptersMenuOpen}
                        aria-label="Chapters Index"
                        className="flex items-center gap-2 p-1 text-sm text-foreground transition hover:text-primary"
                        onClick={() =>
                          setIsChaptersMenuOpen(!isChaptersMenuOpen)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <g
                            strokeWidth="1"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1=".5" y1="2.5" x2="15.5" y2="2.5" />
                            <line
                              x1=".5"
                              y1="8"
                              x2="15.5"
                              y2="8"
                              stroke="currentColor"
                            />
                            <line
                              stroke="currentColor"
                              x1=".5"
                              y1="13.5"
                              x2="8.5"
                              y2="13.5"
                            />
                          </g>
                        </svg>
                        <span className="sr-only">Chapters Index</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-50 bg-background text-foreground">
                      Chapters Index
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {sessionStatus === 'unauthenticated' ? (
                  <Link className="text-sm" href="/login">
                    Login
                  </Link>
                ) : (
                  <ul>
                    <AccountDropdown className="[&_button[data-radix-collection-item]]:h-6 [&_button[data-radix-collection-item]]:bg-transparent [&_button[data-radix-collection-item]]:px-1 [&_button[data-radix-collection-item]]:hover:bg-transparent [&_button[data-radix-collection-item]]:hover:radix-state-closed:bg-transparent [&_button[data-radix-collection-item]]:radix-state-open:bg-transparent [&_div[data-state='open']]:top-[30px] [&_img]:h-6 [&_img]:w-6 [&_ul]:text-sm" />
                  </ul>
                )}
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
