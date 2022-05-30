import React from 'react'
import {
  getLessonProgressForUser,
  toggleLessonProgressForUser,
} from 'utils/progress'
import {LessonProgress} from '@prisma/client'
import {useSession} from 'next-auth/react'
import {useQuery} from 'react-query'

type ProgressContextType = {
  progress: LessonProgress[]
  isLoadingProgress: boolean
  toggleLessonComplete: (slug: string) => Promise<any>
}

const defaultProgressContext: ProgressContextType = {
  progress: [],
  isLoadingProgress: true,
  toggleLessonComplete: async () => {},
}

export function useProgress() {
  return React.useContext(ProgressContext)
}

export const ProgressContext = React.createContext(defaultProgressContext)

export const ProgressProvider: React.FC = ({children}) => {
  const {status} = useSession()

  const {
    data: progress,
    status: loadingProgressStatus,
    refetch,
  } = useQuery(['load progress', status], async () => {
    if (status === 'authenticated') {
      const progress = await getLessonProgressForUser()
      return progress
    } else {
      return []
    }
  })

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoadingProgress: loadingProgressStatus === 'loading',
        toggleLessonComplete: async (slug: string) => {
          return await toggleLessonProgressForUser({slug}).finally(refetch)
        },
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
