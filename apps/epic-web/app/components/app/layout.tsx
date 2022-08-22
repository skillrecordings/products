import type {FunctionComponent, ReactNode} from 'react';
import React from 'react'
import cx from 'classnames'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({children, className}) => {
  return (
    <div className="relative">
      <div
        className={cx('flex flex-col flex-grow h-full min-h-screen', className)}
      >
        {children}
        {/* {footer ? footer : isNull(footer) ? null : <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
