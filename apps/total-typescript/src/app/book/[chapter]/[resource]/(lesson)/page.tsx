import * as React from 'react'
import VideoPlayer from '@/app/_components/video-player'
import {
  getChapter,
  getChapterResource,
  type Chapter,
  type ChapterResource,
} from '@/lib/chapters'
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
import {Suspense} from 'react'
import Link from 'next/link'

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
  isSolution = false,
}) => {
  const chapter = await getChapter(params.chapter)
  const resource = await getChapterResource(params.resource)

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

  return mode === 'book' ? (
    <BookLayout
      title={title}
      chapter={chapter}
      mode={mode}
      video={video}
      body={body}
      solution={solution}
    />
  ) : (
    <VideoLayout title={title} chapter={chapter} video={video} body={body} />
  )
}

const BookLayout = async ({
  title,
  video,
  mode,
  body,
  chapter,
  code,
  solution,
}: {
  title: string
  mode: string
  video?: {videoResourceId: string} | null
  body?: string | null
  chapter: {github?: {repo?: string | null} | null | undefined}
  code?: {openFile: string}
  solution?: {videoResourceId: string; body?: string | null} | null
}) => {
  return (
    <section>
      <h1 className="mb-10 text-balance font-text text-4xl font-bold sm:mb-14 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <div className="prose prose-invert max-w-none sm:prose-lg lg:prose-xl prose-p:font-normal">
        {video && (
          <div
            className={cn('mb-5', {
              // 'sm:float-left sm:mr-10 sm:w-1/2': mode === 'book',
            })}
          >
            <AuthedVideoPlayer
              className="rounded"
              videoResourceId={video?.videoResourceId}
              title={title}
            />
          </div>
        )}

        {body && <MDXRemote source={body} components={mdxComponents} />}
        <AuthedChallenge repo={chapter.github?.repo} file={code?.openFile} />

        {solution && (
          <>
            <div className="mt-16 border-t">
              <h2>Solution</h2>
              {/* <Link href={slug.current + '/solution'}>Navigate ➔</Link> */}
            </div>
            {solution.videoResourceId && (
              <div
                className="mb-5"
                // className="sm:float-right sm:ml-10 sm:w-1/2"
              >
                <AuthedVideoPlayer
                  videoResourceId={solution?.videoResourceId}
                  title={`Solution: ${title}`}
                  className="rounded"
                />
              </div>
            )}
            {solution.body && (
              <MDXRemote source={solution.body} components={mdxComponents} />
            )}
          </>
        )}
      </div>
    </section>
  )
}

const VideoLayout = async ({
  title,
  video,
  body,
  chapter,
  code,
}: {
  title: string
  video?: {videoResourceId: string} | null
  body?: string | null
  chapter: {github?: {repo?: string | null} | null | undefined}
  code?: {openFile: string}
}) => {
  return (
    <section className="w-full">
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-center bg-black',
        )}
      >
        {video && (
          <AuthedVideoPlayer
            videoResourceId={video?.videoResourceId}
            title={title}
          />
        )}
      </div>
      <div className="prose prose-invert mx-auto w-full max-w-4xl px-5 py-10 sm:prose-lg lg:prose-xl prose-p:font-normal">
        <div className="not-prose">
          <h1 className="mb-5 text-balance text-3xl font-bold sm:mb-10 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </div>
        {body && <MDXRemote source={body} components={mdxComponents} />}
        <AuthedChallenge repo={chapter.github?.repo} file={code?.openFile} />
      </div>
    </section>
  )
}

const AuthedChallenge = async ({
  repo,
  file,
}: {
  repo?: string | null | undefined
  file: string | null | undefined
}) => {
  const session = await getServerAuthSession()
  const adminRoles = ['ADMIN' || 'SUPERADMIN']
  const isAdmin = adminRoles.includes(session?.user.role || 'user') // TODO: use proper can can check

  const canViewChallenge = isAdmin && repo && file

  return (
    <>
      {canViewChallenge ? (
        <Suspense>
          <Challenge repo={repo} file={file} />
        </Suspense>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded bg-white/5 p-5">
          <Link href="/newsletter">Join the Newsletter</Link>
        </div>
      )}
    </>
  )
}

const AuthedVideoPlayer = async ({
  videoResourceId,
  title,
  className,
}: {
  videoResourceId?: string
  title: string
  className?: string
}) => {
  const session = await getServerAuthSession()
  const adminRoles = ['ADMIN' || 'SUPERADMIN']
  const isAdmin = adminRoles.includes(session?.user.role || 'user') // TODO: use proper can can check

  if (!isAdmin)
    return (
      <div className="flex h-full w-full items-center justify-center rounded bg-white/5 p-5">
        <Link href="/newsletter">Join the Newsletter</Link>
      </div>
    )

  return (
    <Suspense fallback={<Skeleton className="aspect-video h-full w-full" />}>
      <VideoPlayer
        videoResourceLoader={getVideoResource(videoResourceId)}
        title={title}
        className={className}
      />
    </Suspense>
  )
}

export default ChapterResourceRoute
