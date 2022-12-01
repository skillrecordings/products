import React from 'react'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import LessonList from './lesson-list'
import cx from 'classnames'
import Image from 'next/image'
import {track} from '../utils/analytics'

type SidebarProps = {
  module: SanityDocument
  section?: SanityDocument
  path: string
  className?: string
  children?: React.ReactNode
}
const ModuleLessonListHeader: React.FC<SidebarProps> = ({
  module,
  section,
  path = '',
  className,
  children,
}) => {
  const headerHeight = section ? '190px' : '150px'
  return (
    <>
      <div
        className={cx(
          'relative z-50 w-full lg:max-w-[280px] xl:max-w-xs',
          className,
        )}
      >
        <div className="top-0 border-r border-gray-800 lg:sticky">
          <aside>
            <div
              className={`top-0 z-10 h-[${headerHeight}] bg-gradient-to-t from-transparent via-gray-900 to-gray-900 lg:sticky`}
            >
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
                  <Link href={`/${module.moduleType}s`}>
                    <a
                      className="font-mono text-xs font-semibold uppercase text-gray-300 hover:underline"
                      onClick={() => {
                        track(`clicked return to ${module.moduleType}s`, {
                          module: module.slug.current,
                        })
                      }}
                    >
                      {module.moduleType}s
                    </a>
                  </Link>
                  <span className="pl-1 text-xs text-gray-400">/</span>
                  <h2 className="w-full text-2xl font-semibold leading-none">
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
              {section && (
                <h3 className="w-full px-5 pt-4 text-xl font-semibold leading-none">
                  {section.title}
                </h3>
              )}
              <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-gray-300">
                Exercises
              </p>
            </div>

            {children}
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-gray-900 to-transparent" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default ModuleLessonListHeader
