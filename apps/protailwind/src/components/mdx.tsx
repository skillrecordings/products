import Image from 'next/image'
import React from 'react'
import Balancer from 'react-wrap-balancer'

type TestimonialProps = {
  url?: string
  author: {
    name: string
    avatar: string
    bio: string
  }
}

export const InlineTestimonial: React.FC<
  React.PropsWithChildren<TestimonialProps>
> = ({children, url, author}) => {
  const {name, avatar, bio} = author
  const Author = () => {
    return (
      <>
        <Image
          src={avatar}
          alt={name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-none text-gray-800 group-hover:underline">
            {name}
          </span>
          <span className="text-base text-gray-600">{bio}</span>
        </div>
      </>
    )
  }
  return (
    <div className="not-prose relative rounded-xl bg-white p-8 shadow-lg ring-1 ring-black/5">
      <blockquote className="flex flex-col items-start justify-center space-y-8 before:absolute before:left-4 before:top-0 before:font-serif before:text-[240px] before:leading-none before:opacity-[0.08] before:content-['“']">
        <span className="w-full max-w-xl text-lg font-medium italic sm:ml-4 sm:mt-4 sm:text-2xl md:text-3xl">
          <Balancer>{children}</Balancer>
        </span>
        {url ? (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            className="group flex items-center gap-4 text-left"
          >
            <Author />
          </a>
        ) : (
          <div className="flex items-center gap-4 text-left">
            <Author />
          </div>
        )}
      </blockquote>
    </div>
  )
}
