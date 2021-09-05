import * as React from 'react'
import {Video} from './video'
import {ActorRefFrom, assign, createMachine} from 'xstate'
import {useInterpret, useSelector} from '@xstate/react'
import {createContext, SyntheticEvent, MouseEvent} from 'react'
import cx from 'classnames'
import {formatVideoTime} from '../utils/format-video-time'
import {Slider} from './slider'
import {Shortcut} from './shortcut'

type VideoEvent =
  | {type: 'VOLUME_CHANGE'; volume: number}
  | {type: 'LOADED'; video: HTMLVideoElement}
  | {type: 'PLAY'}
  | {type: 'SEEKING'; seekingTime: number}
  | {type: 'TIMING'}
  | {type: 'ACTIVITY'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'PLAYBACKRATE_CHANGE'; playbackRate: number}
  | {type: 'FAIL'}

export interface VideoStateContext {
  video: HTMLVideoElement | undefined
  duration: number
  currentTime: number
  seekingTime: undefined | number
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
    video: undefined,
    duration: 0,
    currentTime: 0,
    seekingTime: undefined,
    hasStarted: false,
    isActive: false,
    readyState: -1,
    volume: 0.8,
    playbackRate: 1,
  },
  on: {
    ACTIVITY: {
      actions: [
        assign({
          isActive: (_context, _event) => true,
        }),
      ],
    },
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
        FAIL: 'failure',
      },
    },
    ready: {
      initial: 'paused',
      on: {
        VOLUME_CHANGE: {
          actions: [
            assign({
              volume: (_context, event) => event.volume,
            }),
            'setVolume',
          ],
        },
        PLAYBACKRATE_CHANGE: {
          actions: [
            assign({
              playbackRate: (_context, event) => event.playbackRate,
            }),
            'setPlaybackRate',
          ],
        },
        SEEKING: {
          actions: [
            assign({
              seekingTime: (context, event) => event.seekingTime,
            }),
            'seekVideo',
          ],
        },
      },
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
          },
        },
        playing: {
          on: {
            PAUSE: {target: 'paused', actions: ['pauseVideo']},
            END: 'ended',
            TIMING: {
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
      setPlaybackRate: (context, event) => {
        // These threw type errors if the event type wasn't specified
        // assuming that the machine under the hood doesn't
        // have enough context since these actions are very separated
        // from the config.
        if (context.video && event.type === 'PLAYBACKRATE_CHANGE')
          context.video.playbackRate = event.playbackRate
      },
      setVolume: (context, event) => {
        if (context.video && event.type === 'VOLUME_CHANGE')
          context.video.volume = event.volume ?? 0.8
      },
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
  const handleActivity = () => videoService.send('ACTIVITY')
  return (
    <div
      onMouseDown={handleActivity}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
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
      <ProgressControl />
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

const ProgressControl: React.FC<any> = (props) => {
  const {videoService} = React.useContext(VideoContext)
  const duration = useSelector(videoService, selectDuration)
  const [mouseTime, setMouseTime] = React.useState({time: 0, position: 0})
  const seekBar = React.useRef(null)

  function handleMouseMove(event: MouseEvent) {
    if (!event.pageX) {
      return
    }

    const node = seekBar.current
    const newTime = getPointerPosition(node, event).x * duration
    const position = event.pageX - findElPosition(node).left

    setMouseTime({
      time: newTime,
      position,
    })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cx(
        'cueplayer-react-progress-control cueplayer-react-control',
        props.className,
      )}
    >
      <SeekBar mouseTime={mouseTime} ref={seekBar} {...props} />
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

const selectBuffered = (state: {context: VideoStateContext}) =>
  state.context.video?.buffered || 0

const SeekBar: React.FC<any> = React.forwardRef<HTMLDivElement, any>(
  (props, ref) => {
    // currentTime, seekingTime, duration, buffered
    const {videoService} = React.useContext(VideoContext)
    const formattedTime = useSelector(videoService, selectFormattedTime)
    const percent = useSelector(videoService, selectPercent)
    const duration = useSelector(videoService, selectDuration)
    const currentTime = useSelector(videoService, selectCurrentTime)

    function calculateDistance(event: Event | SyntheticEvent) {
      // forwarding refs made for a bit of a weird situation with
      // the typing but there IS a ref here
      // @ts-ignore
      const node = ref?.current
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
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function handleMouseMove(event: Event | SyntheticEvent) {
      const newTime = getNewTime(event)
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function stepForward() {
      let newTime = currentTime + 10
      if (newTime > duration) {
        newTime = duration
      }
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    function stepBack() {
      let newTime = currentTime - 10
      if (newTime < 0) {
        newTime = 0
      }
      videoService.send({type: 'SEEKING', seekingTime: newTime})
    }

    return (
      <Slider
        ref={ref}
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
        <LoadProgressBar />
        {/*<MouseTimeDisplay duration={duration} mouseTime={mouseTime} />*/}
        <PlayProgressBar />
      </Slider>
    )
  },
)

const PlayProgressBar: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const formattedTime = useSelector(videoService, selectFormattedTime)
  const percent = `${useSelector(videoService, selectPercent) * 100}%`

  return (
    <div
      data-current-time={formattedTime}
      className={cx(
        'cueplayer-react-play-progress cueplayer-react-slider-bar',
        className,
      )}
      style={{
        width: percent,
      }}
    >
      <span className="cueplayer-react-control-text">
        {`Progress: ${percent}`}
      </span>
    </div>
  )
}

const LoadProgressBar: React.FC<any> = ({className}) => {
  const {videoService} = React.useContext(VideoContext)
  const duration = useSelector(videoService, selectDuration)
  const buffered = useSelector(videoService, selectBuffered)

  if (!buffered || !buffered.length) {
    return null
  }
  let bufferedEnd = buffered.end(buffered.length - 1)

  if (bufferedEnd > duration) {
    bufferedEnd = duration
  }

  // get the percent width of a time compared to the total end
  function percentify(time: number, end: number) {
    const percent = time / end || 0 // no NaN
    return `${(percent >= 1 ? 1 : percent) * 100}%`
  }

  // the width of the progress bar
  const style = {width: '0%'}
  style.width = percentify(bufferedEnd, duration)

  let parts: any[] | undefined = []

  // add child elements to represent the individual buffered time ranges
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i)
    const end = buffered.end(i)
    // set the percent based on the width of the progress bar (bufferedEnd)
    const part = (
      <div
        style={{
          left: percentify(start, bufferedEnd),
          width: percentify(end - start, bufferedEnd),
        }}
        key={`part-${i}`}
      />
    )
    parts.push(part)
  }

  if (parts.length === 0) {
    parts = undefined
  }

  return (
    <div
      style={style}
      className={cx('cueplayer-react-load-progress', className)}
    >
      <span className="cueplayer-react-control-text">Loaded: 0%</span>
      {parts}
    </div>
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
