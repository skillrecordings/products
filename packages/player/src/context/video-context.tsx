import {ActorRefFrom} from 'xstate'
import * as React from 'react'
import {createContext} from 'react'
import {useInterpret} from '@xstate/react'
import {videoMachine} from '../machines/video-machine'
import {defaultActions} from '../actions'

interface VideoContextType {
  videoService: ActorRefFrom<typeof videoMachine>
}

export const VideoContext = createContext({} as VideoContextType)

export const useVideo = () => {
  const {videoService} = React.useContext(VideoContext)

  return videoService
}

/**
 * This is where the magic happens for the video player. The `videoService` is
 * the running xstate machine that we can use to interact with our global state
 * and the shared context of the video player.
 *
 * TODO: allow some actions to be passed in here
 *
 * @param props
 * @constructor
 *
 * @see {@link https://dev.to/mpocock1/how-to-manage-global-state-with-xstate-and-react-3if5}
 */
export const VideoProvider: React.FC<
  React.PropsWithChildren<{
    actions?: any
    services?: any
    guards?: any
  }>
> = ({
  actions = {},
  services = {
    loadResource: () => {},
    loadViewer: () => {},
  },
  guards = {},
  children,
}) => {
  const videoService = useInterpret(videoMachine, {
    actions: {...defaultActions, ...actions},
    services,
    guards,
  })

  // see all state changes
  // videoService.onTransition((state) => {
  //   console.debug(state.value)
  // })

  return (
    <VideoContext.Provider value={{videoService}}>
      {children}
    </VideoContext.Provider>
  )
}
