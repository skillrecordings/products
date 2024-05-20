import * as React from 'react'
import Layout from '@/components/app/layout'
import {AArrowDown, AArrowUp, ALargeSmall} from 'lucide-react'
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
import {motion, useInView, useScroll, type Variants} from 'framer-motion'
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
      useShikiTwoslash: false,
      // syntaxHighlighterOptions: {
      //   authorization: process.env.SHIKI_AUTH_TOKEN,
      //   endpoint: process.env.SHIKI_ENDPOINT,
      // },
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
  const chapterNavMaxWidth = useChapterNavMaxWidth(articleRef)
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

  return (
    <Layout
      meta={{
        title: chapter.title,
        defaultTitle: book.title,
      }}
      nav={null}
      footer={null}
      className="relative overflow-hidden"
    >
      <ChaptersMenu
        book={book}
        chapter={chapter}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <header className="fixed left-0 top-0 z-20 h-10 w-full border-b border-gray-800 bg-background p-2 px-5 lg:border-none">
        <nav className="flex items-center justify-between">
          <Link
            href={`/books/${book.slug.current}`}
            className="font-heading text-base font-medium transition ease-in-out hover:text-primary"
          >
            {book.title}
          </Link>
          <motion.div
            className="hidden font-heading text-base font-medium sm:block"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: isScrolledPastHero ? 1 : 0,
              y: isScrolledPastHero ? 0 : -10,
            }}
          >
            {chapter.title}
          </motion.div>
          <div className="flex items-center gap-5">
            <div className="flex items-stretch">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <Popover>
                    <TooltipTrigger asChild>
                      <PopoverTrigger className="flex items-stretch justify-center transition ease-in-out hover:text-primary">
                        <svg
                          width="20"
                          height="13"
                          viewBox="0 0 20 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.50722 12L7.51838 9.81157H2.9308L2.02301 12H0.547852L5.50827 0.636414H6.02701L11.1982 12H8.50722ZM3.48196 8.51473H6.91859L5.13543 4.55936L3.48196 8.51473Z"
                            fill="currentColor"
                          />
                          <path
                            d="M16.1188 3.73262C18.2748 3.73262 19.6365 4.85115 19.6365 7.20168V12.0162H18.6315L17.7399 10.0223C17.2049 11.4975 16.0053 12.1621 14.5626 12.1621C12.9902 12.1621 12.0013 11.3354 12.0013 10.1358C12.0013 8.4661 13.7197 7.37999 17.3184 7.15305V6.7802C17.3184 5.6941 16.8969 4.98083 15.6649 4.98083C14.4167 4.98083 13.7197 5.75894 13.7197 7.10441H12.4552C12.4552 4.99705 13.8007 3.73262 16.1188 3.73262ZM15.3893 10.7842C16.5241 10.7842 17.2698 9.79536 17.3184 8.1581C15.5028 8.23915 14.3357 8.70926 14.3357 9.79536C14.3357 10.3789 14.7247 10.7842 15.3893 10.7842Z"
                            fill="currentColor"
                          />
                        </svg>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-2 bg-background text-foreground">
                      Text size settings
                    </TooltipContent>
                    <PopoverContent className="flex items-center gap-2 bg-background text-foreground">
                      <button
                        disabled={fontSizeIndex === 0}
                        type="button"
                        onClick={() => {
                          if (fontSizeIndex !== 0) {
                            setFontSizeIndex(fontSizeIndex - 1)
                          }
                        }}
                      >
                        <AArrowDown className="w-4" />
                      </button>
                      <Slider
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
                        onClick={() => {
                          if (fontSizeIndex < FONT_SIZES.length - 1) {
                            setFontSizeIndex(fontSizeIndex + 1)
                          }
                        }}
                      >
                        <AArrowUp className="w-4" />
                      </button>
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
                    className="flex flex-col p-1 text-primary"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="17"
                      fill="none"
                      viewBox="0 0 22 17"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 1H4a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h17M6 6.5h15m-15 4h15"
                      />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="z-50 bg-background text-foreground">
                  Chapters
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </nav>
      </header>
      <main className="relative z-10">
        {/* OUTLINE */}
        <div
          className="pointer-events-none fixed left-0 top-0 z-20 h-screen w-full p-5 pt-10"
          aria-hidden="true"
        >
          <div className="hidden h-full w-full border border-gray-800 lg:block" />
        </div>
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-background"
        >
          <div className="absolute left-5 top-10 flex h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] flex-col items-center justify-center gap-20 overflow-hidden border-x border-b border-gray-800 p-16 text-center lg:border ">
            <p className="relative z-10 inline-flex items-center gap-3 font-text text-xl font-medium">
              <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '}
              Chapter {chapterIndex + 1}{' '}
              <span className="h-px w-10 bg-gray-800" aria-hidden="true" />
            </p>
            <h1 className="relative z-10 text-balance font-heading text-5xl font-bold italic sm:text-8xl">
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
        {toc && (
          <ChapterSideNav
            className="z-30 hidden lg:flex"
            toc={toc}
            visibleHeadingId={visibleHeadingId}
            chapterNavMaxWidth={chapterNavMaxWidth}
          />
        )}
        <div className="relative z-10 h-full w-full bg-background pb-16">
          <article
            className={cn('mx-auto p-5 pt-16', {
              'max-w-3xl': fontSizeIndex === 1 || fontSizeIndex === 0,
              'max-w-4xl': fontSizeIndex === 2,
            })}
          >
            <div
              ref={articleRef}
              className={cn(
                'prose max-w-none prose-headings:scroll-m-20 prose-headings:text-white prose-h2:mt-[15%] prose-h3:mt-[10%] prose-p:text-justify prose-p:text-foreground prose-code:text-foreground prose-li:text-justify prose-li:text-foreground [&>li>code]:bg-gray-800 [&>p>code]:bg-gray-800 [&_h2>code]:bg-gray-800 [&_h3>code]:bg-gray-800 [&_h4>code]:bg-gray-800',
                {
                  'prose-sm sm:prose-base lg:prose-lg': fontSizeIndex === 0,
                  'prose-base sm:prose-lg lg:prose-xl': fontSizeIndex === 1,
                  'prose-lg sm:prose-xl lg:prose-2xl': fontSizeIndex === 2,
                },
              )}
            >
              <MDX
                contents={chapterBody}
                components={{
                  h2: (props) => {
                    return (
                      <LinkedHeading
                        onAddBookmark={handleAddBookmark}
                        as="h2"
                        {...props}
                      />
                    )
                  },
                  h3: (props) => {
                    return (
                      <LinkedHeading
                        onAddBookmark={handleAddBookmark}
                        as="h3"
                        {...props}
                      />
                    )
                  },
                  h4: (props) => {
                    return <h4 {...props} />
                  },
                }}
              />
            </div>
          </article>
        </div>
      </main>
      <section className="fixed bottom-0 left-0 z-0 grid h-screen w-full grid-cols-1 items-center justify-end gap-10 bg-[#062F2B] p-5 pb-24 pt-11 sm:grid-cols-2 sm:pb-5">
        {prevChapter && (
          <Link
            href={`/books/${book.slug.current}/${prevChapter.slug}`}
            className="flex h-full w-full flex-col justify-end p-5 font-heading text-2xl font-bold transition duration-300 ease-in-out hover:bg-[#173936] sm:text-5xl lg:p-16"
          >
            <span>☜</span>
            <span className="text-balance">{prevChapter.title}</span>
          </Link>
        )}
        {nextChapter && (
          <Link
            href={`/books/${book.slug.current}/${nextChapter.slug}`}
            className="flex h-full w-full flex-col items-end justify-end p-5 text-right font-heading text-2xl font-bold transition duration-300 ease-in-out hover:bg-[#173936] sm:text-5xl lg:p-16"
          >
            <span>☞</span>
            <span className="text-balance">{nextChapter.title}</span>
          </Link>
        )}
      </section>

      <div aria-hidden="true" className="h-screen" />
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
        ['Node.js', 'nodejs'],
        ['react.js', 'reactjs'],
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

const useChapterNavMaxWidth = (articleRef: React.RefObject<HTMLDivElement>) => {
  const [chapterNavMaxWidth, setChapterNavMaxWidth] = React.useState('100%')

  React.useEffect(() => {
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
  }, [articleRef]) // Dependency on articleRef to re-run effect if it changes

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
            <DialogHeader className="w-full border-b border-gray-800 p-5 pb-8 sm:p-10 sm:pb-5">
              <DialogTitle className="flex w-full flex-col">
                <motion.span className="text-2xl font-semibold sm:text-3xl">
                  <Link href={`/books/${book.slug.current}`}>{book.title}</Link>
                </motion.span>
              </DialogTitle>
              <p className="sm:text-lefttext-center font-sans text-lg font-normal opacity-75 sm:pt-16">
                Chapters Index
              </p>
            </DialogHeader>
            <motion.ol className="flex w-full flex-col">
              {book.chapters.map((chapter, i) => {
                const isCurrentChapter = chapter._id === currentChapter._id

                return (
                  <motion.li variants={item} key={chapter._id}>
                    <Link
                      className={cn(
                        'flex items-center gap-5 px-5 py-5 font-text text-xl font-semibold transition duration-300 hover:bg-primary hover:text-background sm:gap-10 sm:px-10 sm:py-16 sm:text-[4vw] sm:italic',
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
              <DialogClose className="fixed right-5 top-0.5 p-2">
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
                    'relative h-px w-5 bg-gray-500 transition group-hover:-translate-x-5',
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
                              'relative h-px w-3 bg-gray-500 transition group-hover:-translate-x-5',
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
      opacity: 0,

      transition: {duration: 0.2},
    },
    show: {
      opacity: 1,

      transition: {staggerChildren: 0.05, type: 'easeInOut'},
    },
  }

  const item: Variants = {
    hidden: {opacity: 0, x: -30},
    show: {
      opacity: 1,
      x: 0,
      transition: {staggerChildren: 0.05, type: 'easeInOut', duration: 0.1},
    },
  }
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'fixed bottom-3 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full  bg-white text-sm font-medium text-background',
          className,
        )}
      >
        <ViewListIcon className="h-5 w-5 " />
      </DialogTrigger>
      <DialogContent
        withCloseButton={false}
        className="left-0 top-0 z-50 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col bg-background p-0 py-5 text-foreground"
      >
        <DialogHeader className="border-b border-gray-800 p-5">
          <DialogTitle>
            <motion.span
              className="relative flex flex-col items-center justify-center gap-2"
              animate={{
                opacity: [0, 1],
              }}
              transition={{
                ease: 'easeInOut',
                duration: 0.5,
              }}
            >
              <p className="relative z-10 inline-flex items-center gap-3 font-text text-sm font-medium">
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '}
                Chapter {currentChapterIndex + 1}{' '}
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />
              </p>
              <strong className="text-balance px-2 font-heading text-3xl font-semibold italic text-white">
                {chapter.title}
              </strong>
            </motion.span>
          </DialogTitle>
        </DialogHeader>
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="overflow-y-auto p-5 py-0 text-lg"
        >
          <motion.strong
            animate={{
              opacity: [0, 1],
            }}
            transition={{
              ease: 'easeInOut',
              duration: 0.5,
              delay: 0.2,
            }}
            className="text-sm font-semibold uppercase opacity-65"
          >
            In this chapter
          </motion.strong>
          <motion.ol className="mt-3 flex flex-col gap-2 [&_*]:duration-300">
            {toc.map((heading, i) => (
              <motion.li variants={item} key={heading.slug}>
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
                {heading.items.length > 0 && (
                  <ol>
                    {heading.items
                      .filter(({level}) => level < 4)
                      .map((subItem) => (
                        <motion.li variants={item} key={subItem.slug}>
                          <DialogClose asChild>
                            <Link className="ml-5" href={`#${subItem.slug}`}>
                              <span
                                className={cn('', {
                                  '': visibleHeadingId === subItem.slug,
                                })}
                              >
                                {subItem.text.replace(/`/g, '')}
                              </span>
                            </Link>
                          </DialogClose>
                        </motion.li>
                      ))}
                  </ol>
                )}
              </motion.li>
            ))}
          </motion.ol>
        </motion.nav>
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
      },
      props.children,
    )

  return (
    <span className="relative">
      <span className="group relative">
        <a
          href={linkToTitle}
          className="absolute left-[-2ch] pr-3 !text-white/50 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-cyan-300"
          aria-hidden="true"
        >
          #
        </a>
        <H />
      </span>
      {onAddBookmark && (
        <button
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300/10 p-2 transition duration-300 group-hover:bg-amber-300/20 hover:bg-amber-300/20 sm:top-1"
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
          {resourceBookmarked ? (
            <BookmarkIconSolid className="h-5 w-5 text-amber-200" />
          ) : (
            <BookmarkIcon className="h-5 w-5 text-amber-200" />
          )}
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
