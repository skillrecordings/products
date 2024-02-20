import * as React from 'react'
import Link from 'next/link'

import Icon from 'components/icons'

export type ResourcesLinksProps = {
  resources: {
    title: string
    url: string
  }[]
}

export const ResourcesLinks: React.FC<ResourcesLinksProps> = ({resources}) => {
  return (
    <ul data-resources-links="" className="not-prose">
      {resources.map((resource) => {
        return (
          <li key={resource.title}>
            <Link href={resource.url}>
              <div className="truncate">{resource.title}</div>
              <Icon
                aria-hidden="true"
                name="arrow-top-right"
                className="w-6 lg:w-8 h-6 lg:h-8 shrink-0"
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default ResourcesLinks
