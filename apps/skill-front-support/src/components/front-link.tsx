import {useFront} from '../context/front-context'
import * as React from 'react'

const FrontLink = ({
  children,
  href,
  className = 'text-sm text-blue-500 underline',
}: {
  children?: React.ReactNode
  href?: string
  className?: string
}) => {
  const {currentFrontContext} = useFront()
  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        event.preventDefault()
        currentFrontContext.openUrl(href)
      }}
    >
      {children || href}
    </a>
  )
}

export default FrontLink
