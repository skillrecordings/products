import * as React from 'react'
import '@/styles/shiki-twoslash.css'
import Layout from '@/components/app/layout'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {cn} from '@skillrecordings/ui/utils/cn'
import toast from 'react-hot-toast'
import type {BookChapterProps} from '../pages/books/[book]/[chapter]'
import {flattenMarkdownHeadings} from '@/utils/extract-markdown-headings'
import {ExerciseEmbed} from '@/components/book/book-exercise-embed'
import {
  SecondaryChapterToC,
  useChapterToCMaxWidth,
} from '@/components/book/secondary-chapter-toc'
import {PrimaryChapterToC} from '@/components/book/primary-chapter-toc'
import {BookmarkableMarkdownHeading} from '@/components/book/bookmarkable-markdown-heading'
import {useVisibleMarkdownHeading} from '@/components/book/use-visible-markdown-heading'
import {
  ChapterHeaderNav,
  type SidebarPlacementOptions,
} from '@/components/book/chapter-header-nav'
import {ChapterHero, useIsScrolledPast} from '@/components/book/chapter-hero'
import {ChapterPagination} from '@/components/book/chapter-pagination'
import {MobileChapterToC} from '@/components/book/mobile-chapter-toc'
import {trpc} from '@/trpc/trpc.client'
import slugify from '@sindresorhus/slugify'

const BookChapterTemplate = ({
  chapter,
  nextChapter,
  prevChapter,
  chapterBody,
  book,
  toc,
}: BookChapterProps) => {
  const chapterIndex = book.chapters.findIndex((c) => c._id === chapter._id)
  const headings = flattenMarkdownHeadings(toc)
  const resources = chapter.resources

  const visibleHeadingId = useVisibleMarkdownHeading(headings, {
    rootMargin: '0% 0% -80% 0%',
    threshold: 0.5,
  })

  const addBookmarkMutation = trpc.bookmarks.addBookmark.useMutation({
    onSuccess: (data) => {
      toast.success('Bookmark added')
    },
    onError: (error) => {
      if (error?.data?.httpStatus === 401) {
        toast.error('Please log in to save bookmarks')
      } else {
        toast.error('Error adding bookmark')
      }
    },
  })

  const articleRef = React.useRef<HTMLDivElement>(null)

  const handleAddBookmark = async ({
    resourceId,
    resourceTitle,
    resourceSlug,
  }: {
    resourceId: string
    resourceTitle: string
    resourceSlug: string
  }) => {
    addBookmarkMutation.mutate({
      type: 'book',
      resourceId,
      fields: {
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title,
        resourceTitle,
        resourceSlug,
      },
    })
  }

  const heroRef = React.useRef<HTMLDivElement>(null)
  const isScrolledPastHero = useIsScrolledPast({ref: heroRef})

  const [fontSizeIndex, setFontSizeIndex] = React.useState(1)
  const [sidebarPlacement, setSidebarPlacement] =
    React.useState<SidebarPlacementOptions>('right')

  const chapterToCMaxWidth = useChapterToCMaxWidth(articleRef, sidebarPlacement)

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
      <ChapterHeaderNav
        book={book}
        chapter={chapter}
        isScrolledPastHero={isScrolledPastHero}
        fontSizeIndex={fontSizeIndex}
        setFontSizeIndex={setFontSizeIndex}
        sidebarPlacement={sidebarPlacement}
        setSidebarPlacement={setSidebarPlacement}
      />
      <main className="relative z-10">
        {/* BORDER OUTLINE */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-20 h-screen w-full p-5 pt-10"
        >
          <div className="hidden h-full w-full border border-gray-800 lg:block" />
        </div>
        <ChapterHero
          chapter={chapter}
          chapterIndex={chapterIndex}
          ref={heroRef}
        />
        {toc && sidebarPlacement === 'left' && (
          <SecondaryChapterToC
            className="z-30 hidden lg:flex"
            toc={toc}
            visibleHeadingId={visibleHeadingId}
            maxWidth={chapterToCMaxWidth}
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
                    resourceId,
                    ...rest
                  }: {
                    filePath: string
                    title?: string
                    resourceId?: string
                  }) => {
                    return (
                      <ExerciseEmbed
                        filePath={filePath}
                        title={title}
                        book={book}
                        resourceId={resourceId}
                        {...rest}
                      />
                    )
                  },
                  h2: (props: any) => {
                    const resourceId = resources?.find(
                      (r) => r.slug === props.id,
                    )?._id
                    return (
                      <BookmarkableMarkdownHeading
                        onAddBookmark={handleAddBookmark}
                        appendValueForRepeatedIds={`-for-${slugify(
                          chapter.title,
                        )}`}
                        as="h2"
                        resourceId={resourceId}
                        {...props}
                      />
                    )
                  },
                  h3: (props: any) => {
                    return (
                      <BookmarkableMarkdownHeading
                        appendValueForRepeatedIds={`-for-${slugify(
                          chapter.title,
                        )}`}
                        as="h3"
                        {...props}
                      />
                    )
                  },
                  h4: (props: any) => {
                    return (
                      <BookmarkableMarkdownHeading
                        appendValueForRepeatedIds={`-for-${slugify(
                          chapter.title,
                        )}`}
                        as="h4"
                        {...props}
                      />
                    )
                  },
                }}
              />
            </div>
          </article>
          {toc && sidebarPlacement === 'right' && (
            <PrimaryChapterToC
              toc={toc}
              fontSizeIndex={fontSizeIndex}
              visibleHeadingId={visibleHeadingId}
            />
          )}
        </div>
      </main>
      <ChapterPagination
        nextChapter={nextChapter}
        prevChapter={prevChapter}
        book={book}
        chapterIndex={chapterIndex}
      />
      {toc && (
        <MobileChapterToC
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

export default BookChapterTemplate
