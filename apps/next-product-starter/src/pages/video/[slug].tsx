import * as React from 'react'
import cx from 'classnames'
import {track} from '@skillrecordings/analytics'
import Link from 'next/link'
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
  selectTextTracks,
  selectIsPaused,
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
]

const PlayerPage = ({resource}: any) => {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const [currentResource, setCurrentResource] = React.useState<any>(resource)
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  const viewer = useSelector(videoService, selectViewer)
  const textTracks = useSelector(videoService, selectTextTracks)
  const metadataTracks = useSelector(videoService, selectMetadataTracks)

  React.useEffect(() => {
    setCurrentResource(resource)
    videoService.send({type: 'LOAD_RESOURCE', resource: currentResource})
    const {autoplay} = getPlayerPrefs()
    if (autoplay) {
      videoService.send({type: 'PLAY'})
    }
  }, [resource])

  React.useEffect(() => {
    if (fullscreenWrapperRef) {
      setMounted(true)
    }
  }, [fullscreenWrapperRef, textTracks])

  return (
    <>
      <div
        className="relative w-full space-y-6 lg:grid lg:grid-cols-12 lg:space-y-0"
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
            >
              <HLSSource src={currentResource?.media_urls?.hls_url} />

              {currentResource.subtitles_url && (
                <track
                  src={currentResource?.subtitles_url}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              )}
              {metadataTracks && (
                <track
                  id="notes"
                  src={`/api/lessons/notes/${currentResource.slug}?staff_notes_url=${currentResource.staff_notes_url}&contact_id=${viewer.contact_id}`}
                  kind="metadata"
                  label="notes"
                />
              )}
            </Player>
          )}
        </div>
        {withSidePanel && (
          <div className="col-span-3 h-screen flex flex-col">
            <SidePanel
              videoResourcesList={
                <VideoResourcesList
                  resources={sidePanelResources}
                  currentResource={currentResource}
                  setCurrentResource={setCurrentResource}
                />
              }
              videoCuesList={<VideoCuesList />}
            />
            <AutoPlayToggle />
          </div>
        )}
      </div>
    </>
  )
}

type VideoResourcesListProps = {
  resources: VideoResource[]
  currentResource: any
  setCurrentResource: (video: VideoResource) => void
}

const VideoResourcesList: React.FC<VideoResourcesListProps> = ({
  resources,
  currentResource,
}) => {
  const videoService = useVideo()
  const isPaused = useSelector(videoService, selectIsPaused)
  return (
    <ul>
      {resources.map((videoResource: VideoResource, i: number) => {
        const isActive = videoResource.slug === currentResource.slug
        return (
          <li
            key={videoResource.url}
            className="border-b border-black border-opacity-60"
          >
            <Link passHref href={`/video/${videoResource.slug}`}>
              <a
                onClick={() => {
                  // in order for autoplay to work properly the video
                  // needs to be stopped before changing the resource
                  !isPaused && videoService.send({type: 'PAUSE'})
                }}
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

const Page = ({data, nextLesson}: any) => {
  const router = useRouter()
  return (
    <div>
      <VideoProvider
        services={{
          addCueNote,
          deleteCueNote,
          loadViewer:
            (context: VideoStateContext, _event: VideoEvent) => async () => {
              context.viewer = VIEWER[1] as any
            },
        }}
        actions={{
          onVideoEnded: (context: any, _event: any) => {
            const {autoplay} = getPlayerPrefs()
            const hasNextLesson = !isEmpty(nextLesson)
            if (autoplay && hasNextLesson) {
              router.push(`/video/${nextLesson.slug}`).then(() => {
                context.videoRef?.current.play()
              })
            }
          },
        }}
      >
        <PlayerPage resource={data} nextResource={nextLesson} />
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

  return {props: {data, nextLesson: nextLessonData}}
}

export async function getLesson(slug: string): Promise<any> {
  const lesson = await fetch(`https://app.egghead.io/api/v1/lessons/${slug}`)
  return lesson
}

export default Page
