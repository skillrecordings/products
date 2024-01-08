import {cn} from '@skillrecordings/ui/utils/cn'
import React from 'react'

const Container: React.FC<
  React.PropsWithChildren<{
    className?: string
    wrapperClassName?: string
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  }>
> = ({children, className, wrapperClassName, as = 'div', ...props}) => {
  const Component = as
  return (
    <div className={cn('w-full px-2 sm:px-5 lg:px-8', wrapperClassName)}>
      <Component
        className={cn('container h-full px-5 sm:px-8 lg:px-10', className)}
        {...props}
      >
        {children}
      </Component>
    </div>
  )
}

export default Container
