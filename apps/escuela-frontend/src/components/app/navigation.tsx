import React from 'react'
import {useRouter} from 'next/router'
import {SparklesIcon} from '@heroicons/react/solid'

import Link from 'next/link'
import cx from 'classnames'
import config from 'config'

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
      aria-label="top"
      className={cx(
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center bg-gray-900 px-3 print:hidden sm:h-16  sm:px-5',
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
        path="/articulos"
        label="Articulos"
        icon={
          <SparklesIcon className="h-5 w-5 text-brand" aria-hidden="true" />
        }
      />
    </ul>
  )
}

const NavLink: React.FC<
  React.PropsWithChildren<{
    label: string
    icon: React.ReactElement
    path: string
  }>
> = ({label, icon, path}) => {
  return (
    <li className="h-full">
      <Link href={path} passHref>
        <a className="flex h-full items-center gap-0.5 px-2 text-sm font-medium text-gray-100 transition duration-100 hover:bg-gray-800/60 active:bg-transparent sm:gap-1 sm:px-5 sm:text-base">
          {icon}
          {label}
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
        <span className="mr-0.5 pr-1 font-light opacity-90">Escuela</span>
        <span>Frontend</span>
      </a>
    </Link>
  )
}

export default Navigation
