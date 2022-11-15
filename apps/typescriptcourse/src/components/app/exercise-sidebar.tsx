import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import ExerciseNavigator from './exercise-navigator'
import cx from 'classnames'
import Image from 'next/image'

type SidebarProps = {
  module: SanityDocument
  section?: SanityDocument
  path: string
  className?: string
}
const ExerciseSidebar: React.FC<SidebarProps> = ({
  module,
  section,
  path = '',
  className,
}) => {
  return (
    <>
      <div
        className={cx(
          'relative z-50 w-full shadow-xl shadow-gray-500/10 lg:max-w-[280px] xl:max-w-xs',
          className,
        )}
      >
        <div className="top-0 border-r lg:sticky">
          <aside>
            <div className="z-10 h-[180px] lg:h-[140px]">
              <div className="relative flex items-center gap-5 border-t  px-3 py-2 shadow-xl shadow-gray-500/5">
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
                  <Link href={`/${module.moduleType}s`}>
                    <a className="font-mono text-xs font-semibold uppercase text-gray-600 hover:underline">
                      {module.moduleType}s
                    </a>
                  </Link>
                  <span className="pl-1 text-xs text-gray-400">/</span>
                  <h2 className="w-full font-heading text-lg font-bold leading-none">
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
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                Lessons
              </p>
            </div>

            <ExerciseNavigator module={module} path={path} section={section} />
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default ExerciseSidebar
