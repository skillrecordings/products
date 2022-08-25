import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import LessonNavigator from './lesson-navigator'

type SidebarProps = {
  course: SanityDocument
}
const LessonSidebar: React.FC<SidebarProps> = ({course}) => {
  return (
    <>
      <div
        className="bg-slate-900 lg:max-w-xs w-full border-r border-gray-800"
        aria-hidden="true"
      />
      <nav className="bg-slate-900 lg:max-w-xs w-full lg:fixed top-0  border-r border-gray-800">
        <div>
          <div className="flex items-center gap-5 px-3 lg:pt-16 pt-5 pb-2 bg-blue-600">
            <img src={course.image} className="w-20" />
            <h1 className="text-xl font-bold leading-tight font-text">
              <Link
                href={{pathname: '/[course]', query: {course: course.slug}}}
                passHref
              >
                <a>{course.title}</a>
              </Link>
            </h1>
          </div>
          <h3 className="pt-5 pb-2 text-sm opacity-80 font-semibold uppercase px-5">
            Lessons
          </h3>
          <LessonNavigator course={course} />
        </div>
      </nav>
    </>
  )
}

export default LessonSidebar
