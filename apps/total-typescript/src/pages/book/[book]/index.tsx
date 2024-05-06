// import type {Book} from '@/app/book/_schema/book-schemas'
import * as React from 'react'
import {WebPageJsonLdProps} from '@skillrecordings/next-seo'
import Layout from '@/components/app/layout'
import {getBook, type Book} from '@/lib/book'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {Button} from '@skillrecordings/ui'
import groq from 'groq'
import type {GetStaticPaths, GetStaticProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const book = await getBook(params?.book as string)

  if (!book) {
    return {
      notFound: true,
    }
  }
  const bookBody = book.body ? await serializeMDX(book.body, {}) : null

  return {
    props: {
      book,
      bookBody,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const books =
    await sanityClient.fetch(groq`*[_type == "module" && moduleType == 'book'] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        moduleType,
        "slug": slug.current,
        title,
  }`)

  const paths = books.map((book: {slug: string}) => ({
    params: {book: book.slug},
  }))

  return {paths, fallback: 'blocking'}
}

const BookRoute: React.FC<{
  book: Book
  bookBody: MDXRemoteSerializeResult | null
}> = ({book, bookBody}) => {
  return (
    <Layout
      meta={{
        title: book.title,
        type: 'book',
      }}
      className="py-24"
    >
      <main className="mx-auto w-full max-w-screen-lg">
        <header className="flex flex-col items-center justify-center gap-5 py-16">
          <h1 className="font-heading text-5xl font-bold">{book.title}</h1>
          <Button asChild>
            <Link href={`/book/${book.slug.current}/${book.chapters[0].slug}`}>
              Start Reading
            </Link>
          </Button>
        </header>
        <div className="grid grid-cols-8 gap-10 py-8">
          <article className="prose col-span-5 max-w-none sm:prose-lg">
            {bookBody ? (
              <MDX contents={bookBody} />
            ) : (
              <p>No description found.</p>
            )}
          </article>
          <aside className="col-span-3 flex flex-col gap-8">
            <nav
              aria-label={`Book navigation consisting of ${book.chapters.length} chapters`}
            >
              <strong className="mb-2">Chapters</strong>
              <ol>
                {book.chapters.map((chapter, i) => {
                  return (
                    <li key={chapter._id}>
                      <Link
                        className="inline-flex items-baseline gap-3 py-1"
                        href={`/book/${book.slug.current}/${chapter.slug}`}
                      >
                        <span
                          className="w-3 text-sm opacity-60"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <span>{chapter.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
            <nav aria-label="Your bookmarks from the book">
              <strong>Bookmarks</strong>
              <p>Your bookmarks will appear here.</p>
            </nav>
          </aside>
        </div>
      </main>
    </Layout>
  )
}

export default BookRoute
