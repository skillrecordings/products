import React from 'react'
import {type SanityDocument} from '@sanity/client'
import {type LessonResource} from '../schemas/lesson-resource'
import {Module, Section} from './use-progress'

type LessonContextType = {
  lesson: LessonResource
  section?: Section
  module: Module
}

export const LessonContext = React.createContext({} as LessonContextType)

type LessonProviderProps = {
  lesson: LessonResource
  module: Module
  section?: Section
  children: React.ReactNode
}

export const LessonProvider: React.FC<LessonProviderProps> = ({
  lesson,
  module,
  section,
  children,
}) => {
  const context = {
    lesson,
    module,
    section,
  }
  return (
    <LessonContext.Provider value={context}>{children}</LessonContext.Provider>
  )
}

export const useLesson = () => {
  const videoResourceContext = React.useContext(LessonContext)
  return videoResourceContext
}
