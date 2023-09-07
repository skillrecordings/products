import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'

const ExerciseOverlay = () => {
  const {module} = useLesson()

  const {github} = module

  return (
    <div className="flex aspect-video items-center justify-center bg-gray-950 text-white dark:bg-black/20">
      {github?.repo && (
        <div className="flex flex-col items-center space-y-5">
          <p className="font-text text-3xl font-bold">Now it’s your turn!</p>
          <p>
            Clone{' '}
            <a className="underline" href={github.repo} target="_blank" rel="noreferrer">
              this repository
            </a>{' '}
            with the Epic Web Workshop App and follow instructions in the{' '}
            <a
              className="underline"
              href={`${github.repo}#setup`}
              target="_blank" rel="noreferrer"
            >
              README
            </a>{' '}
            to complete the exercise.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Actions />
          </div>
        </div>
      )}
    </div>
  )
}

export default ExerciseOverlay

const Actions = () => {
  const {nextExercise, path, handlePlay, muxPlayerRef, handleContinue} =
    useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()

  return (
    <>
      <button
        className="rounded bg-gray-800 px-3 py-1 text-lg font-semibold transition hover:bg-gray-700 sm:px-5 sm:py-2"
        onClick={() => {
          track('clicked replay', {
            lesson: lesson.slug,
            module: module.slug.current,
            location: 'exercise',
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          if (router.asPath.endsWith('/exercise')) {
            router.push(router.asPath.replace('/exercise', ''))
            if (muxPlayerRef.current) {
              muxPlayerRef.current.currentTime = 0
            }
          }
          handlePlay()
        }}
      >
        <span aria-hidden="true">↺</span> Replay
      </button>
      {nextExercise && (
        <button
          className="rounded bg-cyan-600 px-3 py-1 text-lg font-semibold transition hover:bg-cyan-500 sm:px-5 sm:py-2"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue({
              router,
              module,
              nextExercise,
              handlePlay,
              path,
              section,
            })
          }}
        >
          Solution <span aria-hidden="true">→</span>
        </button>
      )}
    </>
  )
}
