import React from 'react'
import {
  getLessonProgressForUser,
  toggleLessonProgressForUser,
} from 'utils/progress'
import type {LessonProgress} from '@prisma/client'
import {useSession} from 'next-auth/react'
import {useQuery} from 'react-query'
import {last} from 'lodash'

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

function useLoadProgress() {
  const {status: sessionStatus} = useSession()

  const {
    data,
    status: loadingProgressStatus,
    refetch,
  } = useQuery(['load progress', sessionStatus], async ({queryKey}) => {
    if (last(queryKey) === 'authenticated') {
      return await getLessonProgressForUser()
    } else {
      return []
    }
  })

  return {
    progress: data,
    status: loadingProgressStatus,
    refetch,
  }
}

export const ProgressProvider: React.FC = ({children}) => {
  const {progress, status, refetch} = useLoadProgress()
  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoadingProgress: status === 'loading',
        toggleLessonComplete: async (slug: string) => {
          return await toggleLessonProgressForUser({slug}).finally(refetch)
        },
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
