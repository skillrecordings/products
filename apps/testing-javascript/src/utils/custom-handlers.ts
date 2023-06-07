import {type NextRouter, useRouter} from 'next/router'
import {type Section} from '@skillrecordings/skill-lesson/schemas/section'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {type Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'

// export const pathnameForPath = ({
//   section,
//   path,
// }: {
//   section?: Section
//   path: string
// }) => {
//   return section
//     ? `/${path}/[module]/[section]/[lesson]`
//     : `/${path}/[module]/[lesson]`
// }

// export const getRouteQuery = ({
//   section,
//   module,
// }: {
//   section?: Section
//   module: Module
// }) => {
//   return section
//     ? {
//         module: module.slug.current,
//         section: module.sections && module.sections[0].slug,
//         lesson:
//           module.sections &&
//           module.sections[0].lessons &&
//           module.sections[0].lessons[0].slug,
//       }
//     : {
//         module: module.slug.current,
//         lesson: module.lessons && module.lessons[0].slug,
//       }
// }
export const customPlayFromBeginningHandler = ({
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
  router
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
