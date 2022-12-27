import React from 'react'
import get from 'lodash/get'
import {usePlayerPrefs} from './use-player-prefs'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import {MuxPlayerProps} from '@mux/mux-player-react/*'
import {track} from '../utils/analytics'
import {type Tip, TipSchema} from 'lib/tips'
import {useConvertkit} from './use-convertkit'
import {AppAbility, createAppAbility} from 'ability/ability'
import {trpc} from '../utils/trpc'
import {getNextSection} from 'utils/get-next-section'
import {LessonResource, LessonResourceSchema} from '../lib/lesson-resources'
import {useVideoResource} from '../video/use-video-resource'

type VideoResource = LessonResource | Tip

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

const useNextLesson = (
  lesson: VideoResource,
  module: SanityDocument,
  section?: SanityDocument,
) => {
  const router = useRouter()
  const {data: nextExercise} = trpc.lessons.getNextLesson.useQuery({
    type: lesson._type,
    slug: router.query.exercise as string,
    module: module.slug.current,
    section: section?.slug,
  })
  return nextExercise
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
  const {videoResource, loadingVideoResource} = useVideoResource()
  const nextExercise = useNextLesson(lesson, module, section)

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
  const {data: abilityRules, status: abilityRulesStatus} =
    trpc.workshops.verifyAccess.useQuery({
      moduleSlug: module.slug.current,
      moduleType: module.moduleType,
      lessonSlug: exerciseSlug,
      sectionSlug: section?.slug,
      isSolution: lesson._type === 'solution',
    })

  const ability = createAppAbility(abilityRules || [])

  const {setPlayerPrefs, playbackRate, autoplay, getPlayerPrefs} =
    usePlayerPrefs()
  const [autoPlay, setAutoPlay] = React.useState(getPlayerPrefs().autoplay)
  const [displayOverlay, setDisplayOverlay] = React.useState(false)
  const title = get(lesson, 'title') || get(lesson, 'label')
  const loadingUserStatus =
    loadingSubscriber ||
    abilityRulesStatus === 'loading' ||
    loadingVideoResource

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
    if (muxPlayerRef.current && videoResource) {
      muxPlayerRef.current.playbackRate = playbackRate
      muxPlayerRef.current.autoplay = autoPlay
    }
  }, [subscriber, muxPlayerRef, playbackRate, autoPlay, videoResource])

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

  const currentPlaybackRate = muxPlayerRef.current?.playbackRate || 1
  const onRateChange = React.useCallback(() => {
    setPlayerPrefs({
      playbackRate: currentPlaybackRate,
    })
  }, [currentPlaybackRate, setPlayerPrefs])

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
    nextSection,
    lesson:
      lesson._type === 'tip'
        ? TipSchema.parse(lesson)
        : LessonResourceSchema.parse(lesson),
    section,
    module,
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
