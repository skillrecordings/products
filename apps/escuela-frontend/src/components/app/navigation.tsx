import React from 'react'
import {useRouter} from 'next/router'
import {SparklesIcon} from '@heroicons/react/outline'
import {TicketIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import cx from 'classnames'
import config from 'config'

type Props = {
  className?: string
  containerClassName?: string
}

const Navigation: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  containerClassName = 'flex items-stretch justify-between w-full h-full',
}) => {
  return (
    <nav
      aria-label="top"
      className={cx(
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center px-3 print:hidden sm:h-16 sm:px-5',
        className,
      )}
    >
      <div className={containerClassName}>
        <NavLogo />
        <DesktopNav />
      </div>
    </nav>
  )
}

const DesktopNav = () => {
  return (
    <ul className="flex items-center">
      <NavLink
        href="/articulos"
        icon={
          <SparklesIcon
            className="h-5 w-5 text-gray-300 group-hover:text-gray-50"
            aria-hidden="true"
          />
        }
      >
        Artículos
      </NavLink>
      <NavLink
        href="/workshops"
        icon={
          <TicketIcon
            className="h-5 w-5 text-gray-300 group-hover:text-gray-50"
            aria-hidden="true"
          />
        }
      >
        Workshops
      </NavLink>
    </ul>
  )
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
    <li className="h-full">
      <Link href={href} passHref>
        <a
          aria-current={isActive ? 'page' : undefined}
          className={cx(
            'group flex h-full items-center gap-0.5 px-2 text-sm font-normal text-gray-400 transition duration-100 hover:text-gray-50 active:bg-transparent sm:gap-1 sm:px-5 sm:text-base',
            {
              ' text-white': isActive,
            },
          )}
          {...props}
        >
          <>
            {icon} {children}
          </>
        </a>
      </Link>
    </li>
  )
}

export const NavLogo: React.FC<{className?: string}> = ({className}) => {
  const router = useRouter()
  return (
    <Link href="/" passHref>
      <a
        aria-label={`${config.title} Home`}
        className={cx(
          'font-text group group flex h-full flex-shrink-0 items-center text-xl font-semibold text-white',
          className,
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <div
          className={`font-fibra flex items-center space-x-2 text-2xl font-bold leading-tight tracking-tight  text-white transition-colors duration-100 ease-in-out  sm:text-3xl ${className}`}
        >
          <span className="text-lg font-bold tracking-wide text-gray-50">
            Escuela Frontend
          </span>
        </div>
      </a>
    </Link>
  )
}

export default Navigation
