import * as React from 'react'
import cx from 'classnames'
import {track} from '@skillrecordings/analytics'
import Link from 'next/link'
import queryString from 'query-string'
import {
  Player,
  VideoProvider,
  HLSSource,
  useMetadataCues,
  useVideo,
  selectActiveCues,
  selectWithSidePanel,
  selectViewer,
  SidePanel,
  getPlayerPrefs,
  selectMetadataTracks,
  selectResource,
  selectIsWaiting,
  selectIsFullscreen,
} from '@skillrecordings/player'
import {useSelector} from '@xstate/react'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import addCueNote from 'lib/add-cue-note'
import deleteCueNote from 'lib/delete-cue-note'
import {useRouter} from 'next/router'
import {find, indexOf, isEmpty} from 'lodash'
import {AutoPlayToggle} from '../../components/player/autoplay-toggle'
import Tippy from '@tippyjs/react'

type VideoResource = {
  title: string
  url: string
  slug: string
  subtitlesUrl?: string
  staff_notes_url?: string
  notesUrl?: string
}

export const VIEWER = [
  {
    contact_id: 'vojta-testing',
    avatar_url:
      'https://d2eip9sf3oo6c2.cloudfront.net/users/avatars/000/173/301/medium/m2.png',
  },
  {
    contact_id: 'lauro-testing',
    avatar_url: 'https://avatars.githubusercontent.com/u/57044804?v=4',
  },
  {
    contact_id: 'joel-testing',
    avatar_url: 'https://avatars.githubusercontent.com/u/86834?v=4',
  },
]

const sidePanelResources: any = [
  {
    title: 'Create a New Supabase Project',
    slug: `supabase-create-a-new-supabase-project`,
  },
  {
    title: 'Understand and Use Interpolation in JSX',
    slug: 'react-understand-and-use-interpolation-in-jsx',
  },
  {
    title: 'A Beginners Guide to React Introduction',
    slug: 'react-a-beginners-guide-to-react-introduction',
  },
  {
    title: 'Use the React Effect Hook in Function Components',
    slug: 'react-use-the-react-effect-hook-in-function-components',
  },
]

const PlayerPage = ({resource}: any) => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  const viewer = useSelector(videoService, selectViewer)
  const metadataTracks = useSelector(videoService, selectMetadataTracks)
  const isWaiting = useSelector(videoService, selectIsWaiting)
  const {lesson: currentResource}: any = useSelector(
    videoService,
    selectResource,
  )
  const isFullscreen = useSelector(videoService, selectIsFullscreen)

  const {autoplay} = getPlayerPrefs()

  React.useEffect(() => {
    videoService.send({type: 'LOAD_RESOURCE', resource: resource})
    videoService.send('ACTIVITY')
  }, [resource.slug])

  React.useEffect(() => {
    // Autoplay
    if (autoplay && !isWaiting) {
      videoService.send({type: 'PLAY'})
    }
  }, [isWaiting])

  React.useEffect(() => {
    if (fullscreenWrapperRef) {
      setMounted(true)
    }
  }, [fullscreenWrapperRef])

  return (
    <>
      <nav className="h-10 bg-black w-full"></nav>
      <div
        className={cx('w-full space-y-6 lg:grid lg:grid-cols-12 lg:space-y-0', {
          'absolute top-0': isFullscreen,
          relative: !isFullscreen,
        })}
        ref={fullscreenWrapperRef}
      >
        <div
          className={cx(
            'relative before:float-left after:clear-both after:table',
            withSidePanel ? 'col-span-9' : 'col-span-12',
          )}
        >
          {mounted && (
            <Player
              className="font-sans"
              container={fullscreenWrapperRef.current || undefined}
              controls={<div />}
              overlay={<div />}
              canAddNotes={isEmpty(viewer) ? false : !isFullscreen}
            >
              {currentResource?.media_urls.hls_url && (
                <HLSSource src={currentResource.media_urls.hls_url} />
              )}
              {currentResource?.subtitles_url &&
                currentResource?.media_urls.hls_url && (
                  <track
                    key={currentResource.subtitles_url}
                    src={currentResource.subtitles_url}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                )}
              {metadataTracks && currentResource && (
                <track
                  key={currentResource?.slug}
                  id="notes"
                  src={queryString.stringifyUrl({
                    url: `/api/lessons/notes/${currentResource?.slug}`,
                    query: {
                      staff_notes_url:
                        currentResource?.staff_notes_url || undefined,
                      contact_id: viewer?.contact_id,
                    },
                  })}
                  kind="metadata"
                  label="notes"
                />
              )}
            </Player>
          )}
        </div>
        {withSidePanel && (
          <div className="col-span-3 h-[calc(100vh-40px)] flex flex-col">
            <SidePanel
              videoResourcesList={
                <VideoResourcesList
                  resources={sidePanelResources}
                  currentResource={currentResource}
                />
              }
              videoCuesList={<VideoCuesList />}
            />
            <AutoPlayToggle />
          </div>
        )}
      </div>
      <div className="h-screen bg-black" />
    </>
  )
}

type VideoResourcesListProps = {
  resources: VideoResource[]
  currentResource: any
}

const VideoResourcesList: React.FC<VideoResourcesListProps> = ({
  resources,
  currentResource,
}) => {
  return (
    <ul>
      {resources.map((videoResource: VideoResource, i: number) => {
        const isActive = videoResource.slug === currentResource?.slug
        return (
          <li
            key={videoResource.slug}
            className="border-b border-black border-opacity-60"
          >
            <Link passHref href={`/video/${videoResource.slug}`}>
              <a
                className={`pl-2 pr-3 py-4 w-full flex items-baseline gap-2 cursor-pointer leading-tight text-sm font-semibold bg-transparent ${
                  isActive
                    ? 'bg-black bg-opacity-50'
                    : 'hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <span
                  className={cx('text-xs font-normal', {
                    'opacity-60': isActive,
                    'opacity-40': !isActive,
                  })}
                >
                  {i + 1}
                </span>{' '}
                {videoResource.title}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const VideoCue: React.FC<any> = ({cue, note, isActive}) => {
  const cueRef = React.useRef<any>(null)
  const videoService = useVideo()
  const viewer = useSelector(videoService, selectViewer)

  const clickOpen = (cue: any) => {
    videoService.send({
      type: 'SEEKING',
      seekingTime: Number(cue.startTime),
      source: 'cue',
    })
    videoService.send('END_SEEKING')

    track('opened cue', {cue: cue.text})
  }

  React.useEffect(() => {
    if (isActive && cueRef.current) {
      cueRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [isActive, cueRef])

  return (
    <li ref={cueRef} key={note.text}>
      <div
        className={`cueplayer-react-side-panel-comment ${classNames({
          'cueplayer-react-side-panel-comment-active': isActive,
          'cueplayer-react-side-panel-comment-inactive': !isActive,
        })}`}
      >
        <div onClick={() => clickOpen(cue)}>
          <div className="cueplayer-react-side-panel-comment-header">
            <img
              src={note.image || viewer.avatar_url}
              alt=""
              className="cueplayer-react-side-panel-comment-image"
            />
          </div>
          <div className="cueplayer-react-side-panel-comment-body">
            <ReactMarkdown className="prose dark:prose-dark prose-sm">
              {note.text}
            </ReactMarkdown>
          </div>
        </div>
        <div className="cueplayer-react-side-panel-comment-actions">
          {note.id && (
            <>
              <Tippy
                placement="bottom"
                inertia={true}
                offset={[0, -2]}
                delay={0}
                duration={10}
                content={
                  <div className="bg-black rounded-md px-2 py-1 text-sm">
                    delete note
                  </div>
                }
              >
                <button
                  className="cueplayer-react-control cueplayer-react-button cueplayer-react-icon cueplayer-react-side-panel-comment-action delete"
                  onClick={() => {
                    videoService.send({type: 'ACTIVATE_CUE', cue: cue})
                    videoService.send({
                      type: 'DELETE_CUE',
                      cue: cue,
                    })
                  }}
                />
              </Tippy>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

const VideoCuesList: React.FC<any> = () => {
  const cues = useMetadataCues()
  const videoService = useVideo()

  const activeCues = useSelector(videoService, selectActiveCues)

  return (
    <ul>
      {cues.map((cue: VTTCue, i: number) => {
        let note: {text: string; type?: string}
        const isActive = activeCues.includes(cue)
        try {
          note = JSON.parse(cue.text)
        } catch (e) {
          note = {text: cue.text}
        }
        return (
          <VideoCue
            key={note.text + i}
            cue={cue}
            isActive={isActive}
            note={note}
          />
        )
      })}
    </ul>
  )
}

const Page = ({initialLesson, nextLesson}: any) => {
  const router = useRouter()
  return (
    <div>
      <VideoProvider
        services={{
          loadResource:
            (_context: VideoStateContext, _event: VideoEvent) => async () => {
              console.debug('loading video with auth')
              const res = await getLesson(initialLesson.slug)
              const loadedLesson = await res.json()
              console.debug('authed video loaded', {video: loadedLesson})

              return {
                // ...initialLesson,
                ...loadedLesson,
              }
            },
          loadViewer:
            (_context: VideoStateContext, _event: VideoEvent) => async () => {
              return VIEWER[0]
            },
          addCueNote,
          deleteCueNote,
        }}
        actions={{
          onVideoEnded: (_context: VideoStateContext, _event: VideoEvent) => {
            const {autoplay} = getPlayerPrefs()
            const hasNextLesson = !isEmpty(nextLesson)
            if (autoplay && hasNextLesson) {
              console.debug('autoplaying next lesson', {nextLesson})
              router.push(`/video/${nextLesson.slug}`)
            }
          },
        }}
      >
        <PlayerPage resource={initialLesson} nextResource={nextLesson} />
      </VideoProvider>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const res = await getLesson(context.params.slug)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  // next resource
  const nextLessonIndex =
    indexOf(sidePanelResources, find(sidePanelResources, {slug: data.slug})) + 1
  const nextLesson = sidePanelResources[nextLessonIndex]
  const nextLessonRes = await getLesson(nextLesson?.slug)
  const nextLessonData = nextLesson ? await nextLessonRes.json() : {}

  return {props: {initialLesson: data, nextLesson: nextLessonData}}
}

export async function getLesson(slug: string): Promise<any> {
  const lesson = await fetch(`https://app.egghead.io/api/v1/lessons/${slug}`)
  return lesson
}

export default Page
