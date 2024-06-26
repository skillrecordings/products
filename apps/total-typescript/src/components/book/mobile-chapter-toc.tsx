import type {Book, BookChapter} from '@/lib/book'
import type {MarkdownHeading} from '@/utils/extract-markdown-headings'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@skillrecordings/ui'
import {DialogClose} from '@skillrecordings/ui/primitives/dialog'
import {cn} from '@skillrecordings/ui/utils/cn'
import {MenuIcon} from 'lucide-react'
import Link from 'next/link'
import {XIcon} from '@heroicons/react/outline'

export const MobileChapterToC: React.FC<{
  toc: MarkdownHeading[]
  book: Book
  chapter: BookChapter
  visibleHeadingId: string | null
  className?: string
}> = ({toc, visibleHeadingId, className, chapter, book}) => {
  const currentChapterIndex = book.chapters.findIndex(
    (c) => c._id === chapter._id,
  )
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'fixed bottom-3 right-3 z-40 flex items-center justify-center gap-1 rounded bg-gray-800 px-3 py-2 text-sm font-medium text-foreground',
          className,
        )}
      >
        <MenuIcon className="h-5 w-5 " /> On this page
      </DialogTrigger>
      <DialogContent
        withCloseButton={false}
        className="left-0 top-0 z-50 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col bg-background p-0 py-5 text-foreground"
      >
        <DialogHeader className="border-b border-gray-800 p-5">
          <DialogTitle>
            <span className="relative flex flex-col items-center justify-center gap-2">
              <p className="relative z-10 inline-flex items-center gap-3 font-text text-sm font-medium">
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '}
                Chapter {currentChapterIndex + 1}{' '}
                <span className="h-px w-10 bg-gray-800" aria-hidden="true" />
              </p>
              <strong className="text-balance px-2 font-heading text-3xl font-semibold italic text-white">
                {chapter.title}
              </strong>
            </span>
          </DialogTitle>
        </DialogHeader>
        <nav className="overflow-y-auto p-5 py-0 text-lg">
          <strong className="text-sm font-semibold uppercase opacity-65">
            In this chapter
          </strong>
          <ol className="mt-3 flex flex-col gap-2 pb-16">
            {toc.map((heading, i) => (
              <li key={heading.slug}>
                <div>
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
                </div>
                {heading.items.length > 0 && (
                  <ol>
                    {heading.items
                      .filter(({level}) => level < 4)
                      .map((subItem) => (
                        <li key={subItem.slug}>
                          <div className="pl-5">
                            <DialogClose asChild>
                              <Link
                                className="leading-tight"
                                href={`#${subItem.slug}`}
                              >
                                {subItem.text.replace(/`/g, '')}
                              </Link>
                            </DialogClose>
                          </div>
                        </li>
                      ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <DialogClose className="fixed bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#001816]">
          <XIcon className="h-5 w-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
