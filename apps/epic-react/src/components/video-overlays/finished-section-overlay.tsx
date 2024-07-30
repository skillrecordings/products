import * as React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import first from 'lodash/first'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {CodeIcon} from '@heroicons/react/solid'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Link from 'next/link'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useSession} from 'next-auth/react'
import Balancer from 'react-wrap-balancer'
import {Button} from '@skillrecordings/ui'
import {Progress} from './components/progress'
import {
  OverlayWrapper,
  ModuleCtaProvider,
  CompleteAndContinueButton,
} from '@skillrecordings/skill-lesson/video/video-overlays'
import {useModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'
import LessonCompleteToggle from '@/components/lesson-completion-toggle'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'

export const FinishedSectionOverlay = () => {
  const {nextSection, handlePlay, setDisplayOverlay} = useMuxPlayer()
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {image} = module
  const nextExercise = first(nextSection?.lessons) as Lesson
  const moduleProgress = useModuleProgress()

  const [completedLessonCount, setCompletedLessonCount] =
    React.useState<number>(moduleProgress?.completedLessonCount || 0)

  const session = useSession()

  return (
    // keeping "default" variant here so we don't have to style it twice
    <OverlayWrapper data-video-overlay="default">
      <ModuleCtaProvider>
        {image && (
          <Image
            data-image=""
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
            priority
          />
        )}
        <p data-title="">
          <Balancer>
            <span data-byline="">Up next:</span> {nextSection?.title}
          </Balancer>
        </p>
        {moduleProgress && session.status === 'authenticated' && (
          <div data-progress="">
            <Progress
              value={(completedLessonCount / moduleProgress?.lessonCount) * 100}
              className="h-2 bg-blue-500"
            />
            <div data-lessons-completed="">
              {completedLessonCount} / {moduleProgress?.lessonCount} lessons
              completed
            </div>
          </div>
        )}
        <div>
          <LessonCompleteToggle className="text-md my-4 bg-white text-white hover:bg-er-gray-300 disabled:pointer-events-none disabled:opacity-50 dark:bg-er-gray-200 dark:hover:bg-er-gray-300" />
          <div>
            {/* <button
              data-action="replay"
              onClick={() => {
                track('clicked replay', {
                  lesson: lesson.slug,
                  module: module.slug.current,
                  location: 'exercise',
                  moduleType: module.moduleType,
                  lessonType: lesson._type,
                })
                setDisplayOverlay(false)
                handlePlay()
              }}
            >
              <span data-icon="" aria-hidden="true">
                ↺
              </span>{' '}
              Replay Video
            </button> */}
            {lesson._type === 'solution' && (
              <Link
                data-action="try-again"
                className="mx-auto flex h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                href={router.asPath.replace('solution', 'exercise')}
              >
                <CodeIcon
                  data-icon=""
                  aria-hidden="true"
                  className="w-5 font-normal"
                />
                Back to Exercise
              </Link>
            )}
          </div>
        </div>
        {session.status === 'unauthenticated' && (
          <div data-login>
            <Link href="/login">Log in</Link> to track your progress.
          </div>
        )}
      </ModuleCtaProvider>
    </OverlayWrapper>
  )
}
