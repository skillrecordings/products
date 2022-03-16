import * as React from 'react'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import Logo from './logo'

export type NavigationProps = {title?: string}

const Navigation: React.FC<NavigationProps> = ({title = 'Product'}) => {
  const {isAuthenticated, logout} = useViewer()
  return (
    <nav className="w-full flex items-center justify-between print:hidden sticky top-0 left-0 z-10 p-2 border-b border-gray-800 bg-gray-900 backdrop-blur-lg bg-opacity-70">
      <Link href="/" passHref aria-label="TypeScript Course home page">
        <a data-test-id="navigation-title">
          <Logo />
          <span className="sr-only">TypeScript Course</span>
        </a>
      </Link>
      {isAuthenticated && <button onClick={logout}>log out</button>}
    </nav>
  )
}

export default Navigation
