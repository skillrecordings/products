import * as React from 'react'
import Layout from '@/components/app/layout'
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
import {motion, useScroll, type Variants} from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
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

  const chapterBody =
    chapter.body &&
    (await serializeMDX(chapter.body, {
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

  const handleAddBookmark = async (id?: string) => {
    await localBookDb.bookmarks
      .add({
        eventName: 'bookmark',
        module: book.title,
        section: chapter.title,
        resource: id,
        createdOn: new Date(),
      })
      .then(() => {
        toast.success('Bookmark added')
      })
  }

  return (
    <Layout
      meta={{
        title: chapter.title,
      }}
      nav={null}
      footer={null}
      className="relative overflow-hidden bg-[#001816] selection:bg-[#ADF2F2]"
    >
      <ChaptersMenu
        book={book}
        chapter={chapter}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <header className="fixed left-0 top-0 z-20 h-10 w-full border-b border-[#0f2927] bg-[#001816] p-2 px-5 lg:border-none ">
        <nav className="flex items-center justify-between">
          <div className="font-heading text-base font-medium text-[#AFF2F2]">
            {book.title}
          </div>
          <div className="flex items-center gap-5">
            <div className="relative h-3 w-16 border border-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full w-full origin-left bg-[#AFF2F2]"
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
                    className="flex flex-col p-1"
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
                        stroke="#AFF2F2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 1H4a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h17M6 6.5h15m-15 4h15"
                      />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="z-50 rounded-sm bg-[#AFF2F2] text-[#001816]">
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
          <div className="hidden h-full w-full border border-[#062F2B] lg:block" />
        </div>
        <section className="relative z-30 flex min-h-screen w-full flex-col items-center justify-center bg-[#001816]">
          <div className="absolute left-5 top-10 flex h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] flex-col items-center justify-center gap-20 overflow-hidden bg-[#AFF2F2] p-16 text-center text-[#103838]">
            <p className="relative z-10 inline-flex items-center gap-3 font-text text-xl font-medium">
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />{' '}
              Chapter {chapterIndex + 1}{' '}
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />
            </p>
            <h1 className="relative z-10 text-balance font-heading text-5xl font-bold italic sm:text-8xl">
              {chapter.title}
            </h1>
            <p className="relative z-10 max-w-md text-balance text-center font-text text-base sm:text-xl">
              {chapter.description
                ? chapter.description
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus viverra porta. Nulla accumsan ornare laoreet.'}
            </p>
            <div className="absolute z-0 font-heading text-[80vh] font-bold opacity-10">
              {chapterIndex + 1}
            </div>
          </div>
        </section>
        <div className="relative z-10 h-full w-full bg-[#001816] pb-16">
          {toc && (
            <ChapterSideNav
              className="z-10 hidden lg:flex"
              toc={toc}
              visibleHeadingId={visibleHeadingId}
              chapterNavMaxWidth={chapterNavMaxWidth}
            />
          )}
          <article className="mx-auto max-w-3xl p-5">
            <div
              ref={articleRef}
              className="prose max-w-none sm:prose-lg lg:prose-xl prose-headings:scroll-m-20 prose-headings:text-[#ECFFFF] prose-h2:mt-[15%] prose-h3:mt-[10%] prose-p:text-justify prose-p:text-[#D9FFFF] prose-code:bg-[#112E2C] prose-code:text-[#D9FFFF] prose-pre:p-0 prose-li:text-justify prose-li:text-[#D9FFFF] [&_.code-container]:p-5"
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
            className="fixed left-0 top-0 flex h-screen w-full flex-col items-center justify-start overflow-y-auto bg-[#ADF2F2] py-5 text-[#103838] scrollbar-none sm:py-16"
          >
            <DialogHeader className="w-full border-b border-[#96dbdb] p-5 pb-8 sm:p-10 sm:pb-5">
              <DialogTitle className="flex w-full flex-col">
                <motion.span className="font-heading text-3xl font-extrabold sm:text-[6vw]">
                  {book.title}
                </motion.span>
              </DialogTitle>
              <p className="sm:text-lefttext-center font-sans text-lg font-semibold opacity-75 sm:pt-16">
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
                        'flex items-center gap-5 px-5 py-5 font-text text-xl font-semibold transition duration-300 hover:bg-[#96dbdb] sm:gap-10 sm:px-10 sm:py-16 sm:text-[4vw] sm:italic',
                        {
                          'bg-[#103838] text-[#ADF2F2] hover:bg-[#103838] hover:text-[#ADF2F2] hover:brightness-110':
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
        'fixed left-0 top-0 flex h-screen flex-col items-center justify-center mix-blend-difference',
        className,
      )}
    >
      <nav className="group py-16 pr-5 scrollbar-none hover:overflow-y-auto">
        <strong className="relative inline-flex translate-x-0 text-lg opacity-0 transition group-hover:translate-x-7 group-hover:opacity-100">
          In this chapter
        </strong>
        <ol className="mt-3 flex flex-col text-white [&_*]:duration-300">
          {toc.map((item, i) => (
            <li key={item.slug}>
              <Link
                className="inline-flex min-h-3 items-center gap-2 leading-tight transition hover:text-foreground"
                href={`#${item.slug}`}
              >
                <div
                  className={cn(
                    'relative h-px w-5 bg-white opacity-50 transition group-hover:-translate-x-5',
                    {
                      'bg-[#ADF2F2] opacity-100':
                        visibleHeadingId === item.slug,
                    },
                  )}
                />
                <span
                  className={cn(
                    'relative -translate-x-10 truncate text-nowrap opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 hover:text-[#ADF2F2]',
                    {
                      'text-[#ADF2F2] group-hover:opacity-100':
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
                              'relative h-px w-3 bg-white opacity-50 transition group-hover:-translate-x-5',
                              {
                                'bg-[#ADF2F2] opacity-100':
                                  visibleHeadingId === subItem.slug,
                              },
                            )}
                          />
                          <span
                            className={cn(
                              'relative ml-6  -translate-x-10 truncate text-nowrap opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 hover:text-[#ADF2F2]',
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
          'fixed bottom-3 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full  bg-white text-sm font-medium text-[#001816]',
          className,
        )}
      >
        <ViewListIcon className="h-5 w-5 " />
      </DialogTrigger>
      <DialogContent
        withCloseButton={false}
        className="left-0 top-0 z-50 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col bg-[#001816] p-0 py-5 text-[#D9FFFF]"
      >
        <DialogHeader className="p-5">
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
                <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />{' '}
                Chapter {currentChapterIndex + 1}{' '}
                <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />
              </p>
              <strong className="text-balance px-2 font-heading text-3xl font-semibold italic">
                {chapter.title}
              </strong>
            </motion.span>
          </DialogTitle>
        </DialogHeader>
        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="overflow-y-auto p-5 py-8 text-lg"
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
            className="font-text text-sm font-semibold opacity-65"
          >
            In this chapter
          </motion.strong>
          <motion.ol className="mt-3 flex flex-col gap-2 [&_*]:duration-300">
            {toc.map((heading, i) => (
              <motion.li variants={item} key={heading.slug}>
                <DialogClose asChild>
                  <Link href={`#${heading.slug}`} className="font-semibold">
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
  onAddBookmark?: (id?: string) => Promise<void>
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
              await onAddBookmark(props.id)
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
