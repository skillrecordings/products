import * as React from 'react'
import cx from 'classnames'
import {track} from '@skillrecordings/analytics'
import Layout from '@skillrecordings/react/dist/layouts'
import {
  Player,
  VideoProvider,
  HLSSource,
  useMetadataCues,
  useVideo,
  selectActiveCues,
  selectWithSidePanel,
  SidePanel,
} from '@skillrecordings/player'
import {useSelector} from '@xstate/react'

type VideoResource = {
  title: string
  url: string
  subtitlesUrl?: string
  notesUrl?: string
}

const PlayerPage = () => {
  const videos: VideoResource[] = [
    {
      title: 'Understand and Use Interpolation in JSX',
      url: 'https://d2c5owlt6rorc3.cloudfront.net/egghead-v2-08-understand-and-use-interpolation-in-jsx-HkkplFIHU/hls/egghead-v2-08-understand-and-use-interpolation-in-jsx-HkkplFIHU.m3u8',
      subtitlesUrl:
        'https://app.egghead.io/api/v1/lessons/react-understand-and-use-interpolation-in-jsx/subtitles',
      notesUrl:
        'https://gist.githubusercontent.com/vojtaholik/db8c0e68b559d504b93a535473232fbc/raw/19c3b17390b421464584d23ba25e0dfd83987061/gistfile1.txt',
    },
    {
      title: 'Create a New Supabase Project',
      url: `https://d2c5owlt6rorc3.cloudfront.net/egghead-create-a-new-supabase-project-lEG2O_feW/hls/egghead-create-a-new-supabase-project-lEG2O_feW.m3u8`,
      subtitlesUrl: `https://app.egghead.io/api/v1/lessons/javascript-create-a-new-supabase-project/subtitles`,
      notesUrl: `https://gist.githubusercontent.com/joelhooks/d16c649f7d258289cbbc622d8867c608/raw/45f875698610140c28ec991c1aad1979dbf1a990/test.vtt`,
    },
    {
      title: 'Random Video',
      url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    },
  ]

  const [mounted, setMounted] = React.useState<boolean>(false)

  const [currentVideo, setCurrentVideo] = React.useState<VideoResource>(
    videos[0],
  )

  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)

  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)

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
              <HLSSource src={currentVideo.url} />
              {currentVideo.subtitlesUrl && (
                <track
                  src={currentVideo.subtitlesUrl}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              )}
              {currentVideo.notesUrl && (
                <track
                  id="notes"
                  src={currentVideo.notesUrl}
                  kind="metadata"
                  label="notes"
                />
              )}
            </Player>
          )}
        </div>
        {withSidePanel && (
          <div className="col-span-3">
            <SidePanel
              videoResourcesList={
                <VideoResourcesList
                  resources={videos}
                  currentVideo={currentVideo}
                  setCurrentVideo={setCurrentVideo}
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
  currentVideo: VideoResource
  setCurrentVideo: (video: VideoResource) => void
}

const VideoResourcesList: React.FC<VideoResourcesListProps> = ({
  resources,
  currentVideo,
  setCurrentVideo,
}) => {
  return (
    <ul>
      {resources.map((videoResource: VideoResource) => {
        const isActive = videoResource.title === currentVideo.title
        return (
          <li
            key={videoResource.url}
            onClick={() => setCurrentVideo(videoResource)}
            className="border-b border-gray-800"
          >
            <div
              className={`p-3 cursor-pointer ${
                isActive ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              {videoResource.title}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const VideoCue: React.FC<any> = ({cue, note, isActive}) => {
  const cueRef = React.useRef<any>(null)
  const videoService = useVideo()

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
      className={`p-3 cursor-pointer border-b border-gray-800 break-words last:border-0 ${
        isActive ? 'bg-white text-black' : 'bg-black text-white'
      }`}
      onClick={() => clickOpen(cue)}
    >
      {note.text}
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

const Page = () => {
  return (
    <Layout>
      <VideoProvider
        actions={{
          onVideoEnded: (_context: any, _event: any) => {
            console.log('do stuff')
          },
        }}
      >
        <PlayerPage />
      </VideoProvider>
    </Layout>
  )
}

export default Page
