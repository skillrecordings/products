import {getChapter, type Chapter} from '@/lib/chapters'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'
import {findIndex} from 'lodash'
import Link from 'next/link'
import {notFound} from 'next/navigation'

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

  if (!chapter) {
    notFound()
  }

  return (
    <div className="grid grid-cols-12 px-5 py-20">
      <aside className="relative col-span-4">
        <div className="sticky top-20 flex flex-col gap-5">
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <ul>
            {chapter.resources.map(({title, slug}) => {
              return (
                <li key={slug.current}>
                  <Link href={`#${slug.current}`}>{title}</Link>
                </li>
              )
            })}
          </ul>
          <ChapterNavigation chapter={chapter} />
        </div>
      </aside>
      <article className="col-span-8">{children}</article>
    </div>
  )
}

export default ChapterLayout

const ChapterNavigation: React.FC<{chapter: Chapter}> = async ({chapter}) => {
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

  return (
    <div>
      {nextChapter && (
        <div>
          Next: <Link href={nextChapter.slug}>{nextChapter.title}</Link>
        </div>
      )}
    </div>
  )
}
