import {type Module} from '../schemas/module'
import {type Section} from '../schemas/section'
import {type Exercise} from '../schemas/exercise'
import {type Lesson} from '../schemas/lesson'
import {type NextRouter} from 'next/router'

type ObjectUrl = Parameters<NextRouter['push']>[0]

export type NextPathBuilder =
  | undefined
  | ((options: {
      module: Module
      section: Section | null
      lesson: Lesson | null
    }) => ObjectUrl)

export const defaultHandleContinue = async ({
  router,
  module,
  section,
  nextExercise,
  handlePlay,
  path,
  nextPathBuilder,
}: {
  router: NextRouter
  module: Module
  section?: Section | null
  nextExercise?: Lesson | null
  handlePlay: () => void
  path: string
  nextPathBuilder?: NextPathBuilder
}) => {
  if (nextPathBuilder) {
    const routerOptions = nextPathBuilder({
      module,
      section: section || null,
      lesson: nextExercise || null,
    })

    return await router.push(routerOptions).then(() => handlePlay())
  }

  if (nextExercise?._type === 'solution') {
    if (section) {
      const exercise =
        section.lessons &&
        section.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        (await router
          .push({
            query: {
              module: module.slug.current,
              section: section.slug,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[section]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    } else {
      const exercise =
        module.lessons &&
        module.lessons.find((exercise: Exercise) => {
          const solution = exercise.solution
          return solution?._key === nextExercise._key
        })

      return (
        exercise &&
        (await router
          .push({
            query: {
              module: module.slug.current,
              lesson: exercise.slug,
            },

            pathname: `${path}/[module]/[lesson]/solution`,
          })
          .then(() => handlePlay()))
      )
    }
  }
  if (section) {
    return await router
      .push({
        query: {
          module: module.slug.current,
          section: section.slug,
          lesson: nextExercise?.slug,
        },
        pathname: `${path}/[module]/[section]/[lesson]`,
      })
      .then(() => handlePlay())
  } else {
    return await router
      .push({
        query: {module: module.slug.current, lesson: nextExercise?.slug},
        pathname: `${path}/[module]/[lesson]`,
      })
      .then(() => handlePlay())
  }
}
