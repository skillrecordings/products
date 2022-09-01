import React from 'react'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextLesson} from 'utils/get-lesson'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'

export const useMuxPlayer = (
  muxPlayerRef: any,
  lesson?: SanityDocument,
  course?: SanityDocument,
) => {
  const router = useRouter()
  const nextLesson = lesson && course && getNextLesson(course, lesson)
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
          pathname: '/[course]/[lesson]',
          query: {course: course.slug, lesson: nextLesson.slug},
        })
      : setDisplayOverlay(true)
  }

  // initialize player state
  React.useEffect(() => {
    setDisplayOverlay(false)
  }, [lesson])

  // preferences
  React.useEffect(() => {
    if (muxPlayerRef.current) {
      muxPlayerRef.current.playbackRate = playbackRate
      muxPlayerRef.current.autoplay = autoplay
    }
  }, [playbackRate, autoPlay])

  return {
    muxPlayerProps: {
      onPlay: () => {
        setDisplayOverlay(false)
      },
      onPause: () => {},
      onEnded: (e: any) => {
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
      metadata: {
        video_title: `${lesson?.title} (${lesson?.lessonType})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    handlePlay,
    displayOverlay,
    nextLesson,
  }
}
