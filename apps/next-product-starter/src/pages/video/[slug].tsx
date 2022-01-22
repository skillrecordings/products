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
} from '@skillrecordings/player'
import {useSelector} from '@xstate/react'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'
import {
  VideoEvent,
  VideoStateContext,
} from '@skillrecordings/player/dist/machines/video-machine'
import addCueNote from 'lib/add-cue-note'
import {useRouter} from 'next/router'
import {indexOf, find} from 'lodash'
import LessonFinishedOverlay from 'components/video-overlays/lesson-finished'

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
    title: 'Query Data From Supabase Using Next.js',
    slug: 'supabase-query-data-from-supabase-using-next-js',
  },
  {
    title: 'Understand and Use Interpolation in JSX',
    slug: 'react-understand-and-use-interpolation-in-jsx',
  },
]

const PlayerPage = ({resource}: any) => {
  const router = useRouter()
  const [mounted, setMounted] = React.useState<boolean>(false)

  const [currentResource, setCurrentResource] = React.useState<any>(resource)

  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)
  const viewer = useSelector(videoService, selectViewer)

  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setCurrentResource(resource)
    videoService.send({type: 'LOAD_RESOURCE', resource: currentResource})
    // reset overlay if we change a lesson
    videoService.send({type: 'SET_OVERLAY', overlay: null})
  }, [router])

  React.useEffect(() => {
    if (fullscreenWrapperRef) {
      setMounted(true)
    }
  }, [fullscreenWrapperRef])

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
              {/* TODO: check if has notes */}
              <track
                id="notes"
                src={`/api/lessons/notes/${currentResource.slug}?staff_notes_url=${currentResource.staff_notes_url}&contact_id=${viewer.contact_id}`}
                kind="metadata"
                label="notes"
              />
            </Player>
          )}
        </div>
        {withSidePanel && (
          <div className="col-span-3">
            <SidePanel
              videoResourcesList={
                <VideoResourcesList
                  resources={sidePanelResources}
                  currentResource={currentResource}
                />
              }
              videoCuesList={<VideoCuesList />}
            />
          </div>
        )}
      </div>
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
      {resources.map((videoResource: VideoResource) => {
        const isActive = videoResource.slug === currentResource.slug
        return (
          <li key={videoResource.url} className="border-b border-gray-800">
            <Link href={videoResource.slug}>
              <a>
                <div
                  className={`p-3 cursor-pointer leading-tight text-sm font-semibold  bg-transparent ${
                    isActive
                      ? 'bg-black bg-opacity-30'
                      : 'hover:bg-white hover:bg-opacity-5'
                  }`}
                >
                  {videoResource.title}
                </div>
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
    videoService.send('PAUSE')
    track('opened cue', {cue: cue.text})
  }

  React.useEffect(() => {
    if (isActive && cueRef.current) {
      cueRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [isActive, cueRef])

  return (
    <li
      ref={cueRef}
      key={note.text}
      className={`cueplayer-react-side-panel-comment ${classNames({
        'cueplayer-react-side-panel-comment-active': isActive,
        'cueplayer-react-side-panel-comment-inactive': !isActive,
      })}`}
      onClick={() => clickOpen(cue)}
    >
      <img
        src={note.image || viewer.avatar_url}
        alt=""
        className="cueplayer-react-side-panel-comment-image"
      />
      <div className="cueplayer-react-side-panel-comment-body">
        {/* <span className="">{cue.startTime}</span> */}
        <ReactMarkdown className="prose dark:prose-dark prose-sm">
          {note.text}
        </ReactMarkdown>
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
      {cues.map((cue: VTTCue) => {
        let note: {text: string; type?: string}
        const isActive = activeCues.includes(cue)
        try {
          note = JSON.parse(cue.text)
        } catch (e) {
          note = {text: cue.text}
        }
        return (
          <VideoCue key={note.text} cue={cue} isActive={isActive} note={note} />
        )
      })}
    </ul>
  )
}

const Page = ({data, nextLesson}: any) => {
  const router = useRouter()
  return (
    <main className="">
      <VideoProvider
        services={{
          addCueNote,
          loadViewer:
            (context: VideoStateContext, _event: VideoEvent) => async () => {
              context.viewer = VIEWER[0] as any
            },
        }}
        actions={{
          onVideoEnded: (context: VideoStateContext, event: VideoEvent) => {
            // if autoplay is on and we have nextLesson, navigate to next lesson
            if (nextLesson && context.autoplay) {
              router.push(`/video/${nextLesson.slug}`)
            }
            // if not, show default overlay
            else
              context.overlay = (
                <LessonFinishedOverlay nextResource={nextLesson} />
              )
          },
        }}
      >
        <PlayerPage resource={data} />
      </VideoProvider>
    </main>
  )
}

export async function getServerSideProps(context: any) {
  const res = await getLesson(context.params.slug)
  const data = await res.json()

  const nextLessonIndex: any =
    indexOf(sidePanelResources, find(sidePanelResources, {slug: data.slug})) + 1
  const nextLessonRes = await getLesson(
    sidePanelResources[nextLessonIndex]?.slug,
  )

  const nextLessonData = await nextLessonRes.json()
  if (!data) {
    return {
      notFound: true,
    }
  }

  return {props: {data, nextLesson: nextLessonData}}
}

export async function getLesson(slug: string): Promise<any> {
  const lesson = await fetch(`https://app.egghead.io/api/v1/lessons/${slug}`)
  return lesson
}

export default Page
