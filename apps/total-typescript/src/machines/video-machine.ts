import {assign, createMachine} from 'xstate'

export type VideoEvent =
  | {type: 'PLAY'}
  | {type: 'PAUSE'}
  | {type: 'END'}
  | {type: 'RESET'}

export interface VideoStateContext {}

export const videoMachine = createMachine<VideoStateContext, VideoEvent>({
  id: 'videoMachine',
  initial: 'idle',
  context: {},
  on: {
    RESET: 'idle',
  },
  states: {
    idle: {
      on: {
        PLAY: 'playing',
      },
    },
    paused: {
      on: {
        PLAY: 'playing',
        END: 'ended',
      },
    },
    playing: {
      on: {
        END: 'ended',
        PAUSE: 'paused',
      },
    },
    ended: {
      on: {
        PLAY: 'playing',
      },
    },
  },
})
