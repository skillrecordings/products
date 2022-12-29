import React from 'react'
import {
  type VideoResource,
  VideoResourceSchema,
} from '../schemas/video-resource'
import {useQuery} from '@tanstack/react-query'

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
  const {data: videoResource, status} = useQuery(
    ['videoResource', videoResourceId],
    async () => {
      const resource = await fetch(
        `/api/skill/video-resources/${videoResourceId}`,
      ).then((response) => response.json())
      return VideoResourceSchema.parse(resource)
    },
  )

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
