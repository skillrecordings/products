import React from 'react'
import {useRouter} from 'next/router'
import {FireIcon, PlayIcon, UserGroupIcon} from '@heroicons/react/solid'
import {track} from '../../utils/analytics'
import Link from 'next/link'
import cx from 'classnames'
import config from 'config'
import {AppAbility, getCurrentAbility} from 'ability/ability'
import {useUser} from '@skillrecordings/react'
import {trpc} from '../../utils/trpc'

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
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center bg-gray-900 px-3 print:hidden sm:h-16 sm:bg-black/30 sm:px-5',
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

const useAbilities = () => {
  const {data: abilityRules} = trpc.useQuery(['abilities.getAbilities'])

  return new AppAbility(abilityRules || [])
}

const DesktopNav = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')

  return (
    <ul className="flex items-center">
      {canViewTeam && (
        <NavLink
          path="/team"
          label="Invite Team"
          icon={
            <UserGroupIcon
              className="h-5 w-5 text-cyan-300"
              aria-hidden="true"
            />
          }
        />
      )}
      <NavLink
        path="/tutorials"
        label="Free Tutorials"
        icon={<PlayIcon className="h-5 w-5 text-cyan-300" aria-hidden="true" />}
      />
      <NavLink
        path="/tips"
        label="Tips"
        icon={
          <FireIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />
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
          className="flex h-full items-center gap-0.5 px-2 text-sm font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent sm:gap-1 sm:px-5 sm:text-base"
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
          'group group flex h-full flex-shrink-0 items-center font-text text-xl font-semibold text-white',
          className,
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <span className="mr-0.5 font-light opacity-90">Total</span>
        <span>TypeScript</span>
      </a>
    </Link>
  )
}

export default Navigation
