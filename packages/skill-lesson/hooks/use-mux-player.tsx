import React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {useRouter} from 'next/router'
import {
  MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react/*'
import {useVideoResource} from './use-video-resource'
import {useLesson} from './use-lesson'
import {useNextLesson} from './use-next-lesson'
import {track} from '../utils/analytics'
import {
  handleTextTrackChange,
  setPreferredPlaybackRate,
  setPreferredTextTrack,
  usePlayerPrefs,
} from './use-player-prefs'
import {getNextSection} from '../utils/get-next-section'
import {type AppAbility, createAppAbility} from '../utils/ability'
import {Lesson} from '../schemas/lesson'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useConvertkit} from './use-convertkit'
import {useGlobalPlayerShortcuts} from './use-global-player-shortcut'
import {Section} from '../schemas/section'

type VideoContextType = {
  muxPlayerProps: MuxPlayerProps | any
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
  refetchAbility: () => void
  loadingUserStatus: boolean
  ability: AppAbility
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  exerciseSlug?: string
  path?: string
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  onEnded?: () => Promise<any>
  onModuleEnded?: () => Promise<any>
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({
  muxPlayerRef,
  children,
  path = '',
  onEnded = async () => {},
  onModuleEnded = async () => {},
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

  const {
    data: abilityRules,
    status: abilityRulesStatus,
    refetch: refetchAbility,
  } = trpcSkillLessons.modules.rules.useQuery({
    moduleSlug: module.slug.current,
    moduleType: module.moduleType,
    lessonSlug: exerciseSlug,
    sectionSlug: section?.slug,
    isSolution: lesson._type === 'solution',
    convertkitSubscriberId: subscriber?.id,
  })

  const ability = createAppAbility(abilityRules || [])

  const canShowVideo = ability.can('view', 'Content')

  const {setPlayerPrefs} = usePlayerPrefs()

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

  const handleNext = React.useCallback(async () => {
    if (lesson._type === 'exercise' && !router.asPath.endsWith('/exercise')) {
      await router.push(router.asPath + '/exercise').then(() => {})
    }
    setDisplayOverlay(true)
  }, [lesson._type, router])

  const onPlay = React.useCallback(() => {
    setDisplayOverlay(false)
    track('started lesson video', {
      module: module.slug.current,
      lesson: lesson.slug,
      moduleType: module.moduleType,
      lessonType: lesson._type,
    })
  }, [lesson._type, lesson.slug, module.moduleType, module.slug])

  const isModuleComplete =
    nextExerciseStatus !== 'loading' && !nextExercise && !nextSection

  const onEndedCallback = React.useCallback(async () => {
    exitFullscreen()
    handleNext()
    track('completed lesson video', {
      module: module.slug.current,
      lesson: lesson.slug,
      moduleType: module.moduleType,
      lessonType: lesson._type,
    })

    if (isModuleComplete && onModuleEnded) {
      await onModuleEnded()
    }
    return onEnded()
  }, [
    handleNext,
    lesson._type,
    lesson.slug,
    module.moduleType,
    module.slug,
    onEnded,
    onModuleEnded,
    isModuleComplete,
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

  // initialize player state
  React.useEffect(() => {
    if (router.asPath.endsWith('/exercise') && lesson) {
      muxPlayerRef.current && muxPlayerRef.current.pause()
      setDisplayOverlay(true)
    } else {
      setDisplayOverlay(false)
    }
  }, [lesson, router.asPath, muxPlayerRef])

  const handleUserPreferences = React.useCallback(() => {
    setPreferredPlaybackRate(muxPlayerRef)
    setPreferredTextTrack(muxPlayerRef)
    handleTextTrackChange(muxPlayerRef, setPlayerPrefs)
  }, [muxPlayerRef, setPlayerPrefs])

  const context = {
    muxPlayerProps: {
      id: 'mux-player',
      onPlay,
      onPause: () => {},
      onEnded: onEndedCallback,
      onRateChange,
      defaultHiddenCaptions: true,
      streamType: 'on-demand',
      metadata: {
        video_title: `${title} (${lesson._type})`,
      },
      onLoadedData: handleUserPreferences,
    } as MuxPlayerProps,
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
    refetchAbility,
    ability,
    loadingUserStatus,
    muxPlayerRef,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
