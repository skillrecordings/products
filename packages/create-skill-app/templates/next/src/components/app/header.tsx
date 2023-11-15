import React from 'react'
import Container from './container'
import {cn} from '@skillrecordings/ui/utils/cn'

type HeaderProps = {
  title: string
  className?: string
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  className,
  children,
}) => {
  return (
    <Container as="header" className={cn('border-b px-5 py-24', className)}>
      <h1 className="text-center text-4xl font-bold">{title}</h1>
      {children}
    </Container>
  )
}

export default Header
