import React from 'react'

const H1: React.FC<React.PropsWithChildren<any>> = ({
  className = 'pt-16 md:-mx-16 mx-0',
  children,
  ...props
}) => {
  return (
    <h1 className={className} {...props}>
      {children}
    </h1>
  )
}
const H2: React.FC<React.PropsWithChildren<any>> = ({
  className = 'py-4 md:-mx-16 mx-0',
  children,
  ...props
}) => {
  return (
    <h2 className={className} {...props}>
      {children}
    </h2>
  )
}
const H3: React.FC<React.PropsWithChildren<any>> = ({
  className = 'pt-0 pb-8 md:-mx-16 mx-0',
  children,
  ...props
}) => {
  return (
    <h3 className={className} {...props}>
      {children}
    </h3>
  )
}
const H4: React.FC<React.PropsWithChildren<any>> = ({
  className = 'md:-mx-16 mx-0',
  children,
  ...props
}) => {
  return (
    <h4 className={className} {...props}>
      {children}
    </h4>
  )
}

export {H1, H2, H3, H4}
