import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import ExerciseNavigator from './exercise-navigator'
import cx from 'classnames'
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
        className={cx(
          'xl:max-w-xs lg:max-w-[280px] w-full relative z-50',
          className,
        )}
      >
        <div className="border-r border-gray-800 lg:sticky top-0">
          <aside>
            <div className="lg:sticky top-0 z-10 h-[180px] bg-gradient-to-t from-transparent to-gray-900 via-gray-900">
              <div className="flex items-center gap-5 px-3 pt-2 pb-2 bg-gray-900 border-b border-gray-800 relative">
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
                <div className="relative z-10">
                  <Link href="/tutorials">
                    <a
                      className="uppercase text-xs font-mono font-semibold opacity-80 hover:underline"
                      onClick={() => {
                        track('clicked return to tutorials', {
                          module: module.slug.current,
                        })
                      }}
                    >
                      {module.moduleType}s
                    </a>
                  </Link>
                  <span className="pl-1">/</span>
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
                <Image
                  src={require('../../public/assets/landing/bg-divider-6.png')}
                  alt=""
                  aria-hidden="true"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center center"
                />
              </div>
              <p className="pt-4 pb-2 text-xs tracking-wide font-medium uppercase px-5 text-gray-300">
                Exercises
              </p>
            </div>
            <ExerciseNavigator module={module} path={path} />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent h-24 z-20 pointer-events-none" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default ExerciseSidebar
