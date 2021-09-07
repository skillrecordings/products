import React, {FunctionComponent} from 'react'
import Markdown from 'components/markdown'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'

type JumbotronProps = {
  resource: any
}

const Jumbotron: FunctionComponent<JumbotronProps> = ({resource}) => {
  const {image, title, description, path, meta} = resource

  return (
    <Link href={path}>
      <a>
        <div className="text-black h-full dark:text-white bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg dark:bg-opacity-80 bg-opacity-80 hover:shadow-xl rounded-xl overflow-hidden hover:-translate-y-2 hover:scale-105 transform flex flex-col justify-start items-between transition-all ease-in-out duration-200 shadow relative z-10 lg:text-left text-center px-6 py-16">
          <div className="flex lg:flex-row flex-col items-center justify-center mx-auto">
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
            <div className="flex flex-col lg:items-start items-center w-full">
              <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-extrabold dark:text-white text-gray-800 leading-tight">
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
