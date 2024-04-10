import React from 'react'
import {
  getChapterWithResources,
  type ChapterResource,
  getChapterPositions,
} from '@/lib/chapters'
import {ResourceItem} from '../_components/resource-item'
import {MDXRemote} from 'next-mdx-remote/rsc'
import {mdxComponents} from '@/app/_components/mdx'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ChapterToC} from '../_components/chapter-toc'
import {getChapterList} from '@/lib/book'

const ChapterPage: React.FC<{params: {chapter: string}}> = async ({params}) => {
  const chapter = await getChapterWithResources(params.chapter, true)
  const chaptersLoader = getChapterList('total-typescript')
  if (!chapter) {
    return notFound()
  }

  const chapterPositions = await getChapterPositions(chapter.slug.current)

  return (
    <div>
      <div className="bg-white/5 py-48">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col px-3">
          <Link href="/book" className="mb-3 text-lg text-muted-foreground">
            Chapter {Number(chapterPositions.currentChapterIndex)}
          </Link>
          <h1 className="text-5xl font-bold">{chapter?.title}</h1>
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-screen-lg flex-col gap-10 md:flex-row">
        <div className="prose prose-invert mx-auto flex w-full max-w-2xl flex-col sm:prose-lg lg:prose-xl prose-p:font-normal">
          {chapter?.resources &&
            chapter?.resources?.map((resource) => {
              return (
                <ResourceItem
                  body={
                    resource.body ? (
                      <MDXRemote
                        source={resource.body}
                        components={{
                          //   ...mdxComponents,
                          h1: (props) => <h2 {...props} />,
                          h2: (props) => <h3 {...props} />,
                          h3: (props) => <h4 {...props} />,
                        }}
                      />
                    ) : null
                  }
                  solutionBody={
                    resource.solution?.body ? (
                      <MDXRemote
                        source={resource.solution.body}
                        components={{
                          // ...mdxComponents,
                          h1: (props) => <h2 {...props} />,
                          h2: (props) => <h3 {...props} />,
                          h3: (props) => <h4 {...props} />,
                        }}
                      />
                    ) : null
                  }
                  resource={resource}
                  key={resource.slug.current}
                />
              )
            })}
          {chapterPositions.nextChapter && (
            <div className="w-full pb-24 text-right">
              <Link href={`/book/${chapterPositions.nextChapter.slug}`}>
                Next Chapter
              </Link>
            </div>
          )}
        </div>
        <div className="pt-20">
          <ChapterToC chaptersLoader={chaptersLoader} />
        </div>
      </div>
    </div>
  )
}

export default ChapterPage
