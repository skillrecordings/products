import * as React from 'react'
import Link from 'next/link'
import Logo from './logo'

export type NavigationProps = {title?: string}

const Navigation: React.FC<NavigationProps> = ({title = 'Product'}) => {
  return (
    <nav
      aria-label="Main Navigation"
      className="w-full flex items-center justify-between print:hidden sticky top-0 left-0 z-10 p-2 border-b border-gray-800 bg-gray-900 supports-backdrop-blur:backdrop-blur-lg supports-backdrop-blur:bg-opacity-70 bg-opacity-95"
    >
      <Link href="/" passHref aria-label="TypeScript Course home page">
        <a data-test-id="navigation-title">
          <Logo />
          <span className="sr-only">TypeScript Course</span>
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
