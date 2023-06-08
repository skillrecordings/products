import {type NextRouter} from 'next/router'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'

export const customPlayFromBeginningHandler = async ({
  router,
  section,
  module,
  path,
  handlePlay = () => {},
}: {
  router: NextRouter
  section?: Section
  module: Module
  path: string
  handlePlay: () => void
}) => {
  return router
    .push({
      query: {
        lesson:
          module.sections &&
          module.sections[0].lessons &&
          module.sections[0].lessons[0].slug,
      },
      pathname: `${path}/lessons/[lesson]`,
    })
    .then(handlePlay)
}

export const customContinueHandler = async ({
  router,
  module,
  section,
  nextExercise,
  handlePlay,
  path,
}: {
  router: NextRouter
  module: Module
  section?: Section | null
  nextExercise?: Lesson | null
  handlePlay: () => void
  path: string
}) => {
  return await router
    .push({
      query: {lesson: nextExercise?.slug},
      pathname: `${path}/lessons/[lesson]`,
    })
    .then(() => handlePlay())
}
