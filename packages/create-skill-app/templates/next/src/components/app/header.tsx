import React from 'react'
import Container from './container'
import {cn} from '@skillrecordings/ui/utils/cn'

type HeaderProps = {
  title: string
  className?: string
  slots?: {component: React.ReactElement}[]
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  title = 'Title',
  className,
  slots,
  children,
}) => {
  return (
    <Container as="header" className={cn('border-b px-5 py-24', className)}>
      <div className="flex items-center justify-center">
        <h1 className="text-center text-4xl font-bold">{title}</h1>
        {slots && slots.map((slot) => slot.component)}
      </div>
      {children}
    </Container>
  )
}

export default Header
