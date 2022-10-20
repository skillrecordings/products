import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import LessonNavigator from './lesson-navigator'
import cx from 'classnames'
import Image from 'next/image'

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
        className={cx(
          'relative z-50 w-full lg:max-w-[280px] xl:max-w-xs',
          className,
        )}
      >
        <div className="top-0 border-r border-gray-800 lg:sticky bg-gray-800">
          <aside>
            <div className="top-0 z-10 h-[180px] bg-gradient-to-t from-transparent via-gray-900 to-gray-900 lg:sticky">
              <div className="relative flex items-center gap-5 border-b border-gray-800 bg-gray-900 px-3 py-1">
                {module?.image && (
                  <Image
                    src={module.image}
                    width={120}
                    height={120}
                    alt={module.title}
                    quality={100}
                    className="relative z-10"
                  />
                )}
                <div className="relative z-10 -translate-y-0.5">
                  <Link href="/tutorials">
                    <a className="font-mono text-xs font-semibold uppercase  hover:underline">
                      {module.moduleType}s
                    </a>
                  </Link>
                  <span className="pl-1 text-xs ">/</span>
                  <h2 className="w-full text-2xl font-semibold leading-none text-white">
                    <Link
                      href={{
                        pathname: `${path}/[module]`,
                        query: {module: module.slug.current},
                      }}
                      passHref
                    >
                      <a className="hover:underline">{module.title}</a>
                    </Link>
                  </h2>
                </div>
              </div>
              <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-white">
                Lessons
              </p>
            </div>
            <LessonNavigator module={module} path={path} />
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-gray-900 to-transparent" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default LessonSidebar
