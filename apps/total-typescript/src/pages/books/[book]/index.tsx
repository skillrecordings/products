import * as React from 'react'
import Layout from '@/components/app/layout'
import {BookmarkIcon} from '@heroicons/react/outline'
import {getBook, type Book} from '@/lib/book'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {Button} from '@skillrecordings/ui'
import groq from 'groq'
import type {GetStaticPaths, GetStaticProps} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import Link from 'next/link'
import {
  useBookProgress,
  useBookmark,
  useBookmarks,
  type BookmarkEvent,
} from '@/hooks/use-bookmark'
import Heading from '@/components/heading'
import {Trash, BookText} from 'lucide-react'
import {localBookDb} from '@/utils/dexie'
import toast from 'react-hot-toast'

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
  const {lastBookmarkedResource} = useBookProgress(book.slug.current)
  const {bookmarks, refetch: refetchBookmarks} = useBookmarks(book.slug.current)

  return (
    <Layout
      meta={{
        title: book.title,
        type: 'book',
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1716213713/typescript-essentials-book-og_2x_nu5tqz.png',
        },
      }}
    >
      <Heading title={book.title}>
        <Button asChild>
          {lastBookmarkedResource ? (
            <Link
              className="mt-10 rounded-sm font-semibold"
              href={`/books/${book.slug.current}/${lastBookmarkedResource.section.slug}#${lastBookmarkedResource.resource.id}`}
            >
              Continue Reading
            </Link>
          ) : (
            <Link
              className="mt-10"
              href={`/books/${book.slug.current}/${book.chapters[0].slug}`}
            >
              Start Reading
            </Link>
          )}
        </Button>
      </Heading>
      <main className="mx-auto w-full max-w-screen-lg px-5 pb-16 xl:px-0">
        <div className="flex grid-cols-8 flex-col-reverse gap-10 py-8 md:grid">
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
              <strong className="mb-2 inline-flex items-center gap-1 font-semibold">
                <BookText className="h-4 w-4 opacity-75" /> Chapters
              </strong>
              <ol className="overflow-hidden rounded border border-white/10">
                {book.chapters.map((chapter, i) => {
                  return (
                    <li key={chapter._id}>
                      <Link
                        className="flex items-baseline gap-3 bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:text-primary focus:bg-white/10"
                        href={`/books/${book.slug.current}/${chapter.slug}`}
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
            <nav aria-label="Your bookmarks">
              <strong className="mb-2 inline-flex items-center gap-1 font-semibold">
                <BookmarkIcon className="h-4 w-4 opacity-75" /> Bookmarks
              </strong>
              {bookmarks && bookmarks.length > 0 ? (
                <>
                  <ol className="overflow-hidden rounded border border-white/10">
                    {bookmarks.map((bookmark) => {
                      return (
                        <BookmarkItem
                          key={bookmark.id}
                          book={book}
                          bookmark={bookmark}
                          refetch={refetchBookmarks}
                        />
                      )
                    })}
                  </ol>
                </>
              ) : (
                <p className="opacity-75">
                  Your bookmarks will appear here. To add a bookmark, click the
                  bookmark icon next to a heading in any chapter.
                </p>
              )}
            </nav>
          </aside>
        </div>
      </main>
    </Layout>
  )
}

export default BookRoute

const BookmarkItem = ({
  bookmark,
  book,
  refetch,
}: {
  bookmark: BookmarkEvent
  book: Book
  refetch: () => void
}) => {
  const {resourceBookmarked} = useBookmark(bookmark.resource.id as string)

  return (
    <li
      key={bookmark.resource.id}
      className="group relative flex w-full items-center"
    >
      <Link
        className="flex w-full flex-col items-baseline bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:text-primary focus:bg-white/10"
        href={`/books/${book.slug.current}/${bookmark.section.slug}#${bookmark.resource.id}`}
      >
        <span>{bookmark.resource.children}</span>
        <span className="text-sm opacity-75">{bookmark.section.title}</span>
      </Link>
      {resourceBookmarked && (
        <Button
          size="icon"
          type="button"
          variant="destructive"
          className="absolute right-3 h-6 w-6 bg-background text-foreground opacity-0 transition ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100 focus:opacity-100"
          onClick={async () => {
            await localBookDb.bookmarks
              .delete(resourceBookmarked.id as number)
              .then(() => {
                toast.success('Bookmark removed')
                refetch()
              })
          }}
        >
          <Trash className="h-3 w-3" />
        </Button>
      )}
    </li>
  )
}
