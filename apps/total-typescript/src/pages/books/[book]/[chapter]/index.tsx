import * as React from 'react'
import type {GetStaticPaths, GetStaticProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getBook, getBookChapter, type Book, type BookChapter} from '@/lib/book'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import BookChapterTemplate from '@/templates/book-chapter-template'
import {
  extractMarkdownHeadings,
  type MarkdownHeading,
} from '@/utils/extract-markdown-headings'
import groq from 'groq'

export type BookChapterProps = {
  chapter: BookChapter
  book: Book
  nextChapter: BookChapter | null
  prevChapter: BookChapter | null
  chapterBody: MDXRemoteSerializeResult
  toc: MarkdownHeading[]
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const book = await getBook(params?.book as string)
  const chapter = await getBookChapter(params?.chapter as string)

  if (!chapter || !book || !chapter.resources) {
    return {
      notFound: true,
    }
  }

  const chapterResources = chapter.resources
  // concat chapterResource bodies into a single string
  const body = chapterResources
    .map((r) =>
      r.title === `Intro to ${chapter.title}`
        ? r.body
        : `## ${r.title}\n\n${r.body}`,
    )
    .join('\n\n')
  const chapterWithBody = {...chapter, body}
  const chapters = book && book.chapters
  const currentChapterIndex =
    chapters?.findIndex((c) => c._id === chapter._id) || 0
  const nextChapter = chapters?.[currentChapterIndex + 1] || null
  const prevChapter = chapters?.[currentChapterIndex - 1] || null
  const toc =
    chapterWithBody.body &&
    extractMarkdownHeadings(chapterWithBody.body, chapter.title)
  const bodyWithParsedComments =
    chapterWithBody.body &&
    chapterWithBody.body.replaceAll('<!--', '`{/*').replaceAll('-->', '*/}`')

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

const BookChapterRoute: React.FC<BookChapterProps> = (props) => {
  return <BookChapterTemplate {...props} />
}

export default BookChapterRoute
