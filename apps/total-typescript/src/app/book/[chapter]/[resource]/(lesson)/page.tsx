import * as React from 'react'
import VideoPlayer from '@/app/_components/video-player'
import {getChapter, getChapterResource} from '@/lib/chapters'
import {getVideoResource} from '@/lib/videos'
import {getServerAuthSession} from '@/server/auth'
import {notFound} from 'next/navigation'
import {type Metadata, type ResolvingMetadata} from 'next'
import {getOgImage} from '@/utils/get-og-image'
import {Challenge} from '../../../_components/challenge'
import {getBookMode} from './layout'
import {cn} from '@skillrecordings/ui/utils/cn'
import {MDXRemote} from 'next-mdx-remote/rsc'
import {Skeleton} from '@skillrecordings/ui/primitives/skeleton'
import {mdxComponents} from '@/app/_components/mdx'

type Props = {
  params: {chapter: string; resource: string}
  searchParams: {[key: string]: string | string[] | undefined}
  isSolution?: boolean
}

export async function generateMetadata(
  {params, searchParams}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resource = await getChapterResource(params.resource, false)

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
  isSolution = false,
}) => {
  const chapter = await getChapter(params.chapter)
  const resource = await getChapterResource(params.resource)
  const session = await getServerAuthSession()
  const isAdmin = session?.user.role === 'ADMIN' // TODO: use proper can can check

  if (!resource || !chapter) {
    notFound()
  }

  let {title, body, video, solution, code} = resource

  if (isSolution) {
    title = `Solution: ${title}`
    body = solution?.body
    video = {videoResourceId: solution?.videoResourceId} as any
  }

  const {mode} = getBookMode()

  const BookLayout = () => {
    return (
      <section>
        <h1 className="mb-10 text-balance text-3xl font-bold sm:mb-14 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="prose prose-light max-w-none sm:prose-lg lg:prose-xl prose-p:font-normal">
          <React.Suspense fallback="Loading...">
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
          </React.Suspense>
          <React.Suspense
            fallback={<Skeleton className="h-48 w-full rounded bg-gray-100" />}
          >
            {body && <MDXRemote source={body} components={mdxComponents} />}
          </React.Suspense>
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
              <React.Suspense
                fallback={
                  <Skeleton className="h-48 w-full rounded bg-gray-100" />
                }
              >
                {solution.body && (
                  <MDXRemote
                    source={solution.body}
                    components={mdxComponents}
                  />
                )}
              </React.Suspense>
            </>
          )}
        </div>
      </section>
    )
  }

  const VideoLayout = () => {
    return (
      <section className="w-full">
        <div
          className={cn(
            'relative flex h-full max-h-[calc(100vh-64px)] w-full items-center justify-center bg-black',
          )}
        >
          {isAdmin && video && (
            <div className="aspect-video h-full w-full">
              <VideoPlayer
                videoResourceLoader={getVideoResource(video.videoResourceId)}
                title={title}
              />
            </div>
          )}
        </div>
        <div className="prose prose-light mx-auto w-full max-w-4xl px-5 py-10 sm:prose-lg lg:prose-xl prose-p:font-normal">
          <div className="not-prose">
            <h1 className="mb-5 text-balance text-3xl font-bold sm:mb-10 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </div>
          <React.Suspense
            fallback={<Skeleton className="h-48 w-full rounded bg-gray-100" />}
          >
            {body && <MDXRemote source={body} components={mdxComponents} />}
          </React.Suspense>
          {isAdmin && chapter.github?.repo && code?.openFile && (
            <Challenge repo={chapter.github?.repo} file={code.openFile} />
          )}
        </div>
      </section>
    )
  }

  return mode === 'book' ? <BookLayout /> : <VideoLayout />
}

export default ChapterResourceRoute
