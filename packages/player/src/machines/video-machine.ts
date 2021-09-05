import {assign, createMachine} from 'xstate'

export type VideoEvent =
  | {type: 'VOLUME_CHANGE'; volume: number}
  | {type: 'LOADED'; video: HTMLVideoElement}
  | {type: 'PLAY'}
  | {type: 'TOGGLE_MUTE'}
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

export const videoMachine = createMachine<VideoStateContext, VideoEvent>({
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
        TOGGLE_MUTE: {
          actions: ['toggleMute'],
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
