import React from 'react'
import cx from 'classnames'
import Layout from 'components/app/layout'
import MuxPlayer, {
  MuxPlayerProps,
  MuxPlayerRefAttributes,
} from '@mux/mux-player-react'
import {Tip} from 'lib/tips'

import {useRouter} from 'next/router'
import {
  XIcon,
  ChatAltIcon,
  PlayIcon,
  CheckCircleIcon,
  MailIcon,
} from '@heroicons/react/solid'
import {shuffle, take} from 'lodash'
import {track} from '../utils/analytics'
import Image from 'next/legacy/image'
import {getOgImage} from 'utils/get-og-image'
import {useResourceComplete} from '@skillrecordings/skill-lesson/hooks/use-resource-complete'
import {localProgressDb} from '@skillrecordings/skill-lesson/utils/dexie'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {ArticleJsonLd, VideoJsonLd} from '@skillrecordings/next-seo'
import Icon from 'components/icons'
import {
  useMuxPlayer,
  VideoProvider,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'
import {Talk} from 'lib/talks'
import Link from 'next/link'
import ResourceContributor from 'components/resource-contributor'
import {ConfLogo} from 'components/conf/conference-logo'
import {CheckIcon, ChevronLeftIcon} from '@heroicons/react/outline'
import ReactMarkdown from 'react-markdown'
import {getTranscriptComponents} from '@skillrecordings/skill-lesson/markdown/transcript-components'
import {TalkItem} from 'pages/talks'
import {cn} from '@skillrecordings/ui/utils/cn'
import {Button} from '@skillrecordings/ui/primitives/button'
import Share from 'components/share'
import {ResourceCTA} from 'components/cta/resource-cta'

const TalkTemplate: React.FC<{
  talk: Talk
  talkBodySerialized: MDXRemoteSerializeResult
  talks: Talk[]
  transcript: string
}> = ({talk, talkBodySerialized, talks}) => {
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const {resourceCompleted} = useResourceComplete(talk.slug)
  const {videoResourceId} = useVideoResource()
  const thumbnail = `https://image.mux.com/${talk.muxPlaybackId}/thumbnail.jpg?width=1200&height=675&time=0`

  const ogImage = getOgImage({
    title: talk.title,
    type: 'background-thumbnail',
    muxPlaybackId: talk.muxPlaybackId ?? undefined,
    bgImage: talk.videoPosterUrl ?? thumbnail,
    authorName: talk.presenter?.name ?? undefined,
    authorImage: talk.presenter?.picture?.url ?? undefined,
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: talk.slug,
        module: 'talks',
        location: 'below talk video',
        moduleType: 'talk',
        lessonType: 'talk',
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  const handleVideoEnded = async () => {
    await localProgressDb.progress
      .add({
        eventName: 'completed video',
        module: 'talks',
        lesson: talk.slug,
        createdOn: new Date(),
      })
      .then(console.debug)
  }

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      onEnded={handleVideoEnded}
      exerciseSlug={talk.slug}
      path="/talks"
    >
      {talk.body && (
        <ArticleJsonLd
          url={`${process.env.NEXT_PUBLIC_URL}/talks/${talk.slug}`}
          title={talk.title || 'talk'}
          images={[
            `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`,
          ]}
          datePublished={talk._createdAt || new Date().toISOString()}
          authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
          description={talk.description || 'Epic Web Talk'}
        />
      )}
      <VideoJsonLd
        name={talk.title || 'talk'}
        description={talk.description || 'Epic Web Talk'}
        uploadDate={talk._createdAt || new Date().toISOString()}
        thumbnailUrls={[
          `https://image.mux.com/${talk.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`,
        ]}
        contentUrl={`https://stream.mux.com/${talk.muxPlaybackId}/medium.mp4`}
      />
      <Layout
        meta={{
          title: talk.title,
          ogImage,
          description: talk.description ?? '',
        }}
        navigationClassName="max-w-screen-xl dark:border-transparent border-transparent"
      >
        <main className="mx-auto w-full pt-0" id="talk">
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex w-full max-w-screen-xl flex-col">
              <Video ref={muxPlayerRef} talks={talks} talk={talk} />
              {!subscriber && !loadingSubscriber && (
                <SubscribeForm handleOnSuccess={handleOnSuccess} />
              )}
            </div>
          </div>
          <article className=" relative z-10 border-l border-transparent px-5 pb-16 pt-8 sm:pt-8 xl:border-gray-800 xl:pt-10">
            <div className="mx-auto w-full max-w-screen-md pb-5">
              <div className="flex flex-col items-start">
                <div className="mb-3 flex w-full items-center justify-between text-muted-foreground">
                  <Link
                    href="/talks"
                    passHref
                    className="flex items-center gap-0.5 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <ChevronLeftIcon className="w-3" aria-hidden="true" />
                    Talks
                  </Link>
                  {resourceCompleted ? (
                    <div
                      aria-hidden="true"
                      className="flex items-center gap-0.5"
                    >
                      <CheckIcon className="w-4" />
                      <span className="text-sm">Watched</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex w-full items-center justify-between">
                  <h1 className="inline-flex w-full max-w-2xl items-baseline text-balance text-3xl font-bold lg:text-4xl">
                    {talk.title}
                  </h1>
                  {talk.event && talk.event.slug === 'conf' && (
                    <Link href="/conf">
                      <ConfLogo />
                    </Link>
                  )}
                </div>

                {talk.presenter && (
                  <ResourceContributor
                    className="mt-3 inline-flex text-base [&_img]:w-10 [&_span]:font-normal"
                    name={talk.presenter?.name}
                    slug={talk.presenter?.slug}
                    image={talk.presenter?.picture?.url}
                  />
                )}
                {talk.oneTimeContributor && !talk.presenter && (
                  <ResourceContributor
                    className="mt-3 inline-flex text-base [&_img]:w-10 [&_span]:font-normal"
                    name={talk.oneTimeContributor?.name as string}
                    image={talk.oneTimeContributor?.picProfile as string}
                    disableLink={true}
                  />
                )}

                {talk.body && (
                  <>
                    <div className="prose mt-5 w-full max-w-none pb-5 dark:prose-invert lg:prose-lg">
                      <MDX contents={talkBodySerialized} />
                    </div>
                  </>
                )}
                <Share
                  className="mt-5"
                  title={talk.title}
                  contentType="talk"
                  contributor={talk.presenter}
                />
                <ResourceCTA resourceIdOrSlug={talk._id} className="mt-5" />
                <Transcript talk={talk} />
                <RelatedTalks talks={talks} />
              </div>
            </div>
          </article>
        </main>
      </Layout>
    </VideoProvider>
  )
}

const Transcript: React.FC<{talk: Talk}> = ({talk}) => {
  const {handlePlay, muxPlayerRef} = useMuxPlayer()
  const transcriptMarkdownComponent = getTranscriptComponents({
    handlePlay,
    canShowVideo: true,
    muxPlayerRef,
  })
  const [isExpanded, setIsExpanded] = React.useState(false)

  return talk.transcript ? (
    <div className="mt-14 w-full">
      <h3 className="mb-5 text-2xl font-semibold">Transcript</h3>
      <div
        className={cn(
          'group relative flex flex-col items-center justify-start',
          {
            'h-96 overflow-hidden after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-48 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-[""]':
              !isExpanded,
            'h-auto': isExpanded,
          },
        )}
      >
        <ReactMarkdown
          className={cn(
            'prose w-full max-w-none transition dark:prose-invert',
            {
              'opacity-75 group-hover:opacity-100': !isExpanded,
            },
          )}
          components={transcriptMarkdownComponent}
        >
          {talk.transcript}
        </ReactMarkdown>
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'z-10 shadow-soft-md hover:bg-secondary hover:brightness-90 dark:hover:brightness-110',
            {
              'absolute bottom-16': !isExpanded,
              'mt-5': isExpanded,
            },
          )}
        >
          {isExpanded ? 'Collapse' : 'Expand'} Transcript
        </Button>
      </div>
    </div>
  ) : null
}

const Video: React.FC<{talks: Talk[]; talk: Talk; ref: any}> = React.forwardRef(
  ({talks, talk}, ref: any) => {
    const {muxPlayerProps, displayOverlay} = useMuxPlayer()
    const {videoResource} = useVideoResource()

    return (
      <div className="relative">
        {displayOverlay && <TipOverlay talks={talks} />}
        <div
          className={cx(
            'flex items-center justify-center overflow-hidden shadow-gray-600/40 sm:shadow-2xl xl:rounded-b',
            {
              hidden: displayOverlay,
            },
          )}
        >
          <MuxPlayer
            ref={ref}
            {...(muxPlayerProps as MuxPlayerProps)}
            poster={talk?.videoPosterUrl || undefined}
            playbackId={videoResource?.muxPlaybackId}
          />
        </div>
      </div>
    )
  },
)

const RelatedTalks: React.FC<{talks: Talk[]}> = ({talks}) => {
  if (!talks) return null

  return (
    <section className="mx-auto mt-10 h-full w-full">
      <h3 className="text-2xl font-bold">Related Talks</h3>
      <ul className="flex flex-col pt-4">
        {talks.map((talk, i) => {
          return (
            <TalkItem i={i} key={talk.slug} thumbnailTime={16} talk={talk} />
          )
        })}
      </ul>
    </section>
  )
}

const TipOverlay: React.FC<{talks: Talk[]}> = ({talks}) => {
  const {setDisplayOverlay, handlePlay} = useMuxPlayer()
  const {lesson, module} = useLesson()

  const buttonStyles =
    'py-2 px-3 font-medium rounded-md flex items-center gap-1 hover:bg-gray-700 bg-gray-800 transition text-gray-200'
  return (
    <div
      id="video-overlay"
      className="relative left-0 top-0 flex w-full items-center justify-center bg-gray-950 dark:bg-black/40 lg:aspect-video xl:rounded-md"
    >
      <div className="absolute right-8 top-8 z-50 flex items-center justify-center gap-3">
        <button className={buttonStyles} onClick={handlePlay}>
          Replay <span aria-hidden="true">↺</span>
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          Dismiss <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="ft-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center p-2 text-center text-lg leading-relaxed lg:absolute">
        <div className="grid h-full w-full grid-cols-1 items-center justify-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {take(
            shuffle(
              talks.filter(
                (suggestedTalk) => suggestedTalk.slug !== lesson.slug,
              ),
            ),
            9,
          ).map((talk) => (
            <VideoOverlayTipCard suggestedTip={talk} />
          ))}
        </div>
      </div>
    </div>
  )
}

const VideoOverlayTipCard: React.FC<{suggestedTip: Talk}> = ({
  suggestedTip,
}) => {
  const router = useRouter()
  const {handlePlay} = useMuxPlayer()
  const {resourceCompleted} = useResourceComplete(suggestedTip.slug)

  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    suggestedTip.videoResourceId
  }`

  return (
    <div className="aspect-video">
      <button
        key={suggestedTip.slug}
        onClick={() => {
          track('clicked suggested tip thumbnail', {
            lesson: suggestedTip.slug,
          })

          router
            .push({
              pathname: '/tips/[tip]',
              query: {tip: suggestedTip.slug},
            })
            .then(() => {
              handlePlay()
            })
        }}
        className="group relative z-0 flex aspect-video h-full w-full items-end justify-start overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-8 text-left font-medium leading-tight text-gray-100"
      >
        <div className="relative z-10 flex flex-col">
          <span className="font-heading pb-1 text-xs font-bold uppercase tracking-wide text-gray-400">
            Talk
          </span>
          <span className="font-medium">
            {suggestedTip.title}{' '}
            {resourceCompleted && <span className="sr-only">(watched)</span>}
          </span>
        </div>
        <Image
          src={thumbnail}
          alt=""
          aria-hidden="true"
          layout="fill"
          className="blur-xs z-0 object-cover opacity-50 brightness-50"
          quality={100}
        />
        <div
          className="absolute left-0 top-0 flex h-full w-full items-start justify-end p-5"
          aria-hidden="true"
        >
          {resourceCompleted ? (
            <>
              <CheckCircleIcon
                className="absolute h-10 w-10 text-teal-400 transition group-hover:opacity-0"
                aria-hidden="true"
              />
              <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-teal-400 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
            </>
          ) : (
            <PlayIcon className="h-10 w-10 flex-shrink-0 scale-50 text-gray-300 opacity-0 transition group-hover:scale-100 group-hover:opacity-100" />
          )}
        </div>
      </button>
    </div>
  )
}

const SubscribeForm = ({
  handleOnSuccess,
}: {
  handleOnSuccess: (subscriber: any, email?: string) => void
}) => {
  return (
    <div className="mx-auto mt-2 flex w-full max-w-lg flex-col items-center justify-between gap-5 rounded border bg-card px-3 pb-5 pt-4 md:pb-3 md:pt-3 lg:max-w-none lg:flex-row 2xl:px-3">
      <div className="inline-flex items-center gap-2 text-lg font-semibold leading-tight md:text-base lg:flex-shrink-0 lg:text-lg">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-400/10"
        >
          <MailIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>{' '}
        New Epic Talks delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe to EpicWeb.dev"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

export default TalkTemplate
