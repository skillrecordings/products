import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Video} from '@skillrecordings/player'

const PlayerPage = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  console.log(videoRef.current)
  return (
    <Layout>
      <div>
        <Video ref={videoRef}>
          <source
            src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
            type="video/mp4"
          />
        </Video>
        <button
          onClick={() => {
            videoRef.current?.play()
          }}
        >
          Play
        </button>
        <button
          onClick={() => {
            videoRef.current?.pause()
          }}
        >
          Pause
        </button>
      </div>
    </Layout>
  )
}

export default PlayerPage
