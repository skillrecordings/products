import {SanityDocument} from '@sanity/client'
import {useVideo} from 'context/video-context'
import {useRouter} from 'next/router'
import React from 'react'
import {getNextLesson} from 'utils/get-next-lesson'
import {usePlayerPrefs} from './use-player-prefs'

export const useMuxPlayer = (
  muxPlayerRef: any,
  lesson?: SanityDocument,
  course?: SanityDocument,
) => {
  const router = useRouter()
  const videoService = useVideo()
  const nextLesson = lesson && course && getNextLesson(course, lesson)
  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)

  const handlePlay = () => {
    displayOverlay && setDisplayOverlay(false)
    muxPlayerRef.current.play()
  }
  const handleNext = (autoPlay: boolean) => {
    nextLesson && autoPlay
      ? router.push({
          pathname: '/[course]/[lesson]',
          query: {course: course.slug, lesson: nextLesson.slug},
        })
      : setDisplayOverlay(true)
  }

  // initialize player state
  React.useEffect(() => {
    videoService.send('RESET')
    setDisplayOverlay(false)
  }, [lesson])

  // preferences
  React.useEffect(() => {
    muxPlayerRef.current.playbackRate = playbackRate
    muxPlayerRef.current.autoplay = autoplay
  }, [playbackRate, autoPlay])

  return {
    muxPlayerProps: {
      onPlay: () => {
        videoService.send({type: 'PLAY'})
      },
      onPause: () => {
        videoService.send({type: 'PAUSE'})
      },
      onEnded: (e: any) => {
        videoService.send({type: 'END'})
        handleNext(getPlayerPrefs().autoplay)
      },
      onRateChange: () => {
        setPlayerPrefs({
          playbackRate: muxPlayerRef.current.playbackRate,
        })
      },
      // autoPlay,
      streamType: 'on-demand',
      playbackId: lesson?.video,
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    handlePlay,
    displayOverlay,
    nextLesson,
  }
}
