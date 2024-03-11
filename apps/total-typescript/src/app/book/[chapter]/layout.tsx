import * as React from 'react'
import {getChapter, type Chapter} from '@/lib/chapters'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'
import {findIndex} from 'lodash'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ChapterResourceList} from '@/app/_components/chapter-resource-list'

export const metadata = {
  name: 'Chapter',
  description: 'Chapter',
}

type Props = {
  params: {chapter: string; resource?: string}
}

const ChapterLayout: React.FC<React.PropsWithChildren<Props>> = async ({
  children,
  params,
}) => {
  const chapter = await getChapter(params.chapter)
  const {nextChapter, currentChapterIndex} = await getChapterPositions(chapter)

  if (!chapter) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl grid-cols-12 flex-col gap-16 px-5 pt-8 sm:px-10 md:grid md:pt-0 xl:px-20">
      <aside className="relative col-span-4">
        <div className="sticky top-16 flex flex-col gap-5 text-lg">
          <div>
            <Link href="/book" className="underline">
              Book
            </Link>{' '}
            <span>/</span> Chapter {currentChapterIndex}:
          </div>
          <h1 className="text-balance text-4xl font-bold !leading-tight">
            {chapter.title}
          </h1>
          <ChapterResourceList chapter={chapter} />
          <div>
            {nextChapter && (
              <div>
                Next:{' '}
                <Link
                  className="font-semibold underline"
                  href={`/book/${nextChapter.slug}`}
                >
                  {nextChapter.title}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
      <article className="col-span-8">{children}</article>
    </div>
  )
}

export default ChapterLayout

async function getChapterPositions(chapter: Chapter | null) {
  if (!chapter) return {}

  const allChapters = await sanityQuery<{
    chapters: {
      _id: string
      slug: string
      title: string
    }[]
  }>(
    groq`*[_type == 'module' && moduleType == 'book'][0]{
    'chapters': resources[]->{
      _id,
      "slug": slug.current,
      title
    }
    
  }`,
    {tags: ['chapters']},
  )

  const chapters = allChapters.chapters

  const currentChapterIndex = findIndex(chapters, {
    _id: chapter._id,
    slug: chapter.slug.current,
    title: chapter.title,
  })

  const nextChapter =
    findIndex(chapters, chapters[currentChapterIndex + 1]) !== -1
      ? chapters[currentChapterIndex + 1]
      : null

  const prevChapter =
    findIndex(chapters, chapters[currentChapterIndex - 1]) !== -1
      ? chapters[currentChapterIndex - 1]
      : null

  return {
    nextChapter,
    currentChapterIndex: currentChapterIndex + 1,
    prevChapter,
  }
}
