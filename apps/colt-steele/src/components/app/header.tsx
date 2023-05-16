import Image from 'next/image'
import React from 'react'
import Balancer from 'react-wrap-balancer'

type HeaderProps = {
  title: string
  subtitle?: string
  image?: string
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  subtitle,
  children,
  image,
}) => {
  return (
    <header className="relative z-10 bg-brand-red text-white mb-10 w-full flex flex-col items-center px-5 text-center py-10 lg:py-14 lg:pt-32 pt-36 after:content-[''] after:absolute after:w-2 after:h-2 after:rotate-45 after:bg-brand-red after:-bottom-1">
      <div className="flex flex-col max-w-screen-xl mx-auto w-full items-center">
        {image && (
          <Image
            src={require(`../../../public/assets/${image}`)}
            alt=""
            aria-hidden="true"
            className="w-full max-w-[200px] absolute sm:-top-16 -top-5"
          />
        )}
        <h1 className="text-center font-heading text-5xl font-black sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <h2 className="max-w-lg pt-4 text-center opacity-80 lg:text-lg">
            <Balancer>{subtitle}</Balancer>
          </h2>
        )}
      </div>
      {children}
    </header>
  )
}

export default Header
