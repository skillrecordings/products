import {assign, createMachine} from 'xstate'
import {MutableRefObject} from 'react'

export type VideoEvent =
  | {type: 'VOLUME_CHANGE'; volume: number; source?: string}
  | {type: 'SET_ROOT_ELEM'; rootElemRef: MutableRefObject<HTMLElement | null>}
  | {type: 'LOADED'}
  | {type: 'REGISTER'; videoRef: MutableRefObject<HTMLVideoElement>}
  | {type: 'PLAY'; source?: string}
  | {type: 'TOGGLE_MUTE'}
  | {type: 'TOGGLE_FULLSCREEN'; element?: HTMLElement | null}
  | {type: 'SEEKING'; seekingTime: number; source?: string}
  | {type: 'END_SEEKING'}
  | {type: 'TIMING'}
  | {type: 'ACTIVITY'}
  | {type: 'PAUSE'; source?: string}
  | {type: 'END'}
  | {type: 'PLAYBACKRATE_CHANGE'; playbackRate: number; source?: string}
  | {type: 'WAITING'}
  | {type: 'DONE_WAITING'}
  | {type: 'ACTIVATE_METADATA_TRACK'; track: TextTrack}
  | {type: 'FAIL'}

export interface VideoStateContext {
  rootElemRef: MutableRefObject<HTMLElement | null> | null
  // using a ref object versus the straight instance provided some
  // stability with the HLS Source. When it was the video element
  // HLS would get destroyed and recreated repeatedly
  videoRef: MutableRefObject<HTMLVideoElement> | undefined
  duration: number
  currentTime: number
  seekingTime: undefined | number
  hasStarted: boolean
  isActive: boolean
  readyState: number
  volume: number
  playbackRate: number
  isFullscreen: boolean
  lastAction: string | undefined
  waiting: boolean
  seeking: boolean
  metadataTracks: TextTrack[]
}

export const videoMachine = createMachine<VideoStateContext, VideoEvent>({
  id: 'videoMachine',
  initial: 'loading',
  context: {
    rootElemRef: null,
    videoRef: undefined,
    waiting: true,
    duration: 0,
    currentTime: 0,
    seekingTime: undefined,
    hasStarted: false,
    isActive: false,
    readyState: 0,
    volume: 0.8,
    playbackRate: 1,
    isFullscreen: false,
    lastAction: undefined,
    seeking: false,
    metadataTracks: [],
  },
  on: {
    SET_ROOT_ELEM: {
      actions: assign({
        rootElemRef: (_context, event) => event.rootElemRef,
      }),
    },
    REGISTER: {
      actions: assign({
        videoRef: (_context, event) => event.videoRef,
        readyState: (_context, event) =>
          event.videoRef?.current?.readyState ?? 0,
      }),
    },
    WAITING: {
      actions: [
        assign({
          waiting: (_context, _event) => true,
        }),
      ],
    },
    DONE_WAITING: {
      actions: [
        assign({
          waiting: (_context, _event) => false,
        }),
      ],
    },
    ACTIVITY: {
      actions: [
        assign({
          isActive: (_context, _event) => true,
        }),
      ],
    },
    TOGGLE_FULLSCREEN: {
      actions: [
        assign({
          isFullscreen: (context, _event) => !context.isFullscreen,
        }),
        'toggleFullscreen',
      ],
    },
    ACTIVATE_METADATA_TRACK: {
      actions: [
        assign({
          metadataTracks: (context, event) => {
            event.track.mode = 'showing'
            if (context.metadataTracks.indexOf(event.track) < 0) {
              context.metadataTracks.push(event.track)
            }
            return [...context.metadataTracks]
          },
        }),
      ],
    },
  },
  states: {
    loading: {
      entry: [
        assign({
          waiting: (_context, _event) => true,
        }),
      ],
      on: {
        LOADED: {
          target: 'ready',
          actions: assign({
            readyState: (context, _event) =>
              context.videoRef?.current?.readyState ?? 0,
            waiting: (_context, _event) => false,
          }),
        },
        FAIL: 'failure',
      },
    },
    ready: {
      initial: 'paused',
      entry: [
        assign({
          waiting: (_context, _event) => false,
        }),
      ],
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
              seeking: (_context, _event) => true,
            }),
            'seekVideo',
          ],
        },
        END_SEEKING: {
          actions: [
            assign({
              seekingTime: (context, event) => 0,
              seeking: (_context, _event) => false,
            }),
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
          entry: [
            assign({
              waiting: (_context, _event) => false,
            }),
          ],
          on: {
            PAUSE: {target: 'paused', actions: ['pauseVideo']},
            END: 'ended',
            TIMING: {
              actions: assign({
                currentTime: (context, _event) =>
                  context.videoRef?.current?.currentTime ?? 0,
                duration: (context, _event) =>
                  context.videoRef?.current?.duration ?? 0,
              }),
            },
          },
        },
        ended: {on: {PLAY: 'playing'}},
      },
    },
    failure: {
      entry: [
        assign({
          waiting: (_context, _event) => true,
        }),
      ],
    },
  },
})
