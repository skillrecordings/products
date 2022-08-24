import {SanityDocument} from '@sanity/client'
import {useVideo} from 'context/video-context'
import {useRouter} from 'next/router'
import React from 'react'
import {usePlayerPrefs} from './use-player-prefs'

export const useMuxPlayer = (
  muxPlayerRef: any,
  lesson: SanityDocument,
  course: SanityDocument,
  nextLesson: SanityDocument,
) => {
  const router = useRouter()
  const videoService = useVideo()
  const {setPlayerPrefs, playbackRate, autoplay} = usePlayerPrefs()

  const [autoPlay, setAutoPlay] = React.useState(autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)

  const handlePlay = () => {
    displayOverlay && setDisplayOverlay(false)
    muxPlayerRef.current.play()
  }
  const handleNext = () => {
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
    muxPlayerRef.current.autoplay = autoPlay
    muxPlayerRef.current.playbackRate = playbackRate
  }, [lesson])

  return {
    muxPlayerProps: {
      onPlay: () => {
        videoService.send({type: 'PLAY'})
      },
      onPause: () => {
        videoService.send({type: 'PAUSE'})
      },
      onEnded: () => {
        videoService.send({type: 'END'})
        handleNext()
      },
      onRateChange: () => {
        setPlayerPrefs({
          playbackRate: muxPlayerRef.current.playbackRate,
        })
      },
      streamType: 'on-demand',
      playbackId: lesson.video,
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    handlePlay,
    displayOverlay,
  }
}
