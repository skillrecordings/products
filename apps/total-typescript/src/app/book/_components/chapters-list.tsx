import * as React from 'react'
import {getBook} from '@/lib/book'
import {MenubarItem} from '@skillrecordings/ui/primitives/menubar'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'
import {findIndex} from 'lodash'

export const ChaptersList: React.FC<{currentChapterSlug: string}> = async ({
  currentChapterSlug,
}) => {
  const book = await getBook('total-typescript')
  const currentChapterIndex = findIndex(book?.chapters, (chapter) => {
    return chapter.slug.current === currentChapterSlug
  })

  return book?.chapters ? (
    <>
      {book.chapters.map((chapter, i) => {
        const isActive = i === currentChapterIndex

        return (
          <MenubarItem asChild key={chapter.slug.current}>
            <Link
              href={`/book/${chapter.slug.current}/${chapter.firstResource.slug.current}`}
              className={cn('', {
                underline: isActive,
              })}
            >
              {i + 1}. {chapter.title}
            </Link>
          </MenubarItem>
        )
      })}
    </>
  ) : null
}
