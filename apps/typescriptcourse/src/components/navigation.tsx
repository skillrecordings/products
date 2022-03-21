import * as React from 'react'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import cx from 'classnames'
import Logo from './logo'
import {useRouter} from 'next/router'
import {scroller} from 'react-scroll'

export type NavigationProps = {title?: string}

const Navigation: React.FC<NavigationProps> = ({title = 'Product'}) => {
  const {isAuthenticated, logout} = useViewer()
  const router = useRouter()
  const isRoot = router.pathname === '/'
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
      <button
        className="rounded-lg bg-white/10 font-semibold hover:bg-white/20 relative group inline-block sm:px-3 text-sm px-2 sm:py-1.5 py-1 transition-all duration-200 ease-in-out transform hover:opacity-100 opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={() => {
          scroller.scrollTo('course', {
            duration: 800,
            smooth: 'easeInOutQuint',
          })
        }}
      >
        Start learning
      </button>
    </nav>
  )
}

const NavLink: React.FC<{href: string}> = ({href, children, ...props}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'rounded-lg hover:bg-white bg-opacity-5 relative group sm:text-base text-sm inline-block sm:px-3 px-2 sm:py-2 py-1.5 leading-5 transition-all duration-200 ease-in-out transform hover:opacity-100 opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          {
            'bg-white bg-opacity-5': isActive,
          },
        )}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}

export default Navigation
