import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import capitalize from 'lodash/capitalize'
import DesktopExerciseSidebar from '../desktop-exercise-sidebar'

export const MobileLessonNavigator: React.FC<{
  module: SanityDocument
  section?: SanityDocument
  path: string
}> = ({module, path, section}) => {
  return (
    <details className="group block border-t-2 border-gray-900 lg:hidden">
      <summary className="no-marker flex cursor-pointer items-center gap-1 bg-black/50 px-4 py-3 font-medium transition marker:content-[''] after:absolute after:right-3 after:flex after:h-6 after:w-6 after:rotate-180 after:items-center after:justify-center after:rounded-full after:bg-gray-800 after:text-lg after:content-['↑'] group-open:after:rotate-0 hover:bg-gray-800">
        {module.title} {capitalize(module.moduleType)}{' '}
        <span className="opacity-80">
          ({section ? section.exercises.length : module.exercises.length}{' '}
          exercises)
        </span>
      </summary>
      <DesktopExerciseSidebar module={module} path={path} section={section} />
    </details>
  )
}
