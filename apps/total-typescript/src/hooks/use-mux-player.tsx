import React from 'react'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextExercise} from 'utils/get-next-exercise'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {Subscriber} from 'pages/api/progress/[exercise]'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  autoPlay: boolean
  setAutoPlay: (value: boolean) => void
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextExercise: SanityDocument
  exercise: SanityDocument
  module: SanityDocument
  path: string
  subscriber: Subscriber
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  exercise: SanityDocument
  subscriber: Subscriber
  path: string
  muxPlayerRef: any
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({module, exercise, muxPlayerRef, children, path, subscriber}) => {
  const router = useRouter()
  const nextExercise = exercise && module && getNextExercise(module, exercise)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const video = exercise.resources.find(
    (resource: SanityDocument) => resource._type === 'muxVideo',
  )

  const handlePlay = () => {
    const videoElement = document.getElementById(
      'mux-player',
    ) as HTMLVideoElement
    return videoElement?.play()
  }

  const handleNext = (autoPlay: boolean) => {
    nextExercise && autoPlay
      ? router.push({
          pathname: '/[module]/[exercise]',
          query: {module: module.slug.current, exercise: nextExercise.slug},
        })
      : setDisplayOverlay(true)
  }

  // initialize player state
  React.useEffect(() => {
    setDisplayOverlay(false)
  }, [exercise])

  // preferences
  React.useEffect(() => {
    if (video && muxPlayerRef?.current) {
      muxPlayerRef.current.playbackRate = playbackRate
      muxPlayerRef.current.autoplay = autoplay
    }
  }, [playbackRate, autoPlay, video])
  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPlay: () => {
        setDisplayOverlay(false)
        track('started lesson video', {
          module: module.slug.current,
          lesson: exercise.slug.current,
          moduleType: module.moduleType,
          lessonType: exercise._type,
        })
      },
      onPause: () => {},
      onEnded: () => {
        handleNext(getPlayerPrefs().autoplay)
        track('completed lesson video', {
          module: module.slug.current,
          lesson: exercise.slug.current,
          moduleType: module.moduleType,
          lessonType: exercise._type,
        })
      },
      onRateChange: () => {
        setPlayerPrefs({
          playbackRate: muxPlayerRef.current.playbackRate,
        })
      },
      defaultHiddenCaptions: true, // TODO: investigate storing subtitles preferences
      // autoPlay,
      streamType: 'on-demand',
      playbackId: video.muxPlaybackId,
      metadata: {
        video_title: `${exercise?.label} (${exercise?._type})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: (value: boolean) => setDisplayOverlay(value),
    handlePlay,
    displayOverlay,
    nextExercise,
    exercise,
    module,
    path,
    subscriber,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
