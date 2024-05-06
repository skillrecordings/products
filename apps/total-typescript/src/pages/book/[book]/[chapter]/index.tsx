import * as React from 'react'
import Layout from '@/components/app/layout'
import {renderToString} from 'react-dom/server'
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
  toc: {
    level: number
    text: string
    slug: string
  }[]
}> = ({chapter, nextChapter, prevChapter, chapterBody, book, toc}) => {
  return (
    <Layout
      meta={{
        title: chapter.title,
      }}
      className="py-16"
    >
      <main>
        <header className="flex w-full flex-col items-center justify-center py-24 pt-32">
          <Link
            className="mb-5 inline-flex text-center text-lg text-primary"
            href={`/book/${book.slug.current}`}
          >
            {book.title}
          </Link>
          <h1 className="flex text-center font-heading text-6xl font-bold">
            {chapter.title}
          </h1>
        </header>
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-8 gap-10 py-16">
          <article className="col-span-6 mx-auto max-w-4xl scroll-m-8">
            <div className="prose max-w-none sm:prose-lg lg:prose-xl prose-headings:scroll-m-20 prose-pre:p-0 [&_.code-container]:p-5">
              <MDX
                contents={chapterBody}
                components={{
                  ...bookMdxComponents,
                }}
              />
            </div>
          </article>
          {toc && (
            <aside className="col-span-2">
              <strong className="text-lg">In this chapter</strong>
              <ol className="mt-3 flex flex-col text-gray-200">
                {toc.map((item, i) => (
                  <li key={item.slug}>
                    <Link
                      className="inline-flex items-baseline gap-2 py-2 leading-tight transition hover:text-foreground"
                      href={`#${item.slug}`}
                    >
                      <span
                        className="w-4 text-sm opacity-60"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span>{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          )}
        </div>
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

const extractHeadingsFromMarkdown = (markdown: string) => {
  const headingRegex = /(^#{1,6}) (.+)/gm
  let match
  const headings = []

  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim()

    const slug = slugify(text, {
      decamelize: false,
      customReplacements: [
        ['Node.js', 'nodejs'],
        ['react.js', 'reactjs'],
      ],
    })
    const level = match[1].length
    headings.push({level, text, slug})
  }

  return headings
}
