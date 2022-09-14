import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {track} from '../utils/analytics'
import {Element, ScrollElement} from 'react-scroll'

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
            `/tutorials/${module.slug.current}/${exercise.slug.current}`

          return (
            <li key={exercise.slug.current + `-${sectionIdx}`} className="pt-2">
              <Element name={exercise.slug.current} />

              <Link
                href={{
                  pathname: `${path}/[module]/[exercise]`,
                  query: {
                    module: module.slug.current,
                    exercise: exercise.slug.current,
                  },
                }}
                passHref
              >
                <a
                  className="px-4 font-semibold py-2 hover:bg-gray-800 flex items-center leading-tight"
                  onClick={() => {
                    track('clicked exercise in navigator', {
                      module: module.slug.current,
                      lesson: exercise.slug.current,
                      moduleType: module.moduleType,
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
              <ul className="text-gray-300" id={isActive ? 'active' : ''}>
                <li key={exercise.slug.current + `exercise`}>
                  <Link
                    href={{
                      pathname: `${path}/[module]/[exercise]`,
                      query: {
                        module: module.slug.current,
                        exercise: exercise.slug.current,
                      },
                    }}
                    passHref
                  >
                    <a
                      className={cx(
                        'flex items-center py-2 px-8 border-l-4 text-base font-medium hover:bg-slate-400/20 hover:text-white transition',
                        {
                          'border-orange-400 bg-gray-800/80 text-white':
                            isActive,
                          'border-transparent ': !isActive,
                        },
                      )}
                      onClick={() => {
                        track(`clicked exercise in navigator`, {
                          module: module.slug.current,
                          lesson: exercise.slug.current,
                          location: router.query.lesson,
                          moduleType: module.moduleType,
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
                      `/tutorials/${module.slug.current}/${exercise.slug.current}/solution`
                    return (
                      <li key={solution._key}>
                        <Link
                          href={{
                            pathname: `${path}/[module]/[exercise]/solution`,
                            query: {
                              module: module.slug.current,
                              exercise: exercise.slug.current,
                            },
                          }}
                          passHref
                        >
                          <a
                            className={cx(
                              'flex items-center py-2 px-8 border-l-4 text-base font-medium hover:bg-slate-400/20 hover:text-white transition',
                              {
                                'border-cyan-400 bg-gray-800/80 text-white':
                                  isActive,
                                'border-transparent ': !isActive,
                              },
                            )}
                            onClick={() => {
                              track(`clicked solution in navigator`, {
                                module: module.slug.current,
                                lesson: exercise.slug.current,
                                moduleType: module.moduleType,
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
