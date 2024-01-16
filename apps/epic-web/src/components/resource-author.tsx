import slugify from '@sindresorhus/slugify'
import {cn} from '@skillrecordings/ui/utils/cn'
import config from 'config'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ResourceAuthor: React.FC<{
  name?: string
  slug?: string
  image?: string
  byline?: string
  className?: string
  as?: string
}> = ({
  name = config.author,
  slug = slugify(config.author),
  image = require('../../public/kent-c-dodds.png'),
  as = Link,
  byline,
  className,
}) => {
  const Component = as

  return (
    <Component
      href={`/authors/${slug}`}
      className={cn(
        'flex items-center justify-start gap-3 font-semibold text-gray-700  dark:text-gray-100',
        {
          '-mx-2 -my-1 rounded-lg px-2 py-1 transition hover:bg-muted':
            as === Link,
        },
        className,
      )}
    >
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        {image && name && (
          <Image
            priority
            src={image}
            alt={name}
            width={56}
            height={56}
            quality={100}
          />
        )}
      </div>
      <div className="flex flex-col">
        {byline && <span>{byline}</span>}
        {name}
      </div>
    </Component>
  )
}

export default ResourceAuthor
