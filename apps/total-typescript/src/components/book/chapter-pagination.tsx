import type {Book, BookChapter} from '@/lib/book'
import Link from 'next/link'

export const ChapterPagination = ({
  nextChapter,
  prevChapter,
  book,
  chapterIndex,
}: {
  prevChapter: BookChapter | null
  nextChapter: BookChapter | null
  book: Book
  chapterIndex: number
}) => {
  return (
    <>
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
    </>
  )
}
