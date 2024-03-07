import {bookComponents} from '@/app/_components/mdx'
import {getChapter} from '@/lib/chapters'
import {getServerAuthSession} from '@/server/auth'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {notFound} from 'next/navigation'
import type React from 'react'

type Props = {
  params: {chapter: string}
  searchParams: {[key: string]: string | string[] | undefined}
}

const ChapterRoute: React.FC<Props> = async ({params, searchParams}) => {
  const chapter = await getChapter(params.chapter)
  const session = await getServerAuthSession()

  if (!chapter) {
    notFound()
  }

  return (
    <div>
      {chapter.resources.map(({title, mdx, slug}) => {
        return (
          <section
            key={slug.current}
            id={slug.current}
            className="scroll-mt-16"
          >
            <div className="prose prose-lg max-w-none py-10 lg:prose-xl">
              <h2>{title}</h2>
              {mdx && <MDX contents={mdx} components={bookComponents} />}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default ChapterRoute
