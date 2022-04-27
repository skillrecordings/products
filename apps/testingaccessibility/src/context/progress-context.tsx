import React from 'react'
import {
  getLessonProgressForUser,
  toggleLessonProgressForUser,
} from 'utils/progress'
import {LessonProgress} from '@prisma/client'

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
  const [isLoadingProgress, setIsLoadingProgress] =
    React.useState<boolean>(true)
  const [progress, setProgress] = React.useState<any>()

  const fetchProgress = React.useCallback(async () => {
    const progress = await getLessonProgressForUser()
    setProgress(progress)
    setIsLoadingProgress(false)
  }, [])

  React.useEffect(() => {
    fetchProgress().catch(console.error)
  }, [fetchProgress])

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isLoadingProgress,
        toggleLessonComplete: async (slug: string) => {
          await toggleLessonProgressForUser({slug}).then(() => fetchProgress())
        },
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
