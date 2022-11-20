import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Icon from './icons'
import {track} from 'utils/analytics'

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  return (
    <nav
      aria-label="top"
      className="sticky top-0 left-0 z-50 w-full border-b border-gray-600 bg-gray-900 bg-opacity-95 py-2 shadow-xl supports-backdrop-blur:bg-opacity-70 supports-backdrop-blur:backdrop-blur-lg sm:py-2"
    >
      <div
        className={cx(className, {
          'mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-2 px-5 sm:flex-row sm:gap-0':
            !className,
        })}
      >
        <NavLogo />
        <DesktopNav />
      </div>
    </nav>
  )
}

export default Navigation

const DesktopNav = () => {
  return (
    <div className="flex items-center space-x-5">
      <NavSlots>
        <NavLink
          href="/tutorials"
          icon={<Icon name="Rocket" className="text-white" />}
        >
          Tutorials
        </NavLink>
        <NavLink
          href="/tips"
          icon={<Icon name="Stars" className="text-white" />}
        >
          Tips
        </NavLink>
        <NavLink
          href="/articles"
          icon={<Icon name="Puzzle" className="text-white" />}
        >
          Articles
        </NavLink>
      </NavSlots>
    </div>
  )
}

const NavSlots: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="flex items-center sm:pb-1">{children}</div>
}

type NavLinkProps = React.PropsWithChildren<{
  href: string
  icon?: React.ReactElement
}>

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  icon = null,
  ...props
}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'jusfify-center flex items-center gap-1 rounded-md px-4 py-2 text-sm transition hover:bg-gray-700',
          {
            'bg-gray-700': isActive,
          },
        )}
        onClick={() => {
          track(`clicked ${children} in primary navigation`)
        }}
        {...props}
      >
        <>
          {icon} {children}
        </>
      </a>
    </Link>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Escuela Frontend Home" passHref>
      <a
        tabIndex={router.pathname === '/' ? -1 : 0}
        className="font-heading text-lg font-bold leading-loose sm:text-xl"
      >
        <span className="text-white">Escuela Frontend</span>
      </a>
    </Link>
  )
}
