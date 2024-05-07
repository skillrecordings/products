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
  const tocMaxWidth = useToCMaxWidth(articleRef)

  return (
    <Layout
      meta={{
        title: chapter.title,
      }}
      nav={null}
      footer={null}
      className="overflow-hidden bg-[#001816] selection:bg-[#ADF2F2]"
    >
      <div className="fixed left-0 top-0 h-screen w-full p-5 pt-10">
        <div
          className="h-full w-full border border-[#062F2B]"
          aria-hidden="true"
        />
      </div>
      {isMenuOpen && (
        <nav className="fixed left-0 top-0 z-20 flex h-screen w-full flex-col items-center justify-center bg-[#ADF2F2] text-[#103838]">
          <ol className="grid grid-cols-2 gap-x-10 gap-y-5">
            {book.chapters.map((chapter, i) => (
              <li key={chapter._id}>
                <Link
                  className="inline-flex items-baseline gap-3 font-heading text-4xl font-semibold italic"
                  href={`/book/${book.slug.current}/${chapter.slug}`}
                  onClick={() => {
                    setIsMenuOpen(false)
                  }}
                >
                  <span className="text-xl">{i + 1}</span>
                  <span>{chapter.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <header
        className="fixed left-0 top-0 z-20 h-10 w-full p-2 px-5 mix-blend-difference"
        // bg-[#001816]
      >
        <nav className="flex items-center justify-between">
          <div className="font-heading text-base text-[#AFF2F2]">
            {book.title}
          </div>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Book chapters"
            className="flex flex-col gap-1 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="h-px w-5 bg-[#AFF2F2]" />
            <div className="h-px w-5 bg-[#AFF2F2]" />
          </button>
        </nav>
      </header>
      <main className="relative z-10">
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center p-5">
          {/* <Link
            className="inline-flex text-center text-lg text-primary"
            href={`/book/${book.slug.current}`}
          >
            {book.title}
          </Link> */}
          <div className="absolute left-5 top-10 flex h-[calc(100%-4rem)] w-[calc(100%-2.5rem)] flex-col items-center justify-center gap-20 overflow-hidden bg-[#AFF2F2] p-16 text-center text-[#103838]">
            <p className="relative z-10 inline-flex items-center gap-3 font-text text-xl font-medium">
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />{' '}
              Chapter {chapterIndex + 1}{' '}
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />
            </p>
            <h1 className="relative z-10 text-balance font-heading text-5xl font-bold italic sm:text-8xl">
              {chapter.title}
            </h1>
            <p className="relative z-10 max-w-md text-balance text-center font-text text-xl">
              {chapter.description
                ? chapter.description
                : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus viverra porta. Nulla accumsan ornare laoreet.'}
            </p>
            <div className="absolute z-0 font-heading text-[80vh] font-bold opacity-10">
              {chapterIndex + 1}
            </div>
          </div>
          {/* cool book effect */}
          {/* <>
          <div className="relative z-10 flex aspect-[1/1.42] h-full w-full max-w-[637px] items-center justify-center overflow-hidden bg-[#AFF2F2] text-[#103838]">
            <p className="absolute top-14 inline-flex items-center gap-3 font-text">
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />{' '}
              Chapter {chapterIndex + 1}{' '}
              <span className="h-px w-10 bg-[#103838]" aria-hidden="true" />
            </p>
            <h1 className="absolute flex text-nowrap text-center font-heading text-[10vw] font-bold italic">
              {chapter.title}
            </h1>
            {chapter.description && (
              <p className="absolute bottom-24 max-w-sm text-balance text-center font-text">
                {chapter.description}
              </p>
            )}
          </div>
          <h1 className="absolute z-0 flex text-nowrap text-center font-heading text-[10vw] font-bold italic text-[#ADF2F2]">
            {chapter.title}
          </h1>
          </> */}
        </section>
        <article className="mx-auto max-w-3xl p-5">
          <div
            ref={articleRef}
            className="prose max-w-none sm:prose-lg lg:prose-xl prose-headings:scroll-m-20 prose-headings:text-[#ECFFFF] prose-h2:mt-[15%] prose-h3:mt-[10%] prose-p:text-[#D9FFFF] prose-code:bg-[#112E2C] prose-code:text-[#D9FFFF] prose-pre:p-0 prose-li:text-[#D9FFFF] lg:prose-p:text-justify [&_.code-container]:p-5"
          >
            <MDX
              contents={chapterBody}
              components={{
                ...bookMdxComponents,
              }}
            />
          </div>
        </article>
        {toc && (
          <aside className="absolute left-0 top-0 z-20 flex h-screen flex-col items-center justify-center mix-blend-difference">
            <nav className="group fixed left-0 max-h-screen py-16 pr-5 scrollbar-thin hover:overflow-y-auto">
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
                          'relative  -translate-x-10 truncate text-nowrap opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 hover:text-[#ADF2F2]',
                          {
                            'text-[#ADF2F2] group-hover:opacity-100':
                              visibleHeadingId === item.slug,
                          },
                        )}
                        style={{
                          maxWidth: tocMaxWidth,
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
                                    maxWidth: tocMaxWidth,
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
        )}

        <div className="flex items-center gap-10">
          {prevChapter && (
            <div className="w-full py-16 text-center">
              <Link href={`/book/${book.slug.current}/${prevChapter.slug}`}>
                Previous chapter: {prevChapter.title}
              </Link>
            </div>
          )}
          {nextChapter && (
            <div className="w-full py-16 text-center">
              <Link href={`/book/${book.slug.current}/${nextChapter.slug}`}>
                Next chapter: {nextChapter.title}
              </Link>
            </div>
          )}
        </div>
      </main>
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-3 right-3 z-50 bg-black">
          <span className="sm:hidden">base</span>
          <span className="hidden sm:block md:hidden">sm</span>
          <span className="hidden md:block lg:hidden">md</span>
          <span className="hidden lg:block xl:hidden">lg</span>
          <span className="hidden xl:block 2xl:hidden">xl</span>
          <span className="3xl:hidden hidden 2xl:block">2xl</span>
          <span className="3xl:block 4xl:hidden hidden">3xl</span>
        </div>
      )}
    </Layout>
  )
}

export default BookChapterRoute

const bookMdxComponents = {
  h2: (props) => {
    return <h2 {...props} />
  },
  h3: (props) => {
    return <h3 {...props} />
  },
  h4: (props) => {
    return <h4 {...props} />
  },
} as MDXComponents

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

const useToCMaxWidth = (articleRef: React.RefObject<HTMLDivElement>) => {
  const [tocMaxWidth, setTocMaxWidth] = React.useState('100%')

  React.useEffect(() => {
    const handleResize = () => {
      const articleSpaceFromLeft =
        articleRef.current?.getBoundingClientRect().left
      setTocMaxWidth(
        articleSpaceFromLeft ? `${articleSpaceFromLeft - 50}px` : '100%',
      )
    }

    // Call handleResize right away so that tocMaxWidth gets set initially
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [articleRef]) // Dependency on articleRef to re-run effect if it changes

  return tocMaxWidth
}
