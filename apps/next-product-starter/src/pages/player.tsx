import * as React from 'react'
import cx from 'classnames'
import Layout from '@skillrecordings/react/dist/layouts'
import {
  Player,
  VideoProvider,
  HLSSource,
  useMetadataCues,
  useVideo,
  selectActiveCues,
  selectWithSidePanel,
  selectIsFullscreen,
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

  const [currentVideo, setCurrentVideo] = React.useState<VideoResource>(
    videos[0],
  )

  const videoService = useVideo()
  const withSidePanel = useSelector(videoService, selectWithSidePanel)

  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        className="relative grid w-full grid-cols-12 gap-0 mx-auto video-with-sidepanel-holder"
        ref={fullscreenWrapperRef}
      >
        <div
          className={cx(
            'relative before:float-left after:clear-both after:table video-holder',
            withSidePanel ? 'col-span-9' : 'col-span-12',
          )}
        >
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
        </div>
        {withSidePanel && (
          <div className="col-span-3">
            <SidePanel
              resourceList={
                <VideoResourceList>
                  {videos.map((videoResource) => {
                    return (
                      <li
                        key={videoResource.url}
                        onClick={() => setCurrentVideo(videoResource)}
                        className="border-b border-gray-800"
                      >
                        <VideoResourceItem
                          videoResource={videoResource}
                          isActive={videoResource.title === currentVideo.title}
                        />
                      </li>
                    )
                  })}
                </VideoResourceList>
              }
              videoCuesList={
                <VideoCueList>
                  <VideoCueNotes />
                </VideoCueList>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}

const VideoResourceList: React.FC = ({children}) => {
  return <ul>{children}</ul>
}

const VideoResourceItem: React.FC<{
  videoResource: VideoResource
  isActive: boolean
}> = ({videoResource: {title, url, subtitlesUrl, notesUrl}, isActive}) => {
  return (
    <div
      className={`p-3 cursor-pointer ${
        isActive ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      {title}
    </div>
  )
}

const VideoCueList: React.FC<any> = ({children}) => {
  return <ul className="break-words">{children}</ul>
}

const VideoCueNotes: React.FC<any> = ({children}) => {
  const cues = useMetadataCues()
  const videoService = useVideo()
  const activeCues = useSelector(videoService, selectActiveCues)

  return (
    <>
      {cues.map((cue: VTTCue) => {
        let note: {text: string; type?: string}
        const isActive = activeCues.includes(cue)
        try {
          note = JSON.parse(cue.text)
        } catch (e) {
          note = {text: cue.text}
        }
        return (
          <li
            key={note.text}
            className={`p-3 cursor-pointer border-b border-gray-800 ${
              isActive ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {note.text}
          </li>
        )
      })}
    </>
  )
}

const Page = () => {
  return (
    <Layout>
      <VideoProvider>
        <PlayerPage />
      </VideoProvider>
    </Layout>
  )
}

export default Page
