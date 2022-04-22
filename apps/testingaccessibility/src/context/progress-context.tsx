import {first, get} from 'lodash'
import React from 'react'
import {getProgressForUser, setProgressForUser} from 'utils/progress'

type ProgressContextType = {
  completedLessons: string[]
  isLoading: boolean
  toggleLessonComplete: (slug: string) => Promise<any>
}

const defaultProgressContext: ProgressContextType = {
  completedLessons: [],
  isLoading: true,
  toggleLessonComplete: async () => {},
}

export function useProgress() {
  return React.useContext(ProgressContext)
}

export const ProgressContext = React.createContext(defaultProgressContext)

export const ProgressProvider: React.FC = ({children}) => {
  const [loadingProgress, setLoadingProgress] = React.useState<boolean>(true)
  const [progress, setProgress] = React.useState<any>()

  const fetchProgress = React.useCallback(async () => {
    const progress = await getProgressForUser()
    setProgress(get(first(progress), 'completed'))
    setLoadingProgress(false)
  }, [])

  React.useEffect(() => {
    fetchProgress().catch(console.error)
  }, [fetchProgress])

  return (
    <ProgressContext.Provider
      value={{
        completedLessons: progress,
        isLoading: loadingProgress,
        toggleLessonComplete: (slug: string) => {
          return new Promise((resolve) => {
            setProgressForUser({slug}).then(() => {
              fetchProgress()
                .catch(console.error)
                .then(() => {
                  resolve(true)
                })
            })
          })
        },
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
