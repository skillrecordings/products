import type {FunctionComponent, ReactNode} from 'react'
import React from 'react'
import cx from 'classnames'
import {Link} from '@remix-run/react'
import Navigation from './navigation'

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
    <div className="relative flex lg:flex-row flex-col">
      <Navigation />
      <div
        className={cx(
          'flex flex-col flex-grow h-full w-full min-h-screen relative',
          className,
        )}
      >
        {children}
        {/* {footer ? footer : isNull(footer) ? null : <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
