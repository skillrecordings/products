import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from '../markdown'

const HorizontalResourceCard: React.FC<any> = ({
  resource,
  location,
  className = 'p-5 sm:p-8',
  ...props
}) => {
  className = `${className} text-black h-full dark:text-white bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg dark:bg-opacity-80 bg-opacity-80 hover:shadow-xl rounded-xl overflow-hidden hover:-translate-y-2 hover:scale-105 transform transition-all ease-in-out duration-300 flex flex-col justify-start items-between shadow`

  return (
    <Link href={resource.path}>
      <a>
        <div {...props} className={className}>
          <div className="grid gap-4">
            {resource.tag && (
              <span>
                <Image
                  src={resource.tag.image}
                  width={40}
                  height={40}
                  quality={100}
                  alt={resource.tag.name}
                  className="relative z-10 rounded-md"
                  priority={true}
                />
              </span>
            )}

            {resource.title && (
              <h3 className="text-2xl font-bold leading-tight font-fibra">
                {resource.title}
              </h3>
            )}

            {resource.author && (
              <div className="flex items-center space-x-2">
                <Image
                  src={resource.author.image}
                  alt={resource.author.name}
                  quality={100}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h3 className="leading-tight opacity-90">
                  {resource.author.name}
                </h3>
              </div>
            )}

            {resource.description && (
              <div className="prose-sm prose dark:prose-dark dark:prose-dark-sm max-w-none">
                <Markdown>{resource.description}</Markdown>
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  )
}

export {HorizontalResourceCard}
