import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import LessonNavigator from './lesson-navigator'
import cx from 'classnames'

type SidebarProps = {
  module: SanityDocument
  path: string
  className?: string
}
const LessonSidebar: React.FC<SidebarProps> = ({
  module,
  path = '',
  className,
}) => {
  return (
    <>
      <div
        className="bg-slate-900 lg:max-w-xs w-full border-r border-gray-800"
        aria-hidden="true"
      />
      <nav
        className={cx(
          'bg-slate-900 lg:max-w-xs lg:fixed  w-full top-0 border-r border-gray-800',
          className,
        )}
      >
        <div>
          <div className="flex items-center gap-5 px-3 lg:pt-16 pt-2 pb-2 bg-blue-600">
            {module?.image && <img src={module.image} className="w-20" />}
            <div>
              <Link href="/tutorials">
                <a className="uppercase text-sm font-semibold opacity-80 hover:underline">
                  {module.moduleType}s<span className="pl-1">/</span>
                </a>
              </Link>
              <h1 className="text-2xl font-bold leading-tight font-text">
                <Link
                  href={{
                    pathname: `${path}/[module]`,
                    query: {module: module.slug},
                  }}
                  passHref
                >
                  <a className="hover:underline">{module.title}</a>
                </Link>
              </h1>
            </div>
          </div>
          <h3 className="pt-5 pb-2 text-sm opacity-80 font-semibold uppercase px-5">
            Lessons
          </h3>
          <LessonNavigator module={module} path={path} />
        </div>
      </nav>
    </>
  )
}

export default LessonSidebar
