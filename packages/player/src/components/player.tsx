import * as React from 'react'
import {Video} from './video'
import {ActorRefFrom, assign, createMachine} from 'xstate'
import {useInterpret, useSelector} from '@xstate/react'
import {createContext} from 'react'
import cx from 'classnames'
import {formatVideoTime} from '../utils/format-video-time'

type VideoEvent =
  | {type: 'LOADED'; video: HTMLVideoElement}
  | {type: 'PLAY'}
  | {type: 'TIMING'; elapsed: number}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'FAIL'}

interface VideoStateContext {
  video: HTMLVideoElement | null
  elapsed: string
}

const videoMachine = createMachine<VideoStateContext, VideoEvent>({
  id: 'videoMachine',
  initial: 'loading',
  context: {video: null, elapsed: '1'},
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
              actions: assign({
                elapsed: (_context, event) => {
                  const mins = Math.floor(event.elapsed / 60)
                  const secs = ('0' + Math.floor(event.elapsed % 60)).slice(-2)

                  return `${mins}:${secs}`
                },
              }),
            },
          },
        },
        ended: {on: {PLAY: 'playing'}},
      },
    },
    failure: {},
  },
})

interface VideoContextType {
  videoService: ActorRefFrom<typeof videoMachine>
}

export const VideoContext = createContext({} as VideoContextType)

export const VideoProvider: React.FC = (props) => {
  const videoService = useInterpret(videoMachine, {
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
    <VideoContext.Provider value={{videoService}}>
      {props.children}
    </VideoContext.Provider>
  )
}

export const Player: React.FC = ({children}) => {
  return (
    <div className="cueplayer-react" style={{height: '500px'}}>
      <div className="cueplayer-react-controls-enabled">
        <Video>{children}</Video>
      </div>
      <VideoControlBar />
    </div>
  )
}

const selectVideo = (state: {context: {video: HTMLVideoElement}}) =>
  state.context.video

const VideoControlBar = () => {
  const {videoService} = React.useContext(VideoContext)
  const video = useSelector(videoService, selectVideo)

  console.log(video)

  return (
    <div className="cueplayer-react-control-bar">
      <button
        className="cueplayer-react-control"
        onClick={() => {
          videoService.send('PLAY')
        }}
      >
        Play
      </button>
      <button
        className="cueplayer-react-control"
        onClick={() => {
          videoService.send('PAUSE')
        }}
      >
        Pause
      </button>
      <CurrentTimeDisplay />
    </div>
  )
}

const selectElapsed = (state: {context: {elapsed: string}}) =>
  state.context.elapsed

const CurrentTimeDisplay: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const elapsed = useSelector(videoService, selectElapsed)
  // const formattedTime = formatVideoTime(video?.currentTime, video?.duration)

  return (
    <div
      className={cx(
        'cueplayer-react-current-time cueplayer-react-time-control cueplayer-react-control',
        className,
      )}
    >
      <div className="cueplayer-react-current-time-display" aria-live="off">
        <span className="cueplayer-react-control-text">Current Time </span>
        {elapsed}
      </div>
    </div>
  )
}
