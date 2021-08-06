import get from 'lodash/get'
import filter from 'lodash/filter'
import find from 'lodash/find'
import {useLocalStorage} from 'react-use'
import useSWR from 'swr'
import axios from '../utils/axios'

const fetcher = (url: string) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/bundle/${url}/progress_v2?expand=section_resources`,
  )
}
const STORAGE_KEY = 'pure-react-progress-2021'

export const resourceIsCompleted = (resource: any) =>
  get(resource, 'state', 'unviewed') === 'completed'

const useBundleProgress = (bundle: any) => {
  const [progressDefault, writeStorage] = useLocalStorage(STORAGE_KEY)

  const url = bundle?.slug
  const swrKey = url ? [url] : null
  const {data}: any = useSWR(swrKey, fetcher, {
    revalidateOnMount: true,
    initialData: progressDefault,
    onSuccess: progress => writeStorage(progress),
  })

  const getModuleProgress = (slug: string) => {
    const currentProgress = find(get(data?.data, 'resources', []), {
      slug,
    })
    const completedLessonsCount = get(
      currentProgress,
      'completed_lesson_count',
      0,
    )
    const completedLessons = filter(
      get(currentProgress, 'resources', []),
      resource => resource.state === 'completed',
    )

    const totalLessons = get(currentProgress, 'lesson_count', 1)
    const percentComplete = Math.round(
      (completedLessonsCount / totalLessons) * 100,
    )

    const nextLesson = get(currentProgress, 'next_resource', null)

    const isModuleCompleted: boolean = completedLessonsCount === totalLessons
    const isModuleInProgress: boolean = completedLessonsCount !== 0

    return {
      // currentProgress,
      totalLessons,
      nextLesson,
      completedLessons,
      completedLessonsCount,
      percentComplete,
      isModuleCompleted,
      isModuleInProgress,
    }
  }
  return {
    progress: data,
    getModuleProgress,
  }
}

export default useBundleProgress
