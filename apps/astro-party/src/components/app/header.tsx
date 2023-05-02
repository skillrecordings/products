import React from 'react'

type HeaderProps = {
  title: string
}

const Header: React.FC<HeaderProps> = ({title = 'Title'}) => {
  return (
    <header className="px-5 py-24">
      <h1 className="text-center text-4xl font-bold">{title}</h1>
    </header>
  )
}

export default Header
