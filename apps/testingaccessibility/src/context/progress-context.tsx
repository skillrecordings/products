import React from 'react'
import {
  getLessonProgressForUser,
  toggleLessonProgressForUser,
} from 'utils/progress'
import {LessonProgress} from '@prisma/client'
import {useSession} from 'next-auth/react'

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
  const [progress, setProgress] = React.useState<LessonProgress[]>([])
  const {status} = useSession()

  const fetchProgress = React.useCallback(async () => {
    if (status === 'authenticated') {
      const progress = await getLessonProgressForUser()
      setProgress(progress)
    }

    if (status !== 'loading') {
      setIsLoadingProgress(false)
    }
  }, [status])

  React.useEffect(() => {
    if (status === 'authenticated') {
      fetchProgress().catch(console.error)
    }
  }, [fetchProgress, status])

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
