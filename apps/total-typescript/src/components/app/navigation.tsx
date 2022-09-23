import React from 'react'
import {useRouter} from 'next/router'
import {FireIcon, PlayIcon} from '@heroicons/react/solid'
import {track} from '../../utils/analytics'
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
        'absolute top-0 z-30 sm:h-16 h-14 sm:px-5 px-3 w-full flex items-center justify-center print:hidden sm:bg-black/30 bg-gray-900',
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
        path="/tutorials"
        label="Free Tutorials"
        icon={<PlayIcon className="w-5 h-5 text-cyan-300" aria-hidden="true" />}
      />
      <NavLink
        path="/tips"
        label="Tips"
        icon={
          <FireIcon className="w-5 h-5 text-orange-400" aria-hidden="true" />
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
        <a
          className="flex items-center sm:gap-1 gap-0.5 sm:text-base text-sm active:bg-transparent font-medium sm:px-5 px-2 h-full hover:bg-gray-800/60 transition duration-100"
          onClick={() => {
            track(`clicked ${label} link in nav`)
          }}
        >
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
          'text-xl font-text font-semibold h-full group text-white flex-shrink-0 flex items-center group',
          className,
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <span className="opacity-90 mr-0.5 font-light">Total</span>
        <span>TypeScript</span>
      </a>
    </Link>
  )
}

export default Navigation
