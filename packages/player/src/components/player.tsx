import * as React from 'react'
import {Video} from './video'
import {ActorRefFrom, assign, createMachine} from 'xstate'
import {useInterpret, useSelector} from '@xstate/react'
import {createContext, SyntheticEvent} from 'react'
import cx from 'classnames'
import {formatVideoTime} from '../utils/format-video-time'
import {Slider} from './slider'
import {Shortcut} from './shortcut'
import {context} from 'msw'

type VideoEvent =
  | {type: 'LOADED'; video: HTMLVideoElement}
  | {type: 'PLAY'}
  | {type: 'SEEKING'; seekingTime: number}
  | {type: 'TIMING'}
  | {type: 'ACTIVITY'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'VOLUME_CHANGE'; volume: number}
  | {type: 'PLAYBACKRATE_CHANGE'; playbackRate: number}
  | {type: 'FAIL'}

export interface VideoStateContext {
  video: HTMLVideoElement | null
  duration: number
  currentTime: number
  seekingTime: null | number
  hasStarted: boolean
  isActive: boolean
  readyState: number
  volume: number
  playbackRate: number
}

const videoMachine = createMachine<VideoStateContext, VideoEvent>({
  id: 'videoMachine',
  initial: 'loading',
  context: {
    video: null,
    duration: 0,
    currentTime: 0,
    seekingTime: null,
    hasStarted: false,
    isActive: false,
    readyState: -1,
    volume: 0.8,
    playbackRate: 1,
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'ready',
          actions: assign({
            video: (_context, event) => event.video,
            readyState: (_context, event) => event.video.readyState,
          }),
        },
        ACTIVITY: {
          target: 'loading',
          actions: assign({
            isActive: (_context, _event) => true,
          }),
        },
        FAIL: 'failure',
      },
    },
    ready: {
      initial: 'paused',

      states: {
        paused: {
          on: {
            PLAY: {
              target: 'playing',
              actions: [
                assign({
                  hasStarted: (_context, _event) => true,
                }),
                'playVideo',
              ],
            },
            VOLUME_CHANGE: {
              target: 'paused',
              actions: [
                assign({
                  volume: (_context, event) => event.volume,
                }),
                (context, event) => {
                  if (context.video) context.video.volume = event.volume
                },
              ],
            },
            PLAYBACKRATE_CHANGE: {
              target: 'paused',
              actions: [
                assign({
                  playbackRate: (_context, event) => event.playbackRate,
                }),
                (context, event) => {
                  if (context.video)
                    context.video.playbackRate = event.playbackRate
                },
              ],
            },
            ACTIVITY: {
              target: 'paused',
              actions: assign({
                isActive: (_context, _event) => true,
              }),
            },
            SEEKING: {
              target: 'paused',
              actions: [
                assign({
                  seekingTime: (context, event) => event.seekingTime,
                }),
                'seekVideo',
              ],
            },
          },
        },
        playing: {
          on: {
            PAUSE: {target: 'paused', actions: ['pauseVideo']},
            ACTIVITY: {
              target: 'playing',
              actions: assign({
                isActive: (_context, _event) => true,
              }),
            },
            VOLUME_CHANGE: {
              target: 'playing',
              actions: [
                assign({
                  volume: (_context, event) => event.volume,
                }),
                (context, event) => {
                  if (context.video) context.video.volume = event.volume
                },
              ],
            },
            PLAYBACKRATE_CHANGE: {
              target: 'playing',
              actions: [
                assign({
                  playbackRate: (_context, event) => event.playbackRate,
                }),
                (context, event) => {
                  if (context.video)
                    context.video.playbackRate = event.playbackRate
                },
              ],
            },
            SEEKING: {
              target: 'playing',
              actions: [
                assign({
                  seekingTime: (context, event) => event.seekingTime,
                }),
                'seekVideo',
              ],
            },
            END: 'ended',
            TIMING: {
              target: 'playing',
              actions: assign({
                currentTime: (context, _event) =>
                  context.video?.currentTime ?? 0,
                duration: (context, _event) => context.video?.duration ?? 0,
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
      seekVideo: (context, _event) => {
        const {video, seekingTime} = context
        console.log({seekingTime})
        if (video) video.currentTime = seekingTime ?? video.currentTime
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
  const {videoService} = React.useContext(VideoContext)
  return (
    <div
      onMouseDown={() => videoService.send('ACTIVITY')}
      onMouseMove={() => videoService.send('ACTIVITY')}
      onKeyDown={() => videoService.send('ACTIVITY')}
      className="cueplayer-react"
      style={{height: '500px'}}
    >
      <div className="cueplayer-react-controls-enabled">
        <Video>{children}</Video>
      </div>
      <VideoControlBar />
      <Shortcut />
    </div>
  )
}

const VideoControlBar = () => {
  const {videoService} = React.useContext(VideoContext)

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
      <SeekBar />
    </div>
  )
}

const selectFormattedTime = (state: {context: VideoStateContext}) =>
  formatVideoTime(
    state.context.video?.currentTime,
    state.context.video?.duration,
  )

const CurrentTimeDisplay: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const formattedTime = useSelector(videoService, selectFormattedTime)

  return (
    <div
      className={cx(
        'cueplayer-react-current-time cueplayer-react-time-control cueplayer-react-control',
        className,
      )}
    >
      <div className="cueplayer-react-current-time-display" aria-live="off">
        <span className="cueplayer-react-control-text">Current Time </span>
        {formattedTime}
      </div>
    </div>
  )
}

const selectPercent = (state: {context: VideoStateContext}) => {
  if (!state.context.video) return 0
  const {currentTime, duration} = state.context.video
  const {seekingTime} = state.context
  const time = seekingTime || currentTime
  const percent = time / duration
  return percent >= 1 ? 1 : percent
}

const selectCurrentTime = (state: {context: VideoStateContext}) =>
  state.context.video?.currentTime || 0

const selectDuration = (state: {context: VideoStateContext}) =>
  state.context.video?.duration || 0

const SeekBar: React.FC<any> = (props) => {
  const sliderRef = React.useRef(null)
  const {videoService} = React.useContext(VideoContext)
  const formattedTime = useSelector(videoService, selectFormattedTime)
  const percent = useSelector(videoService, selectPercent)
  const duration = useSelector(videoService, selectDuration)
  const currentTime = useSelector(videoService, selectCurrentTime)

  console.log(percent, duration, formattedTime)

  function calculateDistance(event: Event | SyntheticEvent) {
    const node = sliderRef.current
    const position = getPointerPosition(node, event)
    return position.x
  }

  function getNewTime(event: Event | SyntheticEvent) {
    const distance = calculateDistance(event)
    const newTime = distance * duration

    // Don't let video end while scrubbing.
    return newTime === duration ? newTime - 0.1 : newTime
  }

  function handleMouseDown() {}

  function handleMouseUp(event: Event | SyntheticEvent) {
    const newTime = getNewTime(event)
    // Set new time (tell video to seek to new time)
    // actions.seek(newTime)
    // actions.handleEndSeeking(newTime)
    console.log({newTime})
    videoService.send({type: 'SEEKING', seekingTime: newTime})
    console.log('mouse up', newTime)
  }

  function handleMouseMove(event: Event | SyntheticEvent) {
    const newTime = getNewTime(event)
    console.log({newTime})
    videoService.send({type: 'SEEKING', seekingTime: newTime})
    console.log('mouse move', newTime)
  }

  function stepForward() {
    let newTime = currentTime + 10
    if (newTime > duration) {
      newTime = duration
    }
    console.log({newTime})
    videoService.send({type: 'SEEKING', seekingTime: newTime})
  }

  function stepBack() {
    let newTime = currentTime - 10
    if (newTime < 0) {
      newTime = 0
    }
    console.log({newTime})
    videoService.send({type: 'SEEKING', seekingTime: newTime})
  }

  return (
    <Slider
      ref={sliderRef}
      label="video progress bar"
      className={cx('cueplayer-react-progress-holder', props.className)}
      valuenow={(percent * 100).toFixed(2)}
      valuetext={formattedTime}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      getPercent={() => percent}
      stepForward={stepForward}
      stepBack={stepBack}
    >
      {/*<LoadProgressBar*/}
      {/*  buffered={buffered}*/}
      {/*  currentTime={time}*/}
      {/*  duration={duration}*/}
      {/*/>*/}
      {/*<MouseTimeDisplay duration={duration} mouseTime={mouseTime} />*/}
      {/*<PlayProgressBar currentTime={time} duration={duration} />*/}
    </Slider>
  )
}

/**
 * Offset Left
 * getBoundingClientRect technique from
 * John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @function findElPosition
 * @param {ReactNodeRef} el React Node ref from which to get offset
 * @return {Object}
 */
export function findElPosition(el: any) {
  let box

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect()
  }

  if (!box) {
    return {
      left: 0,
      top: 0,
    }
  }

  const {body, documentElement: docEl} = document

  const clientLeft = docEl.clientLeft || body.clientLeft || 0
  const scrollLeft = window.pageXOffset || body.scrollLeft
  const left = box.left + scrollLeft - clientLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const scrollTop = window.pageYOffset || body.scrollTop
  const top = box.top + scrollTop - clientTop

  // Android sometimes returns slightly off decimal values, so need to round
  return {
    left: Math.round(left),
    top: Math.round(top),
  }
}

/**
 * Get pointer position in a React Node ref
 * Returns an object with x and y coordinates.
 * The base on the coordinates are the bottom left of the element.
 *
 * @function getPointerPosition
 * @param {ReactNodeRef} el React Node ref on which to get the pointer position on
 * @param {Event} event Event object
 * @return {Object} This object will have x and y coordinates corresponding to the mouse position
 */
export function getPointerPosition(el: any, event: any) {
  const position = {x: 0, y: 0}
  const box = findElPosition(el)
  const boxW = el.offsetWidth
  const boxH = el.offsetHeight

  const boxY = box.top
  const boxX = box.left
  let evtPageY = event.pageY
  let evtPageX = event.pageX

  if (event.changedTouches) {
    evtPageX = event.changedTouches[0].pageX
    evtPageY = event.changedTouches[0].pageY
  }

  position.y = Math.max(0, Math.min(1, (boxY - evtPageY + boxH) / boxH))
  position.x = Math.max(0, Math.min(1, (evtPageX - boxX) / boxW))

  return position
}

// blur an element
export function blurNode(reactNode: any) {
  if (reactNode && reactNode.blur) {
    reactNode.blur()
  }
}

// focus an element
export function focusNode(reactNode: any) {
  if (reactNode && reactNode.focus) {
    reactNode.focus()
  }
}
