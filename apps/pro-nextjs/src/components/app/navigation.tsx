import React from 'react'
import Image from 'next/image'
import {trpc} from '@/trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {twMerge} from 'tailwind-merge'
import {cn} from '@skillrecordings/ui/utils/cn'
import {DocumentIcon, PlayIcon} from '@heroicons/react/outline'
import {signIn} from 'next-auth/react'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const links = [
  {
    label: 'Free Tutorials',
    href: '/tutorials',
    icon: <PlayIcon className="w-4 opacity-75" />,
  },
  {
    label: 'Articles',
    href: '/articles',
    icon: <DocumentIcon className="w-4 opacity-75" />,
  },
]

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {asPath} = useRouter()

  return (
    <nav
      aria-label="top"
      className={twMerge(
        'relative mx-auto w-full px-5 py-10 text-sm sm:px-10 sm:py-6',
        className,
      )}
    >
      <DesktopNav />
      <MobileNav />
    </nav>
  )
}

export default Navigation

export const Logo = () => {
  const {pathname} = useRouter()
  const isRoot = pathname === '/'

  return (
    <Link
      href="/"
      aria-current={isRoot}
      tabIndex={isRoot ? -1 : 0}
      passHref
      className="inline-flex items-center gap-1.5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="26"
        fill="none"
        viewBox="0 0 30 26"
      >
        <path
          fill="currentColor"
          d="m.56 15.002 5.012 8.696A4.205 4.205 0 0 0 9.206 25.8h4.388L2.754 6.99.56 10.8a4.222 4.222 0 0 0 0 4.203Zm28.88-4.203-5.012-8.697A4.206 4.206 0 0 0 20.794 0h-4.388l10.84 18.809L29.44 15a4.221 4.221 0 0 0 0-4.202Zm-2.762 8.984a3.835 3.835 0 0 1-1.817.454 3.877 3.877 0 0 1-3.346-1.936l-9.506-16.49A3.578 3.578 0 0 0 8.877 0a3.579 3.579 0 0 0-3.132 1.812L3.322 6.017a3.837 3.837 0 0 1 1.817-.454c1.375 0 2.657.742 3.346 1.936l9.506 16.49a3.579 3.579 0 0 0 3.132 1.811 3.578 3.578 0 0 0 3.132-1.812l2.423-4.205Z"
        />
      </svg>
      <span className="hidden text-lg font-semibold md:block">ProNext.js</span>
    </Link>
  )
}

const DesktopNav = () => {
  const {asPath} = useRouter()
  return (
    <div className="hidden items-center justify-center sm:flex">
      <div className="flex h-full w-full items-center justify-between">
        <Logo />
        <ul>
          <Link
            href="/login"
            className="text-gray-600 transition hover:text-foreground"
            onClick={() => {
              track(`clicked login from navigation`)
            }}
          >
            Log in
          </Link>
        </ul>
      </div>
      <ul className="fixed top-4 z-20 flex items-center gap-8 rounded-l-full rounded-r-full border bg-card px-8 py-3">
        {links.map(({href, label, icon}) => {
          const isCurrent = asPath === href

          return (
            <li key={href} className="flex items-center justify-center">
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center gap-1 leading-none opacity-75 transition hover:opacity-100',
                  {
                    'font-medium': isCurrent,
                  },
                )}
                onClick={() => {
                  track(`clicked ${label} from navigation`)
                }}
                passHref
              >
                {icon} {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const MobileNav = () => {
  const {asPath} = useRouter()
  return (
    <div className="fixed left-0 top-5 z-50 flex w-full px-3">
      <div className="flex w-full items-center justify-between rounded-l-full rounded-r-full border bg-card px-5 py-4 sm:hidden">
        <Logo />
        <ul className="flex items-center gap-5">
          {links.map(({href, label, icon}) => {
            const isCurrent = asPath === href

            return (
              <li key={href} className="flex items-center justify-center">
                <Link
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-1 leading-none opacity-75 transition hover:opacity-100',
                    {
                      underline: isCurrent,
                    },
                  )}
                  onClick={() => {
                    track(`clicked ${label} from navigation`)
                  }}
                  passHref
                >
                  {icon} {label}
                </Link>
              </li>
            )
          })}
          <ul className="invisible">{/* Log in */}</ul>
        </ul>
      </div>
    </div>
  )
}
