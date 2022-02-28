import * as React from 'react'
import DarkModeToggle from './color-mode-toggle'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import Logo from './logo'

export type NavigationProps = {title?: string}

const Navigation: React.FC<NavigationProps> = ({title = 'Product'}) => {
  const {isAuthenticated, logout} = useViewer()
  return (
    <nav className="w-full flex items-center justify-center print:hidden absolute top-0 left-0 z-10 p-5">
      <Link href="/" passHref aria-label="TypeScript Course home page">
        <a data-test-id="navigation-title" className="p-2">
          <Logo />
        </a>
      </Link>
      {/* <div className="flex space-x-3 items-center">
        {isAuthenticated && <button onClick={logout}>log out</button>}
        <DarkModeToggle />
      </div> */}
    </nav>
  )
}

export default Navigation
