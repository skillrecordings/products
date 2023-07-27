import React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {track} from '../../utils/analytics'
import {type Module} from '../../schemas/module'
import pluralize from 'pluralize'
import Balancer from 'react-wrap-balancer'

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
                  <div data-image="">
                    <Image
                      src={module.image}
                      width={120}
                      height={120}
                      alt={module.title}
                      quality={100}
                      priority
                    />
                  </div>
                )}
                <div data-title="">
                  <Link
                    href={`/${pluralize(module.moduleType)}`}
                    data-type=""
                    onClick={() => {
                      track(
                        `clicked return to ${pluralize(module.moduleType)}`,
                        {
                          module: module.slug.current,
                        },
                      )
                    }}
                  >
                    {pluralize(module.moduleType)}
                  </Link>
                  <span>/</span>
                  <Balancer as="h2">
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
                  </Balancer>
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
