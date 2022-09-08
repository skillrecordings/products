import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'

const LessonNavigator: React.FC<{
  module: SanityDocument
  path: string
}> = ({module, path}) => {
  const router = useRouter()
  return (
    <nav aria-label="lesson navigator">
      <ul className="text-lg flex flex-col divide-y divide-gray-800/0">
        {module.resources.map((resource: any, sectionIdx: number) => {
          if (resource._type === 'section') {
            const section = resource
            return (
              <li key={resource.slug + `-${sectionIdx}`} className="pt-2">
                <Link
                  href={{
                    pathname: `${path}/[module]/[lesson]`,
                    query: {
                      module: module.slug,
                      lesson: section.resources[0].slug,
                    },
                  }}
                  passHref
                >
                  <a className="px-4 font-semibold py-2 hover:bg-gray-800 flex items-center">
                    <span
                      aria-hidden="true"
                      className="text-sm pr-3 opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {section.title}
                  </a>
                </Link>
                <ul>
                  {section.resources.map((lesson: any, i: number) => {
                    const isActive = router.query.lesson === lesson.slug
                    return (
                      <li key={lesson.slug + `-${i}`}>
                        <Link
                          href={{
                            pathname: `${path}/[module]/[lesson]`,
                            query: {
                              module: module.slug,
                              lesson: lesson.slug,
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
                          >
                            {capitalize(lesson.lessonType)}
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          }
          if (resource._type === 'lesson') {
            const lesson = resource
            const isActive = router.query.lesson === lesson.slug
            return (
              <li key={lesson.slug + `-${sectionIdx}`}>
                <Link
                  href={{
                    pathname: `${path}/[module]/[lesson]`,
                    query: {module: module.slug, lesson: lesson.slug},
                  }}
                  passHref
                >
                  <a
                    className={cx(
                      'flex items-center py-3 px-3 border-l-4 text-base font-medium hover:bg-slate-400/20',
                      {
                        'border-indigo-500 bg-white/10': isActive,
                        'border-transparent bg-white/5': !isActive,
                      },
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="text-sm pr-3 opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {capitalize(lesson.title)}
                  </a>
                </Link>
              </li>
            )
          }
        })}
      </ul>
    </nav>
  )
}
export default LessonNavigator
