import React from 'react'

type HeaderProps = {
  title: string
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  children,
}) => {
  return (
    <header className="mx-auto w-full max-w-3xl px-5 pb-10 pt-8 sm:pt-14">
      <h1 className="text-center text-3xl font-semibold sm:text-left sm:text-4xl">
        {title}
      </h1>
      {children}
    </header>
  )
}

export default Header
