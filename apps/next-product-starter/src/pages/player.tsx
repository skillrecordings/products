import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Player, VideoProvider, HLSSource} from '@skillrecordings/player'
import {first, noop} from 'lodash'

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
              default
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
      </VideoProvider>
      <VideoResourceList
        videoResources={videos}
        selectedVideo={currentVideo}
        onSelected={(videoResource: VideoResource) => {
          setCurrentVideo(videoResource)
        }}
      />
    </Layout>
  )
}

type VideoResourceListProps = {
  videoResources: VideoResource[]
  onSelected: (videoResource: VideoResource) => void
  selectedVideo: VideoResource
}

const VideoResourceList: React.FC<VideoResourceListProps> = ({
  videoResources,
  onSelected = noop,
  selectedVideo,
}) => {
  return (
    <div>
      {videoResources.map((videoResource) => {
        return (
          <li
            style={{padding: '10px'}}
            onClick={() => onSelected(videoResource)}
          >
            {videoResource === selectedVideo ? '*' : ''} {videoResource.title}
          </li>
        )
      })}
    </div>
  )
}

export default PlayerPage
