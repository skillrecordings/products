import * as React from 'react'
import {bookComponents} from '@/app/_components/mdx'
import VideoPlayer from '@/app/_components/video-player'
import {
  getChapter,
  getChapterResource,
  type ChapterResource,
  type Chapter,
} from '@/lib/chapters'
import {getVideoResource} from '@/lib/videos'
import {getServerAuthSession} from '@/server/auth'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {notFound} from 'next/navigation'
import {type Metadata, type ResolvingMetadata} from 'next'
import {getOgImage} from '@/utils/get-og-image'
import Link from 'next/link'
import {findIndex} from 'lodash'
import {getChapterPositions} from '../layout'

type Props = {
  params: {chapter: string; resource: string}
  searchParams: {[key: string]: string | string[] | undefined}
}

export async function generateMetadata(
  {params, searchParams}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const chapter = await getChapter(params.chapter)

  if (!chapter) {
    return parent as Metadata
  }

  return {
    title: chapter.title,
    openGraph: {
      images: [
        getOgImage({
          title: chapter.title,
        }),
      ],
    },
  }
}

const ChapterResourceRoute: React.FC<Props> = async ({
  params,
  searchParams,
}) => {
  const chapter = await getChapter(params.chapter)
  const resource = await getChapterResource(params.resource)
  const session = await getServerAuthSession()

  const isAdmin = session?.user.role === 'ADMIN' // TODO: use proper can can check

  if (!resource || !chapter) {
    notFound()
  }

  const {title, mdx, video, solution, code, slug} = resource

  const {nextResource} = await getResourcePositions(chapter, resource)
  const {nextChapter} = await getChapterPositions(chapter)

  return (
    <div className="flex flex-col divide-y divide-dashed divide-gray-200">
      <section className="py-8 sm:py-20">
        <div className="prose prose-light max-w-none sm:prose-lg lg:prose-xl prose-p:font-normal">
          <h1>{title}</h1>
          {video && (
            <VideoPlayer
              className="float-left mr-10 w-1/2 rounded-lg"
              videoResourceLoader={
                isAdmin && video.videoResourceId
                  ? getVideoResource(video.videoResourceId)
                  : undefined
              }
              title={title}
            />
          )}
          {mdx && <MDX contents={mdx} components={bookComponents} />}
          {isAdmin &&
            code &&
            // todo: add code widget
            null}
          {solution && (
            <>
              <hr />
              <div className="flex w-full items-center justify-between">
                <h2>Solution</h2>
                <Link href={slug.current + '/solution'}>Navigate ➔</Link>
              </div>
              {solution.videoResourceId && (
                <VideoPlayer
                  className="float-right ml-10 w-1/2 rounded-lg"
                  videoResourceLoader={
                    isAdmin && solution.videoResourceId
                      ? getVideoResource(solution.videoResourceId)
                      : undefined
                  }
                />
              )}
              {solution.mdx && (
                <MDX contents={solution.mdx} components={bookComponents} />
              )}
            </>
          )}
          <div className="flex w-full flex-col items-center justify-center gap-5 py-16">
            {nextResource ? (
              <>
                {/* TODO: Get correct H level in respect to mdx body */}
                <p>Next Up</p>
                <strong className="text-2xl font-bold">
                  {nextResource.title}
                </strong>
                <Link href={nextResource.slug.current}>Continue ➔</Link>
              </>
            ) : nextChapter ? (
              <>
                <p>Next Up</p>
                <strong className="text-2xl font-bold">
                  {nextChapter.title}
                </strong>
                {/* TODO: Get first resource of next chapter and use it here */}
                <Link href={`/book/${nextChapter.slug}`}>Continue ➔</Link>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ChapterResourceRoute

async function getResourcePositions(
  chapter: Chapter | null,
  currentResource: ChapterResource,
) {
  if (!chapter || !currentResource) return {}

  const currentResourceIndex = findIndex(chapter.resources, currentResource)
  console.log({currentResourceIndex})
  const nextResource =
    findIndex(
      chapter.resources,
      chapter.resources[currentResourceIndex + 1],
    ) !== -1
      ? chapter.resources[currentResourceIndex + 1]
      : null

  const prevResource =
    findIndex(
      chapter.resources,
      chapter.resources[currentResourceIndex - 1],
    ) !== -1
      ? chapter.resources[currentResourceIndex - 1]
      : null

  return {
    currentResourceIndex: currentResourceIndex + 1,
    nextResource,
    prevResource,
  }
}
