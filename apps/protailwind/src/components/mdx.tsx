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
    <div className="not-prose py-10">
      <blockquote className="flex flex-col items-center justify-center space-y-6">
        <span className="w-full max-w-xl text-center text-xl font-semibold italic sm:text-2xl">
          <Balancer>{children}</Balancer>
        </span>
        {url ? (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            className="group flex items-center gap-2.5 text-left"
          >
            <Author />
          </a>
        ) : (
          <div className="flex items-center gap-2.5 text-left">
            <Author />
          </div>
        )}
      </blockquote>
    </div>
  )
}
