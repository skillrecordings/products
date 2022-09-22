import React from 'react'
import get from 'lodash/get'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextExercise} from 'utils/get-next-exercise'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {Subscriber} from 'lib/convertkit'
import {type Exercise, ExerciseSchema} from 'lib/exercises'
import {type Tip, TipSchema} from 'lib/tips'

type VideoResource = Exercise | Tip

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  autoPlay: boolean
  setAutoPlay: (value: boolean) => void
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextExercise: SanityDocument
  lesson: VideoResource
  module: SanityDocument
  path: string
  subscriber?: Subscriber
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  lesson: VideoResource
  subscriber?: Subscriber
  path?: string
  muxPlayerRef: any
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({module, lesson, muxPlayerRef, children, path = '', subscriber}) => {
  const router = useRouter()
  const nextExercise = getNextExercise(module, lesson as Exercise)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const video = lesson?.resources.find(
    (resource: SanityDocument) =>
      resource._type === 'muxVideo' || resource._type === 'videoResource',
  )
  const title = get(lesson, 'title') || get(lesson, 'label')

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
  }, [lesson])

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
          lesson: lesson.slug.current,
          moduleType: module.moduleType,
          lessonType: lesson._type,
        })
      },
      onPause: () => {},
      onEnded: () => {
        handleNext(getPlayerPrefs().autoplay)
        track('completed lesson video', {
          module: module.slug.current,
          lesson: lesson.slug.current,
          moduleType: module.moduleType,
          lessonType: lesson._type,
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
      playbackId: video.muxPlaybackId || video.muxAsset.muxPlaybackId,
      metadata: {
        video_title: `${title} (${lesson._type})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: (value: boolean) => setDisplayOverlay(value),
    handlePlay,
    displayOverlay,
    nextExercise,
    lesson:
      lesson._type === 'tip'
        ? TipSchema.parse(lesson)
        : ExerciseSchema.parse(lesson),
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
