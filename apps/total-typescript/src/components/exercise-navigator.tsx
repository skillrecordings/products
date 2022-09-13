import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {track} from '../utils/analytics'

const ExerciseNavigator: React.FC<{
  module: SanityDocument
  path: string
}> = ({module, path}) => {
  const router = useRouter()
  return (
    <nav aria-label="exercise navigator">
      <ul className="text-lg flex flex-col divide-y divide-gray-800/0">
        {module.exercises.map((exercise: any, sectionIdx: number) => {
          const isActive =
            router.asPath ===
            `/tutorials/${module.slug}/${exercise.slug.current}`

          return (
            <li key={exercise.slug + `-${sectionIdx}`} className="pt-2">
              <Link
                href={{
                  pathname: `${path}/[module]/[exercise]`,
                  query: {
                    module: module.slug,
                    exercise: exercise.slug.current,
                  },
                }}
                passHref
              >
                <a
                  className="px-4 font-semibold py-2 hover:bg-gray-800 flex items-center"
                  onClick={() => {
                    track('clicked exercise in navigator', {
                      module: module.slug,
                      lesson: exercise.slug.current,
                      moduleType: module._type,
                      lessonType: exercise._type,
                    })
                  }}
                >
                  <span aria-hidden="true" className="text-sm pr-3 opacity-50">
                    {sectionIdx + 1}
                  </span>{' '}
                  {exercise.label}
                </a>
              </Link>
              <ul>
                <li key={exercise.slug.current + `exercise`}>
                  <Link
                    href={{
                      pathname: `${path}/[module]/[exercise]`,
                      query: {
                        module: module.slug,
                        exercise: exercise.slug.current,
                      },
                    }}
                    passHref
                  >
                    <a
                      className={cx(
                        'flex items-center py-2 px-8 border-l-4 text-base font-medium hover:bg-slate-400/20',
                        {
                          'border-cyan-400 bg-gray-800/80': isActive,
                          'border-transparent ': !isActive,
                        },
                      )}
                      onClick={() => {
                        track(`clicked exercise in navigator`, {
                          module: module.slug,
                          lesson: exercise.slug.current,
                          location: router.query.lesson,
                          moduleType: module._type,
                          lessonType: exercise._type,
                        })
                      }}
                    >
                      Exercise
                    </a>
                  </Link>
                </li>
                {exercise.resources
                  .filter(
                    (resource: SanityDocument) => resource._type === 'solution',
                  )
                  .map((solution: any, i: number) => {
                    const isActive =
                      router.asPath ===
                      `/tutorials/${module.slug}/${exercise.slug.current}/solution`
                    return (
                      <li key={solution._key}>
                        <Link
                          href={{
                            pathname: `${path}/[module]/[exercise]/solution`,
                            query: {
                              module: module.slug,
                              exercise: exercise.slug.current,
                            },
                          }}
                          passHref
                        >
                          <a
                            className={cx(
                              'flex items-center py-2 px-8 border-l-4 text-base font-medium hover:bg-slate-400/20',
                              {
                                'border-cyan-400 bg-gray-800/80': isActive,
                                'border-transparent ': !isActive,
                              },
                            )}
                            onClick={() => {
                              track(`clicked ${solution._type} in navigator`, {
                                module: module.slug,
                                lesson: exercise.slug.current,
                                moduleType: module._type,
                                lessonType: exercise._type,
                              })
                            }}
                          >
                            {capitalize(solution._type)}
                          </a>
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export default ExerciseNavigator
