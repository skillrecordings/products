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
import type {Bookmark} from '@/lib/bookmarks'
import Heading from '@/components/heading'
import {Trash, BookText} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {cn} from '@skillrecordings/ui/utils/cn'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {trpc} from '@/trpc/trpc.client'

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
  const {data: lastBookmarkedResource} =
    trpc.bookmarks.lastBookmarkedResource.useQuery({
      type: 'book',
    })
  const resourceIds = book.chapters.flatMap((chapter) => {
    return chapter.resources?.map((resource) => resource._id) ?? []
  })
  const {data: bookmarks, status: bookmarksStatus} =
    trpc.bookmarks.getBookmarksForUser.useQuery({
      resourceIds,
    })

  return (
    <Layout
      meta={{
        title: book.title,
        type: 'book',
        ogImage: {
          url:
            book.ogImage ||
            'https://res.cloudinary.com/total-typescript/image/upload/v1718801512/typescript-essentials_b2myrp.jpg',
        },
      }}
      className="overflow-x-hidden"
    >
      <header
        className={cn(
          'relative mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center md:flex-row md:items-start',
        )}
      >
        <div className="pointer-events-none relative -z-10 mt-[55px] flex w-[800px] max-w-[1100px] select-none sm:mt-[63px] md:-ml-[40%] md:w-full lg:-ml-[30%]">
          <Image
            src={require('../../../../public/assets/headings/typescript-pro-essentials@2x.png')}
            aria-hidden="true"
            alt=""
            className=""
            quality={80}
            priority
          />
        </div>
        <div className="relative -mt-[150px] flex-shrink-0 text-center md:-ml-48 md:-mt-0 md:pt-28 md:text-left lg:pt-36">
          <h1 className=" text-balance font-heading text-5xl font-bold text-white md:text-5xl lg:text-6xl">
            {book.title === 'Total TypeScript Essentials' ? (
              <>
                <div className="text-2xl font-normal text-primary">
                  Total TypeScript
                </div>
                <div>Essentials</div>
              </>
            ) : (
              book.title
            )}
          </h1>
          {book.description && (
            <h2 className="w-full max-w-xs text-balance pt-5 text-base text-[#94A5BB]">
              {book.description}
            </h2>
          )}
          <Button
            size="lg"
            className="bg-gradient-to-tr from-[#4BCCE5] to-[#8AF7F1] font-semibold"
            asChild
          >
            {lastBookmarkedResource ? (
              <Link
                className="mt-10 rounded-sm font-semibold"
                href={`/books/${book.slug.current}/${lastBookmarkedResource?.fields?.chapterSlug}#${lastBookmarkedResource?.fields?.resourceSlug}`}
              >
                Continue Reading <span className="ml-2">→</span>
              </Link>
            ) : (
              <Link
                className="mt-10"
                href={`/books/${book.slug.current}/${book.chapters[0].slug}`}
              >
                Start Reading <span className="ml-2">→</span>
              </Link>
            )}
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-10 w-full max-w-screen-lg border-t border-white/5 px-5 pb-16 sm:pt-5 md:-mt-28 lg:-mt-40 xl:px-0">
        <div className="flex grid-cols-8 flex-col-reverse gap-10 py-8 md:grid">
          <article className="prose col-span-5 max-w-none sm:prose-lg">
            {bookBody ? (
              <MDX contents={bookBody} />
            ) : (
              <p>No description found.</p>
            )}
          </article>
          <aside className="col-span-3 flex flex-col gap-8">
            <ProEssentialsBanner />
            <nav
              aria-label={`Book navigation consisting of ${book.chapters.length} chapters`}
            >
              <strong className="mb-2 inline-flex items-center gap-1 font-semibold text-white">
                <BookText className="h-4 w-4 text-foreground opacity-75" />{' '}
                Chapters
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
              <strong className="mb-2 inline-flex items-center gap-1 font-semibold text-white">
                <BookmarkIcon className="h-4 w-4 text-foreground opacity-75" />{' '}
                Bookmarks
              </strong>
              {bookmarksStatus === 'loading' ? (
                <p>Loading...</p>
              ) : (
                <>
                  {bookmarks && bookmarks.length > 0 ? (
                    <>
                      <ol className="overflow-hidden rounded border border-white/10">
                        {bookmarks.map((bookmark) => {
                          return (
                            <BookmarkItem
                              key={bookmark.id}
                              book={book}
                              bookmark={bookmark}
                            />
                          )
                        })}
                      </ol>
                    </>
                  ) : (
                    <p className="opacity-75">
                      Your bookmarks will appear here. To add a bookmark, click
                      the bookmark icon next to a heading in any chapter.
                    </p>
                  )}
                </>
              )}
            </nav>
          </aside>
        </div>
      </main>
    </Layout>
  )
}

export default BookRoute

const BookmarkItem = ({bookmark, book}: {bookmark: Bookmark; book: Book}) => {
  const {data: resourceBookmarked} = trpc.bookmarks.getBookmark.useQuery({
    id: bookmark.resourceId,
  })
  const deleteBookmarkMutation = trpc.bookmarks.deleteBookmark.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed')
    },
    onError: (error) => {
      toast.error('Error removing bookmark')
    },
  })
  return (
    <li
      key={bookmark.resourceId}
      className="group relative flex w-full items-center"
    >
      <Link
        className="flex w-full flex-col items-baseline bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:text-primary focus:bg-white/10"
        href={`/books/${book.slug.current}/${bookmark.fields?.chapterSlug}#${bookmark.fields?.resourceSlug}`}
      >
        <span>{bookmark?.fields?.resourceTitle}</span>
        <span className="text-sm opacity-75">
          {bookmark?.fields?.chapterTitle}
        </span>
      </Link>
      {resourceBookmarked && (
        <Button
          size="icon"
          type="button"
          variant="destructive"
          className="right-3 h-6 w-6 bg-background text-foreground transition ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100 focus:opacity-100 lg:absolute lg:opacity-0"
          onClick={async () => {
            deleteBookmarkMutation.mutate({id: resourceBookmarked.id})
          }}
        >
          <Trash className="h-3 w-3" />
        </Button>
      )}
    </li>
  )
}

const ProEssentialsBanner = () => {
  return (
    <Link
      onClick={() => {
        track('clicked_pro_essentials_banner', {
          location: 'book_page',
        })
      }}
      href="/workshops/typescript-pro-essentials"
      className="group flex w-full items-center justify-between rounded border border-[#E9BDA6] transition duration-300 ease-in-out hover:bg-[#E9BDA6]/5 md:overflow-hidden lg:overflow-visible"
    >
      <div className="flex h-full flex-shrink-0 flex-col items-start justify-between py-6 pl-6">
        <h3 className="flex flex-col text-left">
          <div className="text-lg leading-tight text-[#E9BDA6]">TypeScript</div>
          <div className="text-2xl font-semibold text-white">
            Pro Essentials
          </div>
        </h3>
        <div className="mt-5 inline-flex items-center justify-center rounded border border-[#E9BDA6] px-8 py-2 text-center text-sm font-semibold text-[#E9BDA6] transition duration-300 ease-in-out group-hover:brightness-125 lg:mt-0">
          <span className="relative transition duration-300 ease-in-out group-hover:-translate-x-2">
            Go Pro
          </span>
          <span className="absolute translate-x-5 opacity-0 transition duration-300 ease-in-out group-hover:translate-x-6 group-hover:opacity-100">
            →
          </span>
        </div>
      </div>
      <Image
        className="-mb-8 sm:max-w-[180px] lg:-mr-6 lg:max-w-full"
        src={
          'https://res.cloudinary.com/total-typescript/image/upload/v1718804538/TypeScript-Pro-Essentials-banner_2x_o37gbv.png'
        }
        width={203}
        height={203}
        alt="TypeScript Pro Essentials"
      />
    </Link>
  )
}
