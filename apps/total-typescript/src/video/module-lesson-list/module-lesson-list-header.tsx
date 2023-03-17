import React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

type SidebarProps = {
  module: Module
  path: string
  children?: React.ReactNode
}
const ModuleLessonListHeader: React.FC<SidebarProps> = ({
  module,
  path = '',
  children,
}) => {
  return (
    <>
      <div data-module-lesson-list-header="">
        <div data-sticky-container="">
          <aside>
            <div data-content-wrapper="">
              <div data-content="">
                {module?.image && (
                  <Image
                    src={module.image}
                    width={120}
                    height={120}
                    alt={module.title}
                    quality={100}
                    data-image=""
                  />
                )}
                <div data-title="">
                  <Link
                    href={`/${module.moduleType}s`}
                    data-type=""
                    onClick={() => {
                      track(`clicked return to ${module.moduleType}s`, {
                        module: module.slug.current,
                      })
                    }}
                  >
                    {module.moduleType}s
                  </Link>
                  <span>/</span>
                  <h2>
                    <Link
                      href={{
                        pathname: `${path}/[module]`,
                        query: {module: module.slug.current},
                      }}
                      passHref
                      onClick={() => {
                        track('clicked return to module', {
                          module: module.slug.current,
                        })
                      }}
                    >
                      {module.title}
                    </Link>
                  </h2>
                </div>
              </div>
            </div>
            {children}
            <div data-fadeout="" />
          </aside>
        </div>
      </div>
    </>
  )
}

export default ModuleLessonListHeader
