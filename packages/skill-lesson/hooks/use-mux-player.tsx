import React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {useRouter} from 'next/router'
import {type MuxPlayerProps} from '@mux/mux-player-react/*'

import {useVideoResource} from './use-video-resource'
import {useLesson} from './use-lesson'
import {useNextLesson} from './use-next-lesson'
import {track} from '../utils/analytics'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextSection} from '../utils/get-next-section'

import {type AppAbility, createAppAbility} from '../utils/ability'
import {Lesson} from '../schemas/lesson'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useConvertkit} from './use-convertkit'

import {useGlobalPlayerShortcuts} from './use-global-player-shortcut'
import {Section} from '../schemas/section'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
  autoPlay: boolean
  setAutoPlay: (value: boolean) => void
  setPlayerPrefs: (prefs: {[key: string]: boolean | string}) => void
  setDisplayOverlay: (value: boolean) => void
  handlePlay: () => void
  displayOverlay: boolean
  nextExercise?: Lesson | null
  nextExerciseStatus?: 'error' | 'success' | 'loading'
  nextSection: Section | null
  path: string
  video?: {muxPlaybackId?: string}
  canShowVideo: boolean
  loadingUserStatus: boolean
  ability: AppAbility
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  exerciseSlug?: string
  path?: string
  muxPlayerRef: any
  onEnded?: () => Promise<any>
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({
  muxPlayerRef,
  children,
  path = '',
  onEnded = async () => {},
  exerciseSlug,
}) => {
  const router = useRouter()

  const {subscriber} = useConvertkit()
  const {videoResource, loadingVideoResource} = useVideoResource()
  const {lesson, section, module} = useLesson()
  useGlobalPlayerShortcuts(muxPlayerRef)

  const {nextExercise, nextExerciseStatus} = useNextLesson(
    lesson,
    module,
    section,
  )

  const nextSection = section
    ? getNextSection({
        module,
        currentSection: section,
      })
    : null

  const {data: abilityRules, status: abilityRulesStatus} =
    trpcSkillLessons.modules.rules.useQuery({
      moduleSlug: module.slug.current,
      moduleType: module.moduleType,
      lessonSlug: exerciseSlug,
      sectionSlug: section?.slug,
      isSolution: lesson._type === 'solution',
      convertkitSubscriberId: subscriber?.id,
    })

  const ability = createAppAbility(abilityRules || [])

  const {setPlayerPrefs, autoplay, getPlayerPrefs} = usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)

  const title = get(lesson, 'title') || get(lesson, 'label')
  const loadingUserStatus =
    abilityRulesStatus === 'loading' || loadingVideoResource

  const handlePlay = React.useCallback(() => {
    const videoElement = document.getElementById(
      'mux-player',
    ) as HTMLVideoElement
    return videoElement?.play()
  }, [])

  const exitFullscreen = () => {
    if (!isEmpty(window.document.fullscreenElement)) {
      window.document.exitFullscreen()
    }
  }

  const moduleSlug = module?.slug?.current
  const nextExerciseSlug = nextExercise?.slug

  const handleNext = React.useCallback(
    (autoPlay: boolean) => {
      // if (nextExercise?._type === 'exercise') {
      //   setDisplayOverlay(true)
      // } else {
      //   router.push(router.asPath + '/exercise').then(() => {
      //     setDisplayOverlay(true)
      //   })
      // }
      nextExerciseSlug && autoPlay
        ? router.push({
            pathname: '/[module]/[lesson]',
            query: {module: moduleSlug, lesson: nextExerciseSlug},
          })
        : setDisplayOverlay(true)
    },
    [moduleSlug, nextExercise, router],
  )

  // initialize player state
  React.useEffect(() => {
    router.asPath.endsWith('/exercise')
      ? setDisplayOverlay(true)
      : setDisplayOverlay(false)
  }, [lesson, router.asPath])

  const playbackRate = getPlayerPrefs().playbackRate
  const playbackId = videoResource?.muxPlaybackId
  // preferences
  React.useEffect(() => {
    if (muxPlayerRef.current && playbackId) {
      setTimeout(() => {
        muxPlayerRef.current.playbackRate = playbackRate
        muxPlayerRef.current.autoplay = autoPlay
      }, 100)
    }
  }, [muxPlayerRef, playbackRate, autoPlay, playbackId])

  const canShowVideo = ability.can('view', 'Content')

  const onPlay = React.useCallback(() => {
    setDisplayOverlay(false)
    track('started lesson video', {
      module: module.slug.current,
      lesson: lesson.slug,
      moduleType: module.moduleType,
      lessonType: lesson._type,
    })
  }, [lesson._type, lesson.slug, module.moduleType, module.slug])

  const onEndedCallback = React.useCallback(async () => {
    exitFullscreen()
    handleNext(getPlayerPrefs().autoplay)
    track('completed lesson video', {
      module: module.slug.current,
      lesson: lesson.slug,
      moduleType: module.moduleType,
      lessonType: lesson._type,
    })
    return onEnded()
  }, [
    getPlayerPrefs,
    handleNext,
    lesson._type,
    lesson.slug,
    module.moduleType,
    module.slug,
    onEnded,
  ])

  const onRateChange = React.useCallback(() => {
    setPlayerPrefs({
      playbackRate: muxPlayerRef.current?.playbackRate,
    })
  }, [muxPlayerRef, setPlayerPrefs])

  const setDisplayOverlayCallback = React.useCallback(
    (value: boolean) => {
      setDisplayOverlay(value)
    },
    [setDisplayOverlay],
  )

  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPlay,
      onPause: () => {},
      onEnded: onEndedCallback,
      onRateChange,
      defaultHiddenCaptions: true, // TODO: investigate storing subtitles preferences
      // autoPlay,
      streamType: 'on-demand',
      metadata: {
        video_title: `${title} (${lesson._type})`,
      },
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: setDisplayOverlayCallback,
    handlePlay,
    displayOverlay,
    nextExercise,
    nextExerciseStatus,
    nextSection,
    video: videoResource,
    path,
    canShowVideo,
    ability,
    loadingUserStatus,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
