import * as React from 'react'
import Layout from '@/components/app/layout'
import SetLocalDevPrefsDialog from '../../../../exercise/local-dev-prefs/dialog'
import {
  AArrowDown,
  AArrowUp,
  CogIcon,
  MenuIcon,
  MessageCircleCodeIcon,
} from 'lucide-react'
import {getBook, getBookChapter, type Book, type BookChapter} from '@/lib/book'
import slugify from '@sindresorhus/slugify'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {cn} from '@skillrecordings/ui/utils/cn'
import groq from 'groq'
import type {MDXComponents} from 'mdx/types'
import type {GetStaticPaths, GetStaticProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import Link from 'next/link'
import '@/styles/shiki-twoslash.css'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  type Variants,
} from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
  Button,
} from '@skillrecordings/ui'
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui/primitives/dialog'
import {BookmarkIcon, ViewListIcon, XIcon} from '@heroicons/react/outline'
import {BookmarkIcon as BookmarkIconSolid} from '@heroicons/react/solid'
import {useCopyToClipboard} from 'react-use'
import {isBrowser} from '@/utils/is-browser'
import toast from 'react-hot-toast'
import {localBookDb} from '@/utils/dexie'
import {useBookmark} from '@/hooks/use-bookmark'
import {useSession} from 'next-auth/react'
import {trpc} from '@/trpc/trpc.client'

import {Icon} from '@skillrecordings/skill-lesson/icons'
import ReactMarkdown from 'react-markdown'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const book = await getBook(params?.book as string)
  const chapter = await getBookChapter(params?.chapter as string)

  if (!chapter) {
    return {
      notFound: true,
    }
  }
  const chapters = book && book.chapters
  const currentChapterIndex =
    chapters?.findIndex((c) => c._id === chapter._id) || 0
  const nextChapter = chapters?.[currentChapterIndex + 1] || null
  const prevChapter = chapters?.[currentChapterIndex - 1] || null
  const toc = chapter.body && extractHeadingsFromMarkdown(chapter.body)
  const bodyWithParsedComments =
    chapter.body &&
    chapter.body.replaceAll('<!--', '`{/*').replaceAll('-->', '*/}`')

  const chapterBody =
    bodyWithParsedComments &&
    (await serializeMDX(bodyWithParsedComments, {
      useShikiTwoslash: true,
      syntaxHighlighterOptions: {
        authorization: process.env.SHIKI_AUTH_TOKEN,
        endpoint: process.env.SHIKI_ENDPOINT,
      },
    }))

  return {
    props: {
      chapter,
      chapterBody,
      nextChapter,
      prevChapter,
      book,
      toc,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const books =
    await sanityClient.fetch(groq`*[_type == "module" && moduleType == 'book'] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        moduleType,
        "slug": slug.current,
        title,
        'chapters': resources[]->{
          _id,
          _type,
          moduleType,
          title,
          "slug": slug.current,
        }
  }`)

  const booksAndChapters = books.map((book: Book) => ({
    chapters: book.chapters,
    slug: book.slug,
  }))

  const paths = booksAndChapters.flatMap((book: Book) =>
    book.chapters.map((chapter: {slug: string}) => ({
      params: {chapter: chapter.slug, book: book.slug},
    })),
  )

  return {paths, fallback: 'blocking'}
}

const BookChapterRoute: React.FC<{
  chapter: BookChapter
  book: Book
  nextChapter: BookChapter | null
  prevChapter: BookChapter | null
  chapterBody: MDXRemoteSerializeResult
  toc: Heading[]
}> = ({chapter, nextChapter, prevChapter, chapterBody, book, toc}) => {
  const chapterIndex = book.chapters.findIndex((c) => c._id === chapter._id)
  const headings = toc.flatMap((h) => [
    h.slug,
    ...h.items.flatMap((item) => item.slug),
  ])

  const visibleHeadingId = useVisibleHeading(headings, {
    rootMargin: '0% 0% -80% 0%',
    threshold: 0.5,
  })

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const articleRef = React.useRef<HTMLDivElement>(null)

  const {scrollYProgress} = useScroll()

  React.useEffect(() => {
    chapter && setIsMenuOpen(false)
  }, [chapter])

  const handleAddBookmark = async (heading: {id: string; children: string}) => {
    await localBookDb.bookmarks
      .add({
        eventName: 'bookmark',
        module: book.slug.current,
        section: {
          title: chapter.title,
          slug: chapter.slug,
        },
        resource: heading,
        createdOn: new Date(),
      })
      .then(() => {
        toast.success('Bookmark added')
      })
  }

  const heroRef = React.useRef<HTMLDivElement>(null)
  const [isScrolledPastHero, setIsScrolledPastHero] = React.useState(false)

  const isHeroInView = useInView(heroRef, {
    amount: 0.2,
  })

  React.useEffect(() => {
    if (!isHeroInView) {
      setIsScrolledPastHero(true)
    } else {
      setIsScrolledPastHero(false)
    }
  }, [isHeroInView])

  const FONT_SIZES = ['sm', 'base', 'lg']
  const [fontSizeIndex, setFontSizeIndex] = React.useState(1)

  const SIDEBAR_PLACEMENTS = ['left', 'right']
  const [sidebarPlacement, setSidebarPlacement] = React.useState('right')

  const chapterNavMaxWidth = useChapterNavMaxWidth(articleRef, sidebarPlacement)

  return (
    <Layout
      meta={{
        title: chapter.title,
        defaultTitle: book.title,
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}/api/og/og-book?title=${chapter.title}`,
        },
      }}
      nav={null}
      footer={null}
      className="relative"
    >
      <ChaptersMenu
        book={book}
        chapter={chapter}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <header className="fixed left-0 top-0 z-20 h-10 w-full border-b border-gray-800 bg-background p-2 px-3 sm:px-5 lg:border-none">
        <nav className="flex items-center justify-between gap-5">
          <Link
            href={`/books/${book.slug.current}`}
            className="flex flex-shrink-0 items-center justify-center font-heading text-base font-medium text-foreground transition ease-in-out hover:text-primary"
          >
            <span className="hidden sm:inline-block">{book.title}</span>
            <svg
              className="inline-block w-5 sm:hidden"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.75 1.5C9.679 1.5 8 2.395 8 3.5C8 2.395 6.321 1.5 4.25 1.5C2.179 1.5 0.5 2.395 0.5 3.5V14.5C0.5 13.395 2.179 12.5 4.25 12.5C6.321 12.5 8 13.395 8 14.5C8 13.395 9.679 12.5 11.75 12.5C13.821 12.5 15.5 13.395 15.5 14.5V3.5C15.5 2.395 13.821 1.5 11.75 1.5Z"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.98567 10.0333C5.70553 10.0333 5.53545 9.85326 5.53545 9.55311V6.20479H4.57164C4.3482 6.20479 4.18478 6.04471 4.18478 5.82794C4.18478 5.60783 4.3482 5.44775 4.57164 5.44775H7.40304C7.62982 5.44775 7.7899 5.6045 7.7899 5.82794C7.7899 6.04805 7.62982 6.20479 7.40304 6.20479H6.43589V9.55311C6.43589 9.84993 6.26248 10.0333 5.98567 10.0333ZM8.04335 9.06287C8.04335 8.83609 8.2001 8.67601 8.40353 8.67601C8.55361 8.67601 8.677 8.73938 8.83708 8.9128C9.09387 9.20961 9.43404 9.36302 9.8309 9.36302C10.3645 9.36302 10.668 9.14958 10.668 8.7794C10.668 8.47258 10.4545 8.28249 9.96097 8.16576L9.28063 7.99901C8.49691 7.81892 8.10672 7.40205 8.10672 6.74172C8.10672 5.90464 8.76705 5.36104 9.78088 5.36104C10.3245 5.36104 10.8114 5.51779 11.1115 5.79459C11.3183 5.98135 11.4284 6.19479 11.4284 6.40489C11.4284 6.61499 11.2816 6.7584 11.0648 6.7584C10.9248 6.7584 10.8047 6.69837 10.698 6.56497C10.4946 6.26149 10.1877 6.0914 9.79422 6.0914C9.32065 6.0914 9.01717 6.31818 9.01717 6.67169C9.01717 6.95516 9.22394 7.15526 9.64748 7.25198L10.3312 7.41539C11.1649 7.60548 11.5584 8.00902 11.5584 8.67935C11.5584 9.54644 10.8681 10.0967 9.78088 10.0967C9.19059 10.0967 8.667 9.9333 8.36685 9.64983C8.15674 9.4564 8.04335 9.25296 8.04335 9.06287Z"
                fill="white"
              />
            </svg>
          </Link>
          <motion.div
            className="hidden truncate overflow-ellipsis font-sans text-sm font-medium sm:block"
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
          <div className="flex items-center gap-5">
            <div className="flex items-stretch">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <Popover>
                    <TooltipTrigger asChild>
                      <PopoverTrigger className="group flex h-full items-stretch justify-center p-1 transition ease-in-out hover:text-primary">
                        <svg
                          className="transition duration-500 ease-in-out group-hover:rotate-90"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
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
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background text-foreground">
                      Text{' '}
                      <span className="hidden lg:inline-block">& Layout</span>{' '}
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
                            disabled={fontSizeIndex === FONT_SIZES.length - 1}
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
            <div className="relative h-3 w-16 border border-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full w-full origin-left bg-primary"
                style={{
                  scaleX: scrollYProgress,
                }}
              />
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-label="Book chapters"
                    className="flex items-center gap-2 p-1 text-sm text-foreground transition hover:text-primary"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <svg
                      className="w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 3.5H11.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.5 6.5H11.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.5 9.5H7.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.5 0.5H2.5C1.94772 0.5 1.5 0.947715 1.5 1.5V14.5C1.5 15.0523 1.94772 15.5 2.5 15.5H13.5C14.0523 15.5 14.5 15.0523 14.5 14.5V1.5C14.5 0.947715 14.0523 0.5 13.5 0.5Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.5 12.5H14.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>{' '}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="z-50 bg-background text-foreground">
                  Chapters Index
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </nav>
      </header>
      <main className="relative z-10">
        {/* OUTLINE */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-20 h-screen w-full p-5 pt-10"
        >
          <div className="hidden h-full w-full border border-gray-800 lg:block" />
        </div>
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-[80vh] w-full flex-col items-center justify-center bg-background"
        >
          <div className="absolute left-0 top-0 flex h-[calc(100%-2.5rem)] w-full flex-col items-center justify-center gap-20 overflow-hidden border-b border-gray-800 p-5 text-center sm:left-5 sm:top-10 sm:w-[calc(100%-2.5rem)] sm:border-x sm:p-16 lg:border">
            <p className="relative z-10 inline-flex items-center gap-3 font-text text-base font-medium text-primary sm:text-xl">
              {/* <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '} */}
              Chapter {chapterIndex + 1}{' '}
              {/* <span className="h-px w-10 bg-gray-800" aria-hidden="true" /> */}
            </p>
            <h1 className="relative z-10 text-balance font-heading text-4xl font-bold italic text-white sm:text-6xl lg:text-8xl">
              {chapter.title}
            </h1>
            <p className="relative z-10 max-w-md text-balance text-center font-text text-base sm:text-xl">
              {chapter.description ? chapter.description : null}
            </p>
            <div className="absolute z-0 font-heading text-[80vh] font-bold opacity-5">
              {chapterIndex + 1}
            </div>
          </div>
        </section>
        {toc && sidebarPlacement === 'left' && (
          <ChapterSideNav
            className="z-30 hidden lg:flex"
            toc={toc}
            visibleHeadingId={visibleHeadingId}
            chapterNavMaxWidth={chapterNavMaxWidth}
          />
        )}

        <div className="relative z-10 flex h-full w-full justify-center bg-background pb-16">
          <article
            className={cn('w-full p-5 pt-5 sm:pt-16', {
              'max-w-3xl': fontSizeIndex === 1 || fontSizeIndex === 0,
              'max-w-4xl': fontSizeIndex === 2,
            })}
          >
            <div
              ref={articleRef}
              className={cn(
                // [&_.code-container]:p-5 [&_.shiki]:p-0
                'prose max-w-none prose-headings:scroll-m-20 prose-headings:text-white prose-p:text-foreground prose-code:text-white prose-li:text-foreground [&>li>code]:bg-gray-800 [&>p>code]:bg-gray-800 [&_h2>code]:bg-gray-800 [&_h3>code]:bg-gray-800 [&_h4>code]:bg-gray-800',
                {
                  'prose-sm sm:prose-base lg:prose-lg': fontSizeIndex === 0,
                  'prose-base sm:prose-lg lg:prose-xl': fontSizeIndex === 1,
                  'prose-lg sm:prose-xl lg:prose-2xl': fontSizeIndex === 2,
                  'prose-p:text-justify prose-li:text-justify': false,
                },
              )}
            >
              <MDX
                contents={chapterBody}
                components={{
                  Exercise: ({
                    filePath,
                    title,
                    ...rest
                  }: {
                    filePath: string
                    title?: string
                  }) => {
                    return (
                      <Exercise
                        filePath={filePath}
                        title={title}
                        book={book}
                        {...rest}
                      />
                    )
                  },
                  h2: (props: any) => {
                    return (
                      <LinkedHeading
                        onAddBookmark={handleAddBookmark}
                        as="h2"
                        {...props}
                      />
                    )
                  },
                  h3: (props: any) => {
                    return (
                      <LinkedHeading
                        onAddBookmark={handleAddBookmark}
                        as="h3"
                        {...props}
                      />
                    )
                  },
                  h4: (props: any) => {
                    return <h4 {...props} />
                  },
                }}
              />
            </div>
          </article>
          {toc && sidebarPlacement === 'right' && (
            <RightToCSideBar
              toc={toc}
              fontSizeIndex={fontSizeIndex}
              visibleHeadingId={visibleHeadingId}
            />
          )}
        </div>
      </main>
      <section className="bottom-0 left-0 flex w-full grid-cols-2 flex-col-reverse items-center justify-end gap-10 bg-gray-800 p-5 pb-24 pt-11 sm:pb-5 md:fixed md:z-0 md:grid md:h-screen">
        {prevChapter ? (
          <Link
            href={`/books/${book.slug.current}/${prevChapter.slug}`}
            className="group relative flex h-full w-full flex-col items-center justify-center px-5 py-8 text-center font-heading text-2xl font-bold transition duration-300 ease-in-out hover:bg-gray-700 sm:text-4xl md:justify-between lg:p-16 lg:pt-32 lg:text-5xl"
          >
            <div
              aria-hidden="true"
              className="absolute font-heading text-[30vw] font-bold text-background/50 md:static"
            >
              {chapterIndex}
            </div>
            <div className="relative z-10 flex flex-col text-balance transition ease-in-out group-hover:text-white">
              <span className="mb-3 font-sans text-sm font-medium uppercase tracking-wide opacity-75">
                Previous
              </span>
              {prevChapter.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/books/${book.slug.current}/${nextChapter.slug}`}
            className="group relative flex h-full w-full flex-col items-center justify-center px-5 py-8 text-center font-heading text-2xl font-bold transition duration-300 ease-in-out hover:bg-gray-700 sm:text-4xl md:justify-between lg:p-16 lg:pt-32 lg:text-5xl"
          >
            <div
              aria-hidden="true"
              className="absolute font-heading text-[30vw] font-bold text-background/50 md:static"
            >
              {chapterIndex + 2}
            </div>
            <div className="relative z-10 flex flex-col text-balance transition ease-in-out group-hover:text-white">
              <span className="mb-3 font-sans text-sm font-medium uppercase tracking-wide opacity-75">
                Next
              </span>
              {nextChapter.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </section>
      <div aria-hidden="true" className="md:h-screen" />
      {toc && (
        <ChapterMobileNav
          toc={toc}
          chapter={chapter}
          book={book}
          className="flex lg:hidden"
          visibleHeadingId={visibleHeadingId}
        />
      )}
    </Layout>
  )
}

export default BookChapterRoute

const bookMdxComponents = {} as MDXComponents

type Heading = {
  level: number
  text: string
  slug: string
  items: Heading[]
}

const extractHeadingsFromMarkdown = (markdown: string): Heading[] => {
  const headingRegex = /(^#{1,6}) (.+)/gm
  let match
  const stack: Heading[] = [{level: 0, text: '', slug: '', items: []}] // Initialize stack with a dummy heading
  const slugMap: Map<string, number> = new Map() // Map to store each slug and its current index

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    let slug = slugify(text, {
      decamelize: false,
      customReplacements: [
        // ['Node.js', 'nodejs'],
        // ['react.js', 'reactjs'],
        ['&', ''],
        ['.', ''],
      ],
    })

    // If the slug already exists in the map, append the current index to it
    if (slugMap.has(slug)) {
      const currentIndex = slugMap.get(slug)!
      slugMap.set(slug, currentIndex + 1)
      slug = `${slug}-${currentIndex}`
    } else {
      slugMap.set(slug, 1)
    }

    const heading: Heading = {level, text, slug, items: []}

    while (level <= stack[stack.length - 1].level) {
      stack.pop()
    }

    stack[stack.length - 1].items.push(heading)
    stack.push(heading)
  }

  return stack[0].items
}

type UseVisibleHeadingOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

const useVisibleHeading = (
  headingIds: string[],
  options?: UseVisibleHeadingOptions,
): string | null => {
  const [visibleHeadingId, setVisibleHeadingId] = React.useState<string | null>(
    null,
  )

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleHeadingId(entry.target.id)
          }
        })
      },
      {
        rootMargin: options?.rootMargin || '0px',
        threshold: options?.threshold || 0,
      },
    )

    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headingIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headingIds, options])

  return visibleHeadingId
}

const useChapterNavMaxWidth = (
  articleRef: React.RefObject<HTMLDivElement>,
  sidebarPlacement: string,
) => {
  const [chapterNavMaxWidth, setChapterNavMaxWidth] = React.useState('100%')

  React.useEffect(() => {
    if (sidebarPlacement === 'left') {
      const handleResize = () => {
        const articleSpaceFromLeft =
          articleRef.current?.getBoundingClientRect().left
        setChapterNavMaxWidth(
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

  return chapterNavMaxWidth
}

const ChaptersMenu: React.FC<{
  book: Book
  chapter: BookChapter
  setIsMenuOpen: React.Dispatch<boolean>
  isMenuOpen: boolean
}> = ({book, chapter: currentChapter, setIsMenuOpen, isMenuOpen}) => {
  const container: Variants = {
    hidden: {
      opacity: 0,

      transition: {duration: 0.5},
    },
    show: {
      opacity: 1,

      transition: {staggerChildren: 0.05, type: 'easeInOut'},
    },
  }

  const item: Variants = {
    hidden: {opacity: 0, y: -20},
    show: {opacity: 1, y: 0},
  }

  return (
    <>
      <Dialog
        open={isMenuOpen}
        onOpenChange={(open) => {
          setIsMenuOpen(open)
        }}
      >
        <DialogContent
          withCloseButton={false}
          className="left-0 top-0 h-full w-full max-w-none translate-x-0 translate-y-0"
        >
          <motion.nav
            variants={container}
            initial="hidden"
            animate="show"
            className="fixed left-0 top-0 flex h-screen w-full flex-col items-center justify-start overflow-y-auto bg-background py-5 text-foreground scrollbar-none sm:py-8"
          >
            <DialogHeader className="mx-auto w-full max-w-4xl border-b border-gray-800 p-5 pb-8 sm:p-10 sm:pb-5">
              <DialogTitle className="flex w-full flex-col">
                <motion.span className="text-2xl font-semibold sm:text-3xl">
                  <Link href={`/books/${book.slug.current}`}>{book.title}</Link>
                </motion.span>
              </DialogTitle>
              <p className="sm:text-lefttext-center font-sans text-lg font-normal opacity-75 sm:pt-16">
                Chapters Index
              </p>
            </DialogHeader>
            <motion.ol className="mx-auto flex w-full max-w-4xl flex-col pb-24">
              {book.chapters.map((chapter, i) => {
                const isCurrentChapter = chapter._id === currentChapter._id

                return (
                  <motion.li variants={item} key={chapter._id}>
                    <Link
                      className={cn(
                        'flex items-center gap-5 rounded px-5 py-3 font-text text-xl font-semibold transition duration-300 hover:bg-primary hover:text-background sm:gap-10 sm:px-10 sm:py-5 sm:text-3xl sm:italic',
                        {
                          'bg-gray-800 text-primary hover:brightness-110':
                            isCurrentChapter,
                        },
                      )}
                      href={`/books/${book.slug.current}/${chapter.slug}`}
                    >
                      <span className="font-mono text-xs opacity-50">
                        {i + 1}
                      </span>
                      <span>{chapter.title}</span>
                      {isCurrentChapter && (
                        <span className="not-italic" aria-hidden="true">
                          ☜
                        </span>
                      )}
                    </Link>
                  </motion.li>
                )
              })}
              <DialogClose className="fixed right-2 top-0.5 rounded-full bg-gray-800 p-3 transition ease-in-out hover:bg-gray-700 active:bg-gray-700 sm:right-5">
                <XIcon className="h-5 w-5" />
              </DialogClose>
            </motion.ol>
          </motion.nav>
        </DialogContent>
      </Dialog>
    </>
  )
}

const ChapterSideNav: React.FC<{
  toc: Heading[]
  visibleHeadingId: string | null
  chapterNavMaxWidth: string
  className?: string
}> = ({toc, visibleHeadingId, chapterNavMaxWidth, className}) => {
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
                    maxWidth: chapterNavMaxWidth,
                  }}
                >
                  {item.text.replace(/`/g, '')}
                </span>
              </Link>
              {item.items.length > 0 && (
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
                              maxWidth: chapterNavMaxWidth,
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

const ChapterMobileNav: React.FC<{
  toc: Heading[]
  book: Book
  chapter: BookChapter
  visibleHeadingId: string | null
  className?: string
}> = ({toc, visibleHeadingId, className, chapter, book}) => {
  const currentChapterIndex = book.chapters.findIndex(
    (c) => c._id === chapter._id,
  )
  const container: Variants = {
    hidden: {
      // opacity: 0,
      transition: {duration: 0.2},
    },
    show: {
      // opacity: 1,
      transition: {staggerChildren: 0.05, type: 'easeInOut'},
    },
  }

  const item: Variants = {
    hidden: {opacity: 0, y: 30},
    show: {
      opacity: 1,
      y: 0,
      transition: {staggerChildren: 0.05, type: 'easeInOut', duration: 0.2},
    },
  }
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'fixed bottom-3 right-3 z-40 flex items-center justify-center gap-1 rounded bg-gray-800 px-3 py-2 text-sm font-medium text-foreground',
          className,
        )}
      >
        <MenuIcon className="h-5 w-5 " /> On this page
      </DialogTrigger>
      <DialogContent
        withCloseButton={false}
        className="left-0 top-0 z-50 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col bg-background p-0 py-5 text-foreground"
      >
        <DialogHeader className="border-b border-gray-800 p-5">
          <DialogTitle>
            <span className="relative flex flex-col items-center justify-center gap-2">
              <p className="relative z-10 inline-flex items-center gap-3 font-text text-sm font-medium">
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '}
                Chapter {currentChapterIndex + 1}{' '}
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />
              </p>
              <strong className="text-balance px-2 font-heading text-3xl font-semibold italic text-white">
                {chapter.title}
              </strong>
            </span>
          </DialogTitle>
        </DialogHeader>
        <nav className="overflow-y-auto p-5 py-0 text-lg">
          <strong className="text-sm font-semibold uppercase opacity-65">
            In this chapter
          </strong>
          <ol className="mt-3 flex flex-col gap-2 pb-16">
            {toc.map((heading, i) => (
              <li key={heading.slug}>
                <div>
                  <DialogClose asChild>
                    <Link
                      href={`#${heading.slug}`}
                      className="font-semibold text-white"
                    >
                      <span
                        className={cn('', {
                          '': visibleHeadingId === heading.slug,
                        })}
                      >
                        {heading.text.replace(/`/g, '')}
                      </span>
                    </Link>
                  </DialogClose>
                </div>
                {heading.items.length > 0 && (
                  <ol>
                    {heading.items
                      .filter(({level}) => level < 4)
                      .map((subItem) => (
                        <li key={subItem.slug}>
                          <div className="pl-5">
                            <DialogClose asChild>
                              <Link
                                className="leading-tight"
                                href={`#${subItem.slug}`}
                              >
                                {subItem.text.replace(/`/g, '')}
                              </Link>
                            </DialogClose>
                          </div>
                        </li>
                      ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <DialogClose className="fixed bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#001816]">
          <XIcon className="h-5 w-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

interface LinkedHeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  as?: Extract<
    keyof JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >
  onAddBookmark?: (heading: {id: string; children: string}) => Promise<void>
}

const LinkedHeading: React.FC<LinkedHeadingProps> = ({
  as = 'h2',
  onAddBookmark,
  ...props
}) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  const linkToTitle = `#${props.id}`
  const {resourceBookmarked, refetch} = useBookmark(props.id as string)
  const handleOnClick = () => {
    if (isBrowser()) {
      const url = window.location.href
      const hash = window.location.hash
      const strippedUrl = url.replace(hash, '')

      copyToClipboard(strippedUrl + linkToTitle)
      toast.success('Link copied')
    }
  }

  const H = () =>
    React.createElement(
      as,
      {
        className: 'group cursor-pointer relative pr-10',
        onClick: handleOnClick,
        ...props,
        // rehypeSlug treats ampersands as invalid characters so this is a workaround for that
        id: props?.id?.replaceAll('--', '-'),
      },
      props.children,
    )

  return (
    <span className="relative inline-flex w-full items-center">
      <span className="group relative inline-flex w-full items-center">
        <a
          href={linkToTitle}
          className="absolute left-[-2ch] translate-y-3 pr-3 !text-white/50 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-cyan-300"
          aria-hidden="true"
        >
          #
        </a>
        <H />
      </span>
      {onAddBookmark && (
        <button
          className="absolute right-0 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-amber-300/10 p-2 transition duration-300 group-hover:bg-amber-300/20 hover:bg-amber-300/20 sm:translate-y-3"
          type="button"
          onClick={async () => {
            if (resourceBookmarked) {
              await localBookDb.bookmarks
                .delete(resourceBookmarked.id as number)
                .then(() => {
                  toast.success('Bookmark removed')
                })
              await refetch()
            } else {
              await onAddBookmark({
                id: props.id as string,
                children: childrenToString(props.children),
              })
              await refetch()
            }
          }}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                {resourceBookmarked ? (
                  <BookmarkIconSolid className="h-5 w-5 text-amber-200" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-amber-200" />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground">
                {resourceBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="sr-only">Add Bookmark</span>
        </button>
      )}
    </span>
  )
}

function childrenToString(children: React.ReactNode): any {
  return React.Children.toArray(children).reduce((str, child) => {
    if (typeof child === 'string') {
      return str + child
    }
    if (React.isValidElement(child) && child.props.children) {
      return str + childrenToString(child.props.children)
    }
    return str
  }, '')
}

const Exercise = ({
  filePath,
  book,
  title,
}: {
  filePath: string
  book: Book
  title?: string
}) => {
  const {data: session} = useSession()
  const {data: userPrefs, status: userPrefsStatus} =
    trpc.userPrefs.getLocal.useQuery(
      {
        resourceId: book._id,
      },
      {
        enabled: Boolean(session?.user && book),
      },
    )
  const [isPrefsDialogOpen, setIsPrefsDialogOpen] = React.useState(false)
  const canOpenExerciseInLocalEditor = Boolean(userPrefs)

  return (
    <div className="not-prose relative mt-10 flex flex-col items-center gap-5 rounded-lg bg-[#1B222F] px-5 pb-8 pt-2 sm:px-6">
      <div
        className="flex w-full items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute -top-2.5 h-5 w-5 rotate-45 bg-[#1B222F]" />
      </div>
      {title && (
        <p className="inline-flex items-center gap-2 text-balance text-center text-base sm:text-lg">
          <MessageCircleCodeIcon className="w-5 text-white/70" />{' '}
          <ReactMarkdown
            components={{
              p: ({children}) => children,
              code: ({children}) => (
                <code className="!bg-white/5">{children}</code>
              ),
            }}
          >
            {title}
          </ReactMarkdown>
        </p>
      )}
      <div className="relative flex items-center">
        {session?.user ? (
          <>
            {canOpenExerciseInLocalEditor ? (
              <div className="flex items-center">
                <Button
                  asChild
                  disabled={!canOpenExerciseInLocalEditor}
                  className="not-prose rounded-r-none font-semibold"
                >
                  <Link
                    href={`${userPrefs?.editorLaunchProtocol}${userPrefs?.localDirectoryPath}${filePath}`}
                  >
                    Open in Editor
                  </Link>
                </Button>
                <SetLocalDevPrefsDialog
                  resourceId={book._id}
                  resourceTitle={book.title}
                  githubRepositoryName={book.github?.title as string}
                  githubRepositoryUrl={book.github?.repo as string}
                  isDialogOpen={isPrefsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-1 rounded-l-none bg-primary/80 px-2.5">
                      <CogIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </SetLocalDevPrefsDialog>
              </div>
            ) : (
              <SetLocalDevPrefsDialog
                resourceId={book._id}
                resourceTitle={book.title}
                githubRepositoryName={book.github?.title as string}
                githubRepositoryUrl={book.github?.repo as string}
                isDialogOpen={isPrefsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                  >
                    <CogIcon className="h-4 w-4" /> Configure Local Development
                  </Button>
                </DialogTrigger>
              </SetLocalDevPrefsDialog>
            )}
            {book?.github?.repo && (
              <>
                <div className="mx-5 h-5 w-px bg-white/10" />
                <Button
                  variant="secondary"
                  asChild
                  className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                >
                  <a
                    href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                    target="_blank"
                  >
                    <Icon name="Github" /> GitHub
                  </a>
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <p className="text-base">
              <Link href="/login" className="text-primary underline">
                Log in
              </Link>{' '}
              to open in your editor
            </p>
            {book?.github?.repo && (
              <>
                <div className="mx-5 h-5 w-px bg-white/10" />
                <Button
                  variant="secondary"
                  asChild
                  className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                >
                  <a
                    href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                    target="_blank"
                  >
                    <Icon name="Github" /> GitHub
                  </a>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const RightToCSideBar = ({
  toc,
  fontSizeIndex,
  visibleHeadingId,
}: {
  toc: Heading[]
  fontSizeIndex: number
  visibleHeadingId: string | null
}) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = React.useState(false)
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
  }, [])
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
  }, [scrollAreaRef, visibleHeadingId])
  return (
    <aside
      className={cn('relative w-full max-w-[300px] pl-5 pt-20', {
        'hidden xl:block': fontSizeIndex === 2,
        'hidden lg:block': fontSizeIndex !== 2,
      })}
    >
      <div className="sticky top-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-background to-transparent"
        />
        {isScrolled && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 h-20 w-full bg-gradient-to-b from-background to-transparent"
          />
        )}
        <div
          className="h-[calc(100vh-7rem)] overflow-y-auto pb-20 scrollbar-none"
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
      </div>
    </aside>
  )
}
