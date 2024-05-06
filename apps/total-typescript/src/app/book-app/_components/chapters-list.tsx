'use client'

import * as React from 'react'
import {getBook} from '@/lib/book'
import {MenubarItem} from '@skillrecordings/ui/primitives/menubar'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'
import {findIndex} from 'lodash'
import type {Book, ChapterList} from '../_schema/book-schemas'

export const ChaptersList: React.FC<{
  bookLoader: Promise<Book | null>
  currentChapterSlug?: string
}> = ({bookLoader, currentChapterSlug}) => {
  const book = React.use(bookLoader)
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
