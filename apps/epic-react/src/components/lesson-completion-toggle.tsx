import React from 'react'
import {motion} from 'framer-motion'
import {useReward} from 'react-rewards'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useRouter} from 'next/router'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import toast from 'react-hot-toast'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'
import Spinner from '@/components/spinner'

const LessonCompleteToggle = ({className}: {className?: string}) => {
  const {module, section, lesson} = useLesson()
  const flattenedLessons = module.sections?.flatMap(
    (section) => section.lessons,
  )
  const currentLessonIndex =
    flattenedLessons?.findIndex((l) => l?.slug === lesson.slug) ?? 0
  const router = useRouter()
  const {reward} = useReward('rewardId', 'confetti')
  const lessonSlug = router.query.lesson
  const {
    data: moduleProgress,
    status: moduleProgressStatus,
    isFetching,
  } = trpcSkillLessons.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })
  const moduleCompleted = moduleProgress?.moduleCompleted

  const toggleProgressMutation = trpcSkillLessons.progress.toggle.useMutation()
  const completedLessons = moduleProgress?.lessons.filter(
    (l: any) => l.lessonCompleted,
  )

  // cannot use id because lesson from useLesson returns solution resource when on solution page

  const [isLessonCompleted, setIsLessonCompleted] = React.useState(false)

  const [isProgressSaving, setIsProgressSaving] = React.useState(false)

  const [optimisticallyToggled, setOptimisticallyToggled] = React.useState(
    isLessonCompleted || false,
  )

  React.useEffect(() => {
    setIsLessonCompleted(
      Boolean(
        completedLessons?.find(({id, slug}: any) => slug === lessonSlug),
      ) || optimisticallyToggled,
    )
  }, [completedLessons, lessonSlug, optimisticallyToggled])

  React.useEffect(() => {
    moduleProgressStatus === 'success' &&
      setOptimisticallyToggled(isLessonCompleted)
  }, [moduleProgressStatus, isLessonCompleted, lessonSlug])

  const handleToggleLessonProgress = async () => {
    setOptimisticallyToggled(!optimisticallyToggled)
    setIsProgressSaving(true)

    if (!optimisticallyToggled && !isLessonCompleted) reward()

    return await toggleProgressMutation.mutateAsync(
      {
        lessonSlug: lessonSlug as string,
        moduleId: module._id,
      },
      {
        onSuccess: (data) => {
          setIsProgressSaving(false)
          setOptimisticallyToggled(false)

          const {progress, moduleProgress: moduleProgressLessonComplete} = data
          if (
            moduleProgressLessonComplete &&
            'moduleCompleted' in moduleProgressLessonComplete &&
            moduleProgressLessonComplete.moduleCompleted
          ) {
            router.push(`/modules/${module.slug.current}/completed`)
          } else if (
            progress?.completedAt &&
            flattenedLessons &&
            flattenedLessons[currentLessonIndex + 1]
          ) {
            if (moduleProgress?.moduleType === 'tutorial') {
              router.push(
                `/${moduleProgress?.moduleType}s/${module.slug.current}/${
                  section?.slug
                }/${flattenedLessons[currentLessonIndex + 1]?.slug}`,
              )
            } else {
              router.push(
                `/modules/${module.slug.current}/${
                  flattenedLessons[currentLessonIndex + 1]?.slug
                }`,
              )
            }
          }
        },
        onError: (error: any) => {
          setIsProgressSaving(false)
          setOptimisticallyToggled((value) => !value)
          toast.error(`Error setting lesson progress.`)
          console.debug(error.message)
        },
      },
    )
  }

  return (
    <div>
      <div
        className={twMerge(
          cx(
            'mx-auto flex items-center rounded-lg bg-emerald-600 px-5 py-2 text-sm hover:bg-emerald-600',
            {
              ['w-fit rounded-full bg-emerald-600 p-1 hover:bg-emerald-700 sm:px-2 sm:py-2']:
                isLessonCompleted,
            },
            className,
          ),
        )}
      >
        <motion.button
          type="button"
          className={`relative m-0 flex h-[46px] cursor-pointer items-center justify-center overflow-hidden leading-7 transition-colors duration-200 ease-in-out`}
          animate={{
            width: isLessonCompleted ? 46 : '100%',
            borderRadius: isLessonCompleted ? 23 : 8,
          }}
          initial={false}
          id="rewardId"
          onClick={handleToggleLessonProgress}
          disabled={isProgressSaving}
        >
          <div className="mt-0 flex w-full cursor-pointer items-center justify-center font-semibold text-white">
            {isLessonCompleted && isProgressSaving ? (
              <Spinner className="absolute h-5 w-5 text-white" />
            ) : (
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inline-block"
                animate={{
                  y: isLessonCompleted ? 0 : 60,
                }}
                initial={false}
              >
                <g fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </motion.svg>
            )}
            <motion.div
              className=" text-md whitespace-no-wrap mt-0 flex shrink-0 cursor-pointer items-center justify-center"
              animate={{
                y: isLessonCompleted ? -70 : 0,
                opacity: isLessonCompleted ? 0 : 1,
              }}
              initial={false}
            >
              Complete and Continue
              {/* prettier-ignore */}
              <svg className="ml-2" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            </motion.div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

export default LessonCompleteToggle
