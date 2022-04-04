import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type VerticalResourceCardProps = {
  resource?: any
  location?: string
  className?: string
  banner?: boolean
  featuredResource?: boolean
}

const VerticalResourceCard: React.FC<VerticalResourceCardProps> = ({
  resource,
  location,
  className = 'px-5 py-12 sm:px-8',
  banner = false,
  featuredResource = false,
  ...props
}) => {
  className = `${className} flex flex-col items-center justify-center h-full overflow-hidden text-center text-black transition-all duration-300 ease-in-out transform bg-white shadow dark:text-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg dark:bg-opacity-80 bg-opacity-80 hover:shadow-md rounded-xl hover:-translate-y-2 hover:scale-[1.01] items-between relative z-10`

  return (
    <Link href={resource.path}>
      <a>
        <div {...props} className={className}>
          <div className="grid gap-4">
            {resource.tag && (
              <span>
                <Image
                  src={resource.tag.image}
                  width={200}
                  height={200}
                  quality={100}
                  alt={resource.tag.name}
                  className="relative z-10 rounded-md"
                  priority={true}
                />
              </span>
            )}

            {featuredResource == true ? (
              <p
                aria-hidden
                className="uppercase font-regular lg:text-[0.75rem] text-[0.55rem] pb-2 text-gray-700 dark:text-indigo-100 opacity-60"
              >
                Recurso destacado
              </p>
            ) : null}

            {resource.title && (
              <h3 className="text-2xl font-bold leading-tight font-fibra">
                {resource.title}
              </h3>
            )}

            {resource.author && (
              <div className="flex items-center justify-center mt-1 mb-2 space-x-2 text-xs">
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
          </div>

          {banner == true ? (
            <div className="absolute top-0 left-0 z-20 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-300"></div>
          ) : null}
        </div>
      </a>
    </Link>
  )
}

export {VerticalResourceCard}
