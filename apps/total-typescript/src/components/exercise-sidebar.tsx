import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import ExerciseNavigator from './exercise-navigator'
import cx from 'classnames'
import SimpleBar from 'simplebar-react'
import Image from 'next/image'
import {track} from '../utils/analytics'

type SidebarProps = {
  module: SanityDocument
  path: string
  className?: string
}
const ExerciseSidebar: React.FC<SidebarProps> = ({
  module,
  path = '',
  className,
}) => {
  return (
    <>
      <div
        className="bg-slate-900 xl:max-w-xs lg:max-w-[280px] w-full border-r border-gray-800"
        aria-hidden="true"
      />
      <aside
        className={cx(
          'bg-slate-900 xl:max-w-xs lg:max-w-[280px] lg:fixed  w-full top-0 border-r border-gray-800 lg:border-b border-b',
          className,
        )}
      >
        <SimpleBar className="relative lg:max-h-screen max-h-[580px] lg:pb-16">
          <div className="sticky top-0 z-10">
            <div className="flex items-center gap-5 px-3 lg:pt-4 pt-2 pb-2 bg-gray-900 border-b border-gray-800">
              {module?.image && (
                <Image
                  src={module.image}
                  width={110}
                  height={110}
                  alt={module.title}
                  quality={100}
                />
              )}
              <div>
                <Link href="/tutorials">
                  <a
                    className="uppercase text-xs font-mono font-semibold opacity-80 hover:underline"
                    onClick={() => {
                      track('clicked return to tutorials', {
                        module: module.slug.current,
                      })
                    }}
                  >
                    {module.moduleType}s<span className="pl-1">/</span>
                  </a>
                </Link>
                <h2 className="text-3xl font-semibold leading-tight">
                  <Link
                    href={{
                      pathname: `${path}/[module]`,
                      query: {module: module.slug.current},
                    }}
                    passHref
                  >
                    <a
                      className="hover:underline"
                      onClick={() => {
                        track('clicked return to module', {
                          module: module.slug.current,
                        })
                      }}
                    >
                      {module.title}
                    </a>
                  </Link>
                </h2>
              </div>
            </div>
            <p className="pt-3 pb-5 text-sm font-semibold uppercase px-5 bg-gradient-to-t from-transparent to-gray-900 via-gray-900">
              Exercises
            </p>
          </div>
          <ExerciseNavigator module={module} path={path} />
        </SimpleBar>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent h-24 z-20 pointer-events-none" />
      </aside>
    </>
  )
}

export default ExerciseSidebar
