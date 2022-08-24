import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'

const LessonNavigator: React.FC<{course: SanityDocument}> = ({course}) => {
  const router = useRouter()
  return (
    <nav aria-label="lesson navigaor">
      <ul className="text-lg flex flex-col divide-y divide-black/20">
        {course.resources.map((resource: any, i: number) => {
          const isActive = router.asPath.includes(resource.slug)
          if (resource._type === 'section') {
            const section = resource
            return (
              <li key={resource.slug}>
                <div className="px-4 font-semibold pb-2">
                  <span aria-hidden="true" className="text-sm pr-2 opacity-50">
                    {i + 1}
                  </span>{' '}
                  {section.title}
                </div>
                <ul>
                  {section.resources.map((lesson: any, i: number) => {
                    const isActive = router.query.lesson === lesson.slug
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={{
                            pathname: '/[course]/[lesson]',
                            query: {
                              course: course.slug,
                              lesson: lesson.slug,
                            },
                          }}
                          passHref
                        >
                          <a
                            className={cx(
                              'flex items-center py-3 px-7 border-l-4 text-base font-medium hover:bg-slate-400/20',
                              {
                                'border-indigo-500 bg-white/10': isActive,
                                'border-transparent bg-white/5': !isActive,
                              },
                            )}
                          >
                            {capitalize(lesson.type)}
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
            return (
              <li>
                <Link
                  href={{
                    pathname: '/[course]/[lesson]',
                    query: {course: course.slug, lesson: lesson.slug},
                  }}
                  passHref
                >
                  <a
                    className={cx(
                      'flex items-center py-3 px-5 border-l-4 text-base font-medium hover:bg-slate-400/20',
                      {
                        'border-indigo-500 bg-white/10': isActive,
                        'border-transparent bg-white/5': !isActive,
                      },
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="text-sm pr-4 opacity-50"
                    >
                      {i + 1}
                    </span>{' '}
                    {lesson.type}
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
