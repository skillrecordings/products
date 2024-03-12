import * as React from 'react'
import {bookComponents} from '@/app/_components/mdx'
import VideoPlayer from '@/app/_components/video-player'
import {getChapter, getChapterResource} from '@/lib/chapters'
import {getVideoResource} from '@/lib/videos'
import {getServerAuthSession} from '@/server/auth'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {notFound} from 'next/navigation'
import {type Metadata, type ResolvingMetadata} from 'next'
import {getOgImage} from '@/utils/get-og-image'
import {Challenge} from '../../_components/challenge'
import {getBookMode} from './layout'
import {cn} from '@skillrecordings/ui/utils/cn'

type Props = {
  params: {chapter: string; resource: string}
  searchParams: {[key: string]: string | string[] | undefined}
}

export async function generateMetadata(
  {params, searchParams}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resource = await getChapterResource(params.resource)

  if (!resource) {
    return parent as Metadata
  }

  return {
    title: resource.title,
    openGraph: {
      images: [
        getOgImage({
          title: resource.title,
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
  const {mode} = getBookMode()

  return (
    <section>
      {mode === 'book' && (
        <h1 className="mb-10 text-balance text-3xl font-bold sm:mb-14 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
      )}
      <div className="prose prose-light max-w-none sm:prose-lg lg:prose-xl prose-p:font-normal">
        {isAdmin && video && (
          <div
            className={cn('mb-5', {
              'sm:float-left sm:mr-10 sm:w-1/2': mode === 'book',
            })}
          >
            <VideoPlayer
              className="rounded"
              videoResourceLoader={getVideoResource(video.videoResourceId)}
              title={title}
            />
          </div>
        )}
        {mode === 'video' && (
          <div className="not-prose">
            <h1 className="mb-10 text-balance text-3xl font-bold sm:mb-14 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </div>
        )}
        {mdx && <MDX contents={mdx} components={bookComponents} />}
        {isAdmin && chapter.github?.repo && code?.openFile && (
          <Challenge repo={chapter.github?.repo} file={code.openFile} />
        )}
        {solution && (
          <>
            <div className="mt-16 border-t">
              <h2>Solution</h2>
              {/* <Link href={slug.current + '/solution'}>Navigate ➔</Link> */}
            </div>
            {isAdmin && solution.videoResourceId && (
              <div className="sm:float-right sm:ml-10 sm:w-1/2">
                <VideoPlayer
                  title={`Solution: ${title}`}
                  className="rounded"
                  videoResourceLoader={getVideoResource(
                    solution.videoResourceId,
                  )}
                />
              </div>
            )}
            {solution.mdx && (
              <MDX contents={solution.mdx} components={bookComponents} />
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default ChapterResourceRoute
