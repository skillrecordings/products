import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {track} from '../utils/analytics'

const LessonNavigator: React.FC<{
  module: SanityDocument
  path: string
}> = ({module, path}) => {
  const router = useRouter()
  return (
    <nav aria-label="lesson navigator">
      <ul className="text-lg flex flex-col divide-y divide-gray-800/0">
        {module.exercises.map((resource: any, sectionIdx: number) => {
          const section = resource

          const isActive =
            router.asPath ===
            `/tutorials/${module.slug}/${section.slug.current}`

          return (
            <li key={resource.slug + `-${sectionIdx}`} className="pt-2">
              <Link
                href={{
                  pathname: `${path}/[module]/[lesson]`,
                  query: {
                    module: module.slug,
                    lesson: section.slug.current,
                  },
                }}
                passHref
              >
                <a
                  className="px-4 font-semibold py-2 hover:bg-gray-800 flex items-center"
                  onClick={() => {
                    track('clicked exercise in navigator', {
                      module: module.slug,
                      lesson: section.slug.current,
                    })
                  }}
                >
                  <span aria-hidden="true" className="text-sm pr-3 opacity-50">
                    {sectionIdx + 1}
                  </span>{' '}
                  {section.label}
                </a>
              </Link>
              <ul>
                <li key={section.slug.current + `exercise`}>
                  <Link
                    href={{
                      pathname: `${path}/[module]/[lesson]`,
                      query: {
                        module: module.slug,
                        lesson: section.slug.current,
                        location: router.query.lesson,
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
                          lesson: section.slug.current,
                          location: router.query.lesson,
                        })
                      }}
                    >
                      Exercise
                    </a>
                  </Link>
                </li>
                {section.resources
                  .filter(
                    (resource: SanityDocument) => resource._type === 'solution',
                  )
                  .map((solution: any, i: number) => {
                    const isActive =
                      router.asPath ===
                      `/tutorials/${module.slug}/${resource.slug.current}/solution`
                    return (
                      <li key={solution._key}>
                        <Link
                          href={{
                            pathname: `${path}/[module]/[lesson]/solution`,
                            query: {
                              module: module.slug,
                              lesson: section.slug.current,
                              location: router.query.lesson,
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
                                lesson: section.slug.current,
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
export default LessonNavigator
