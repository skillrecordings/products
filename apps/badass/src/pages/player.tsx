import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {
  Player,
  VideoProvider,
  HLSSource,
  useMetadataCues,
  useVideo,
  selectActiveCues,
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

  return (
    <Layout>
      <VideoProvider>
        <Player className="font-sans">
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
        <VideoResourceList>
          {videos.map((videoResource) => {
            return (
              <li
                style={{padding: '10px'}}
                onClick={() => setCurrentVideo(videoResource)}
                key={videoResource.url}
              >
                {videoResource.title === currentVideo.title ? '*' : ''}{' '}
                {videoResource.title}
              </li>
            )
          })}
        </VideoResourceList>
        <VideoCueList>
          <VideoCueNotes />
        </VideoCueList>
      </VideoProvider>
    </Layout>
  )
}

const VideoCueNotes: React.FC<any> = ({children}) => {
  const cues = useMetadataCues()
  const videoService = useVideo()
  const activeCues = useSelector(videoService, selectActiveCues)

  return (
    <>
      {cues.map((cue: VTTCue) => {
        let note: {text: string; type?: string}
        const active = activeCues.includes(cue)
        try {
          note = JSON.parse(cue.text)
        } catch (e) {
          note = {text: cue.text}
        }
        return (
          <li key={note.text}>
            {active ? '***' : ''}
            {note.text}
          </li>
        )
      })}
    </>
  )
}

const VideoCueList: React.FC<any> = ({children}) => {
  return (
    <div>
      <ul>{children}</ul>
    </div>
  )
}

const VideoResourceList: React.FC = ({children}) => {
  return (
    <div>
      <ul>{children}</ul>
    </div>
  )
}

export default PlayerPage
