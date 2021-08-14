import * as React from 'react'
import DarkModeToggle from './color-mode-toggle'
import config from '../config'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'

const Navigation = () => {
  const {isAuthenticated, logout} = useViewer()
  return (
    <nav className="absolute top-0 left-0 p-5 w-full flex items-center justify-center print:hidden">
      <Link href="/">
        <a className="uppercase font-din text-orange-50 hover:text-orange-200 text-2xl max-w-[250px] text-center tracking-wide leading-tight">
          {config.defaultTitle}
        </a>
      </Link>
      <div className="flex space-x-3 items-center">
        {isAuthenticated && <button onClick={logout}>log out</button>}
      </div>
    </nav>
  )
}

export default Navigation
