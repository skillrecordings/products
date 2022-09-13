import React, {FunctionComponent} from 'react'
import Markdown from 'components/markdown'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'

type JumbotronProps = {
  resource: any
}

const Jumbotron: FunctionComponent<React.PropsWithChildren<JumbotronProps>> = ({
  resource,
}) => {
  const {image, title, description, path, meta} = resource

  return (
    <Link href={path}>
      <a>
        <div className="relative z-10 flex flex-col justify-start h-full px-6 py-16 overflow-hidden text-center text-black transition-all duration-200 ease-in-out transform bg-white shadow dark:text-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg dark:bg-opacity-80 bg-opacity-80 hover:shadow-xl rounded-xl hover:-translate-y-2 hover:scale-105 items-between lg:text-left">
          <div className="flex flex-col items-center justify-center mx-auto lg:flex-row">
            <div className="flex-shrink-0 px-12">
              <Image
                quality={100}
                src={image}
                width={180}
                height={180}
                priority={true}
                alt={get(image, 'alt', `illustration for ${title}`)}
              />
            </div>
            <div className="flex flex-col items-center w-full lg:items-start">
              <h1 className="text-2xl font-extrabold leading-tight text-gray-800 lg:text-5xl md:text-4xl sm:text-3xl dark:text-white">
                {title}
              </h1>
              <p className="my-4 font-medium opacity-75">{meta}</p>
              <Markdown className="max-w-screen-md">{description}</Markdown>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Jumbotron
