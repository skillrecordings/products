import * as React from 'react'
import Link from 'next/link'
import Logo from '../logo'
import {useRouter} from 'next/router'
import cx from 'classnames'
export type NavigationProps = {title?: string}

type Props = {
  className?: string
  containerClassName?: string
}

const Navigation: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  containerClassName = 'max-w-screen-lg flex items-stretch justify-between w-full h-full',
}) => {
  return (
    <nav
      aria-label="Main Navigation"
      className="top-0 left-0 z-20 flex  flex-col gap-2 sm:flex-row sm:gap-0 items-center justify-between w-full p-2 bg-gray-900 border-b border-gray-800 print:hidden supports-backdrop-blur:backdrop-blur-lg supports-backdrop-blur:bg-opacity-70 bg-opacity-95"
    >
      <Link
        href="/"
        passHref
        aria-label="TypeScript Course home page"
        data-test-id="navigation-title"
      >
        <Logo />
        <span className="sr-only">TypeScript Course</span>
      </Link>
      <div className="flex items-center justify-between">
        <NavLink href="/articles">Articles</NavLink>
        <NavLink href="/podcast/migrate">Podcast</NavLink>
        <NavLink href="/tutorials">Tutorials</NavLink>
      </div>
    </nav>
  )
}

const NavLink: React.FC<React.PropsWithChildren<{href: string}>> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link
      href={href}
      passHref
      aria-current={isActive ? 'page' : undefined}
      className={cx(
        'relative px-5 h-full flex items-center sm:pb-1 after:bg-blue-500 justify-center hover:bg-opacity-50 py-1 rounded group transition outline-none hover:opacity-100 font-semibold opacity-80 text-sm',
        {
          'opacity-100': isActive,
        },
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export default Navigation
