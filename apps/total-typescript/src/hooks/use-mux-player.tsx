import React from 'react'
import get from 'lodash/get'
import {usePlayerPrefs} from './use-player-prefs'
import {getNextExercise} from 'utils/get-next-exercise'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {type Exercise, ExerciseSchema} from 'lib/exercises'
import {type Tip, TipSchema} from 'lib/tips'
import {useConvertkit} from './use-convertkit'
import {AppAbility, createAppAbility} from 'ability/ability'
import {useSession} from 'next-auth/react'
import {trpc} from '../utils/trpc'
import {getNextSection} from 'utils/get-next-section'

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
  nextSection: SanityDocument
  lesson: VideoResource
  module: SanityDocument
  path: string
  video?: {muxPlaybackId: string | null | undefined}
  canShowVideo: boolean
  loadingUserStatus: boolean
  ability: AppAbility
  section?: SanityDocument
}

export const VideoContext = React.createContext({} as VideoContextType)

type VideoProviderProps = {
  module: SanityDocument
  lesson: VideoResource
  exerciseSlug?: string
  section?: SanityDocument
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
  section,
  exerciseSlug,
}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const {data: userSession, status} = useSession()
  const nextExercise = getNextExercise({
    module,
    section,
    currentLesson: lesson as Exercise,
  })

  const nextSection = section
    ? getNextSection({
        module,
        currentSection: section,
      })
    : null

  // load ability rules async
  // this is kind of bananas because the "lesson" in
  // this context can be an exercise, solution, or tip
  // so access control is approached differently
  // and we need to be able to robustly check for access
  // while understanding what the actual thing
  // being displayed **is**
  const {data: abilityRules, status: abilityRulesStatus} = trpc.useQuery([
    'workshops.verifyAccess',
    {
      moduleSlug: module.slug.current,
      moduleType: module.moduleType,
      lessonSlug: exerciseSlug,
      sectionSlug: section?.slug,
      isSolution: lesson._type === 'solution',
    },
  ])

  const ability = createAppAbility(abilityRules || [])

  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const video = {muxPlaybackId: lesson.muxPlaybackId}
  const title = get(lesson, 'title') || get(lesson, 'label')
  const loadingUserStatus =
    loadingSubscriber ||
    status === 'loading' ||
    abilityRulesStatus === 'loading'

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
            pathname: '/[module]/[exercise]',
            query: {module: moduleSlug, exercise: nextExerciseSlug},
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
      muxPlayerRef.current.autoplay = autoPlay
    }
  }, [subscriber, muxPlayerRef, playbackRate, autoPlay, video])

  const canShowVideo = ability.can('view', 'Content')

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
    },
    autoPlay,
    setAutoPlay,
    setPlayerPrefs,
    setDisplayOverlay: (value: boolean) => setDisplayOverlay(value),
    handlePlay,
    displayOverlay,
    nextExercise,
    nextSection,
    lesson:
      lesson._type === 'tip'
        ? TipSchema.parse(lesson)
        : ExerciseSchema.parse(lesson),
    section,
    module,
    video,
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
