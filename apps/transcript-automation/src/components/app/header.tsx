import React from 'react'

type HeaderProps = {
  title: string
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  children,
}) => {
  return (
    <header className="px-5 py-24">
      <h1 className="text-center text-4xl font-bold">{title}</h1>
      {children}
    </header>
  )
}

export default Header
