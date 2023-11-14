import React from 'react'
import Container from './container'

type HeaderProps = {
  title: string
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  children,
}) => {
  return (
    <Container as="header" className="px-5 py-24">
      <h1 className="text-center text-4xl font-bold">{title}</h1>
      {children}
    </Container>
  )
}

export default Header
