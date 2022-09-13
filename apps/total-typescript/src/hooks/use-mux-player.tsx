import React from 'react'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextLesson} from 'utils/get-lesson'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {Subscriber} from 'pages/api/progress/[lesson]'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  autoPlay: boolean
  setAutoPlay: (value: boolean) => void
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextLesson: SanityDocument
  lesson: SanityDocument
  module: SanityDocument
  path: string
  subscriber: Subscriber
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  lesson: SanityDocument
  subscriber: Subscriber
  path: string
  muxPlayerRef: any
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({module, lesson, muxPlayerRef, children, path, subscriber}) => {
  const router = useRouter()
  const nextLesson = lesson && module && getNextLesson(module, lesson)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const video = lesson.resources.find(
    (resource: SanityDocument) => resource._type === 'muxVideo',
  )

  const handlePlay = () => {
    muxPlayerRef.current.play()
  }
  const handleNext = (autoPlay: boolean) => {
    nextLesson && autoPlay
      ? router.push({
          pathname: '/[module]/[lesson]',
          query: {module: module.slug, lesson: nextLesson.slug},
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
      onPlay: () => {
        setDisplayOverlay(false)
        track('started lesson video', {
          module: module.slug,
          lesson: lesson.slug.current,
        })
      },
      onPause: () => {},
      onEnded: () => {
        handleNext(getPlayerPrefs().autoplay)
        track('completed lesson video', {
          module: module.slug,
          lesson: lesson.slug.current,
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
        video_title: `${lesson?.label} (${lesson?._type})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: (value: boolean) => setDisplayOverlay(value),
    handlePlay,
    displayOverlay,
    nextLesson,
    lesson,
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
