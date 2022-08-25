import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import LessonNavigator from './lesson-navigator'

type SidebarProps = {
  module: SanityDocument
}
const LessonSidebar: React.FC<SidebarProps> = ({module}) => {
  return (
    <>
      <div
        className="bg-slate-900 lg:max-w-xs w-full border-r border-gray-800"
        aria-hidden="true"
      />
      <nav className="bg-slate-900 lg:max-w-xs w-full lg:fixed top-0  border-r border-gray-800">
        <div>
          <div className="flex items-center gap-5 px-3 lg:pt-16 pt-5 pb-2 bg-blue-600">
            {module?.image && <img src={module.image} className="w-20" />}
            <h1 className="text-xl font-bold leading-tight font-text">
              <Link
                href={{pathname: '/[module]', query: {module: module.slug}}}
                passHref
              >
                <a>{module.title}</a>
              </Link>
            </h1>
          </div>
          <h3 className="pt-5 pb-2 text-sm opacity-80 font-semibold uppercase px-5">
            Lessons
          </h3>
          <LessonNavigator module={module} />
        </div>
      </nav>
    </>
  )
}

export default LessonSidebar
