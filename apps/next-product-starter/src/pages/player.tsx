import * as React from 'react'
import Layout from '@skillrecordings/react/dist/layouts'
import {Video} from '@skillrecordings/player'
import {assign, createMachine} from 'xstate'
import {useMachine} from '@xstate/react'

type VideoEvent =
  | {type: 'LOADED'; video: HTMLVideoElement}
  | {type: 'PLAY'}
  | {type: 'TIMING'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'FAIL'}

interface VideoContext {
  video: HTMLVideoElement | null
}

const videoMachine = createMachine<VideoContext, VideoEvent>({
  id: 'videoMachine',
  initial: 'loading',
  context: {video: null},
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'ready',
          actions: assign({
            video: (_context, event) => event.video,
          }),
        },
        FAIL: 'failure',
      },
    },
    ready: {
      initial: 'paused',
      states: {
        paused: {on: {PLAY: {target: 'playing', actions: ['playVideo']}}},
        playing: {
          on: {
            PAUSE: {target: 'paused', actions: ['pauseVideo']},
            END: 'ended',
            TIMING: {
              target: 'playing',
            },
          },
        },
        ended: {on: {PLAY: 'playing'}},
      },
    },
    failure: {},
  },
})

const PlayerPage = () => {
  const [current, send] = useMachine(videoMachine, {
    actions: {
      playVideo: (context, _event) => {
        const {video} = context
        video?.play()
      },
      pauseVideo: (context, _event) => {
        const {video} = context
        video?.pause()
      },
    },
  })

  return (
    <Layout>
      <div
        className="cueplayer-react "
        style={{display: 'flex', height: '500px'}}
      >
        <div className="cueplayer-react-controls-enabled">
          <Video
            handleCanPlay={(event: {currentTarget: HTMLVideoElement}) => {
              send('LOADED', {video: event.currentTarget})
            }}
          >
            <source
              src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4"
              type="video/mp4"
            />
          </Video>
          <div className="cueplayer-react-control-bar">
            <button
              className="cueplayer-react-control"
              onClick={() => {
                send('PLAY')
              }}
            >
              Play
            </button>
            <button
              className="cueplayer-react-control"
              onClick={() => {
                send('PAUSE')
              }}
            >
              Pause
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PlayerPage
