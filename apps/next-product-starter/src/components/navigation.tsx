import * as React from 'react'
import DarkModeToggle from './color-mode-toggle'
import config from 'config'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'

const Navigation = () => {
  const {isAuthenticated, logout} = useViewer()
  return (
    <nav className="w-full flex items-center justify-between print:hidden">
      <Link href="/">
        <a
          data-test-id="navigation-title"
          className="dark:hover:text-rose-300 hover:text-rose-500 text-lg font-bold tracking-tight leading-tight"
        >
          {config.defaultTitle}
        </a>
      </Link>
      <div className="flex space-x-3 items-center">
        {isAuthenticated && <button onClick={logout}>log out</button>}
        <DarkModeToggle />
      </div>
    </nav>
  )
}

export default Navigation
