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
    <header>
      <Container className="flex items-center justify-between border-b py-12">
        <h1 className="bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text font-mono text-2xl font-bold text-transparent sm:text-3xl">
          {title}
        </h1>
        {children}
      </Container>
    </header>
  )
}

export default Header
