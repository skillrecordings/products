import React from 'react'
import cx from 'classnames'

const CheckList: React.FC<{className?: string}> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <div className="list-check" {...props}>
        {children}
      </div>
    </div>
  )
}

export {CheckList}
