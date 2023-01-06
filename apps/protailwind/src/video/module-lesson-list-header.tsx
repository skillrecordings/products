import React from 'react'
import {type SanityDocument} from '@sanity/client'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'

import {track} from '@skillrecordings/skill-lesson/utils/analytics'

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
          'relative z-50 w-full flex-shrink-0 lg:max-w-[280px] xl:max-w-xs',
          className,
        )}
      >
        <div className="top-0 border-r border-gray-200/60 shadow-2xl shadow-gray-300/40 lg:sticky">
          <aside>
            <div
              className={`top-0 z-10 h-[${headerHeight}] border-t border-gray-100 lg:sticky`}
            >
              <div className="relative flex items-center gap-5 bg-white px-3 py-1 shadow-lg shadow-gray-300/40">
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
                      className="font-mono text-xs font-semibold uppercase text-gray-500 hover:underline"
                      onClick={() => {
                        track(`clicked return to ${module.moduleType}s`, {
                          module: module.slug.current,
                        })
                      }}
                    >
                      {module.moduleType}s
                    </a>
                  </Link>
                  <span className="pl-1 text-xs text-gray-300">/</span>
                  <h2 className="w-full font-heading text-xl font-extrabold leading-none">
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
              {section && module.sections.length > 1 && (
                <h3 className="w-full px-5 pt-4 text-xl font-semibold leading-none">
                  {section.title}
                </h3>
              )}
              <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-gray-600">
                Lessons
              </p>
            </div>
            {children}
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-gray-50 to-transparent" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default ModuleLessonListHeader
