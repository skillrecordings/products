import * as React from 'react'
import {bookComponents} from '@/app/_components/mdx'
import VideoPlayer from '@/app/_components/video-player'
import {getChapter, getChapterResource} from '@/lib/chapters'
import {getVideoResource} from '@/lib/videos'
import {getServerAuthSession} from '@/server/auth'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {notFound} from 'next/navigation'
import {StackblitzIframe} from '@/app/book/_components/stackblitz-iframe'
import {type Metadata, type ResolvingMetadata} from 'next'
import {getOgImage} from '@/utils/get-og-image'
import Link from 'next/link'

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
  //   const chapter = await getChapter(params.chapter)
  const resource = await getChapterResource(params.resource)
  const session = await getServerAuthSession()
  const isAdmin = session?.user.role === 'ADMIN'

  if (!resource) {
    notFound()
  }

  const {title, mdx, video, solution, code} = resource

  if (!solution) {
    notFound()
  }

  return (
    <div className="flex flex-col divide-y divide-dashed divide-gray-200">
      <section className="py-8 sm:py-20">
        <div className="prose prose-light max-w-none sm:prose-lg lg:prose-xl prose-p:font-normal">
          <h1>Solution: {title}</h1>
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
          {isAdmin &&
            code &&
            // todo: add code widget
            null}
        </div>
      </section>
    </div>
  )
}

export default ChapterResourceRoute
