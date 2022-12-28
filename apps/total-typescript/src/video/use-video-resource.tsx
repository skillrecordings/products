import React from 'react'

import {trpc} from 'video/trpc'
import {type VideoResource} from './video-resource'

type VideoResourceContextType = {
  videoResource?: VideoResource
  loadingVideoResource: boolean
  videoResourceId: string
}

export const VideoResourceContext = React.createContext(
  {} as VideoResourceContextType,
)

type VideoResourceProviderProps = {
  videoResourceId: string
  children: React.ReactNode
}

export const VideoResourceProvider: React.FC<VideoResourceProviderProps> = ({
  videoResourceId,
  children,
}) => {
  const {data: videoResource, status} = trpc.videoResources.byId.useQuery({
    id: videoResourceId,
  })

  const context = {
    videoResourceId,
    videoResource,
    loadingVideoResource: status === 'loading',
  }
  return (
    <VideoResourceContext.Provider value={context}>
      {children}
    </VideoResourceContext.Provider>
  )
}

export const useVideoResource = () => {
  const videoResourceContext = React.useContext(VideoResourceContext)
  return videoResourceContext
}
