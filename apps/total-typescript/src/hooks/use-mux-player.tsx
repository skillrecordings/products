import React from 'react'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextLesson} from 'utils/get-lesson'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  autoPlay: boolean
  setAutoPlay: (value: boolean) => void
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextLesson: SanityDocument
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  lesson: SanityDocument
  muxPlayerRef: any
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({module, lesson, muxPlayerRef, children}) => {
  const router = useRouter()
  const nextLesson = lesson && module && getNextLesson(module, lesson)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)

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
    if (muxPlayerRef?.current) {
      muxPlayerRef.current.playbackRate = playbackRate
      muxPlayerRef.current.autoplay = autoplay
    }
  }, [playbackRate, autoPlay, lesson])

  const context = {
    muxPlayerProps: {
      onPlay: () => {
        setDisplayOverlay(false)
      },
      onPause: () => {},
      onEnded: () => {
        handleNext(getPlayerPrefs().autoplay)
      },
      onRateChange: () => {
        setPlayerPrefs({
          playbackRate: muxPlayerRef.current.playbackRate,
        })
      },
      defaultHiddenCaptions: true, // TODO: investigate storing subtitles preferences
      // autoPlay,
      streamType: 'on-demand',
      playbackId: lesson?.video,
      metadata: {
        video_title: `${lesson?.title} (${lesson?.lessonType})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: (value: boolean) => setDisplayOverlay(value),
    handlePlay,
    displayOverlay,
    nextLesson,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
