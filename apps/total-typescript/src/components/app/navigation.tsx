import React from 'react'
import {useRouter} from 'next/router'
import {PlayIcon} from '@heroicons/react/solid'
import Link from 'next/link'
import cx from 'classnames'
import config from 'config'
import {track} from '../../utils/analytics'

type Props = {
  className?: string
  containerClassName?: string
}

const Navigation: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  containerClassName = 'max-w-screen-lg flex items-center justify-between w-full',
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
    <ul>
      <li>
        <Link href="/tutorials" passHref>
          <a
            className="flex items-center gap-1 font-medium hover:underline"
            onClick={() => {
              track(`clicked tutorials link in nav`)
            }}
          >
            Free Tutorials
            <PlayIcon className="w-5 h-5 text-cyan-300" aria-hidden="true" />
          </a>
        </Link>
      </li>
    </ul>
  )
}

export const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" passHref>
      <a
        aria-label={`${config.title} Home`}
        className={cx(
          'text-xl font-text font-semibold h-full group text-white flex-shrink-0 flex items-center group',
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
