import * as React from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {useRouter} from 'next/router'
import {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
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
import {getNextSection, isNextSectionEmpty} from '../utils/get-next-section'
import {type AppAbility, createAppAbility} from '../utils/ability'
import {type Lesson} from '../schemas/lesson'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useConvertkit} from './use-convertkit'
import {useGlobalPlayerShortcuts} from './use-global-player-shortcut'
import {type Section} from '../schemas/section'
import {
  defaultHandleContinue,
  NextPathBuilder,
} from '../video/default-handle-continue'
import {handlePlayFromBeginning as defaultHandlePlayFromBeginning} from '../utils/handle-play-from-beginning'
import {type NextRouter} from 'next/router'
import {type Module} from '../schemas/module'

const DEBUG_OVERLAYS = false

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
  nextPathBuilder?: NextPathBuilder
  inviteTeamPagePath?: string
  video?: {muxPlaybackId?: string}
  canShowVideo: boolean
  refetchAbility: () => void
  loadingUserStatus: boolean
  ability: AppAbility
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  handleContinue: (options: {
    router: NextRouter
    module: Module
    section?: Section | null
    nextExercise?: Lesson | null
    handlePlay: () => void
    path: string
    nextPathBuilder?: NextPathBuilder
  }) => Promise<any>
  handlePlayFromBeginning: (options: {
    router: NextRouter
    section?: Section
    module: Module
    path: string
    handlePlay: () => void
  }) => Promise<any>
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  accentColor?: string
  theme?: MuxPlayerProps['theme']
  exerciseSlug?: string
  path?: string
  nextPathBuilder?: NextPathBuilder
  inviteTeamPagePath?: string
  muxPlayerRef: React.RefObject<MuxPlayerRefAttributes>
  onEnded?: () => Promise<any>
  onModuleEnded?: () => Promise<any>
  onModuleStarted?: () => Promise<any>
  handleContinue?: (options: {
    router: NextRouter
    module: Module
    section?: Section | null
    nextExercise?: Lesson | null
    handlePlay: () => void
    path: string
    nextPathBuilder?: NextPathBuilder
  }) => Promise<any>
  handlePlayFromBeginning?: (options: {
    router: NextRouter
    section?: Section
    module: Module
    path: string
    handlePlay: () => void
  }) => Promise<any>
}

export const VideoProvider: React.FC<
  React.PropsWithChildren<VideoProviderProps>
> = ({
  muxPlayerRef,
  children,
  accentColor = '#3b82f6',
  theme,
  path = '',
  nextPathBuilder,
  onEnded = async () => {},
  onModuleEnded = async () => {},
  onModuleStarted = async () => {},
  handleContinue = defaultHandleContinue,
  handlePlayFromBeginning = defaultHandlePlayFromBeginning,
  exerciseSlug,
  inviteTeamPagePath,
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

  const isNextSectionWip = isNextSectionEmpty({module, currentSection: section})

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
  const isFirstLessonInModule =
    (module.lessons && module.lessons[0].slug === lesson.slug) ||
    (section?.lessons && section?.lessons[0]?.slug === lesson.slug)

  const onEndedCallback = React.useCallback(async () => {
    exitFullscreen()
    handleNext()
    track('completed lesson video', {
      module: module.slug.current,
      lesson: lesson.slug,
      moduleType: module.moduleType,
      lessonType: lesson._type,
    })

    if (isFirstLessonInModule && onModuleStarted) {
      await onModuleStarted()
    }

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
      setDisplayOverlay(DEBUG_OVERLAYS ? true : false)
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
      thumbnailTime: 0,
      onLoadedData: handleUserPreferences,
      playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
      accentColor,
      maxResolution: '2160p',
      theme,
      minResolution: '540p',
    } as MuxPlayerProps,
    setPlayerPrefs,
    setDisplayOverlay: setDisplayOverlayCallback,
    handlePlay,
    displayOverlay,
    nextExercise,
    nextExerciseStatus,
    nextSection: isNextSectionWip ? null : nextSection,
    video: videoResource,
    path,
    nextPathBuilder,
    canShowVideo,
    refetchAbility,
    ability,
    loadingUserStatus,
    muxPlayerRef,
    handleContinue,
    handlePlayFromBeginning,
    inviteTeamPagePath,
  }
  return (
    <VideoContext.Provider value={context}>{children}</VideoContext.Provider>
  )
}

export const useMuxPlayer = () => {
  const muxVideoContext = React.useContext(VideoContext)

  return muxVideoContext
}
