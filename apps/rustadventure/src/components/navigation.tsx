import * as React from 'react'
import config from '../config'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import Ferris from 'components/ferris'

const Navigation = () => {
  const {isAuthenticated, logout} = useViewer()
  return (
    <nav className="w-full flex items-center justify-between print:hidden">
      <Link href="/">
        <a className="flex items-center space-x-2 font-semibold tracking-tight leading-none">
          <div className="w-10">
            <Ferris />
          </div>
          <div>
            <div>{config.defaultTitle}</div>
            <div className="text-sm font-light opacity-70">
              with {config.author}
            </div>
          </div>
        </a>
      </Link>
      {/* <div className="flex space-x-3 items-center">
        {isAuthenticated && <button onClick={logout}>log out</button>}
      </div> */}
    </nav>
  )
}

export default Navigation
