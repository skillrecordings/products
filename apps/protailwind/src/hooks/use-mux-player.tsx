import React from 'react'
import get from 'lodash/get'
import {usePlayerPrefs} from '@skillrecordings/player'
import {getNextExercise} from 'utils/get-next-exercise'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {type Exercise, ExerciseSchema} from 'lib/exercises'
import {type Tip, TipSchema} from 'lib/tips'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

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
  video?: {muxPlaybackId: string | null | undefined}
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  lesson: VideoResource
  path?: string
  muxPlayerRef: any
  onEnded?: () => Promise<any>
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({
  module,
  lesson,
  muxPlayerRef,
  children,
  path = '',
  onEnded = async () => {},
}) => {
  const router = useRouter()
  const {subscriber} = useConvertkit()
  const nextExercise = getNextExercise(module, lesson as Exercise)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const video = {muxPlaybackId: lesson.muxPlaybackId}
  const title = get(lesson, 'title') || get(lesson, 'label')

  const handlePlay = React.useCallback(() => {
    const videoElement = document.getElementById(
      'mux-player',
    ) as HTMLVideoElement
    return videoElement?.play()
  }, [])

  const moduleSlug = module?.slug?.current
  const nextExerciseSlug = nextExercise?.slug

  const handleNext = React.useCallback(
    (autoPlay: boolean) => {
      nextExerciseSlug && autoPlay
        ? router.push({
            pathname: '/[module]/[lesson]',
            query: {module: moduleSlug, lesson: nextExerciseSlug},
          })
        : setDisplayOverlay(true)
    },
    [moduleSlug, nextExerciseSlug, router],
  )

  // initialize player state
  React.useEffect(() => {
    setDisplayOverlay(false)
  }, [lesson])

  // preferences
  React.useEffect(() => {
    if (muxPlayerRef.current && video) {
      muxPlayerRef.current.playbackRate = playbackRate
      muxPlayerRef.current.autoplay = autoplay
    }
  }, [subscriber, muxPlayerRef, playbackRate, autoPlay, video])

  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPlay: () => {
        setDisplayOverlay(false)
        track('started lesson video', {
          module: module.slug.current,
          lesson: lesson.slug,
          moduleType: module.moduleType,
          lessonType: lesson._type,
        })
      },

      onPause: () => {},
      onEnded: async () => {
        handleNext(getPlayerPrefs().autoplay)
        track('completed lesson video', {
          module: module.slug.current,
          lesson: lesson.slug,
          moduleType: module.moduleType,
          lessonType: lesson._type,
        })
        return onEnded()
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
        video_title: `${title} (${lesson._type})`,
      },
      secondaryColor: 'rgb(0 0 0 / 40%)',
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
    video,
    path,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
