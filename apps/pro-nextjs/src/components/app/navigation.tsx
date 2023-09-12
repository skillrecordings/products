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
import {signOut, useSession} from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@skillrecordings/ui'
import {LogoutIcon} from '@heroicons/react/solid'
import {ChevronDownIcon} from '@heroicons/react/outline'
import Gravatar from 'react-gravatar'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const links = [
  // {
  //   label: 'Free Tutorials',
  //   href: '/tutorials',
  //   icon: <PlayIcon className="w-4 opacity-75" />,
  // },
  {
    label: 'Articles',
    href: '/articles',
    icon: <DocumentIcon className="w-4 opacity-75" />,
  },
]

export type NavigationProps = {
  className?: string
  linksClassName?: string
}

const Navigation: React.FC<NavigationProps> = ({className, linksClassName}) => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {asPath} = useRouter()

  return (
    <nav
      aria-label="top"
      className={twMerge(
        'relative z-10 mx-auto w-full px-5 py-10 text-sm sm:px-10 sm:py-6',
        className,
      )}
    >
      <DesktopNav className={linksClassName} />
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

const DesktopNav: React.FC<{className?: string}> = ({className}) => {
  const {asPath} = useRouter()
  return (
    <div className="hidden items-center justify-center sm:flex">
      <div className="flex h-full w-full items-center justify-between">
        <Logo />
        <ul>
          <li>
            <Login />
          </li>
          <li>
            <User />
          </li>
        </ul>
      </div>
      <ul
        className={cn(
          'fixed top-4 z-20 flex items-center gap-8 rounded-l-full rounded-r-full border bg-card px-8 py-3',
          className,
        )}
      >
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

const User: React.FC<{className?: string}> = ({className}) => {
  const {pathname} = useRouter()
  const {data: sessionData, status: sessionStatus} = useSession()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({})
  const isLoadingUserInfo =
    sessionStatus === 'loading' || commercePropsStatus === 'loading'
  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  return (
    <>
      {isLoadingUserInfo || !sessionData?.user?.email ? null : (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn('mr-3 flex items-center space-x-1', className)}
          >
            <Gravatar
              className="h-7 w-7 rounded-full"
              email={sessionData?.user?.email}
              default="mp"
            />
            <div className="flex flex-col pl-0.5">
              <span className="inline-flex gap-0.5 text-sm font-medium leading-tight">
                {sessionData?.user?.name} <ChevronDownIcon className="w-2" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {purchasedProductIds.length > 0 && (
              <DropdownMenuItem
                className="flex items-center justify-between"
                asChild
              >
                <Link
                  href="/products?s=purchased"
                  className={cn(
                    // 'text-xs font-medium opacity-75 hover:underline hover:opacity-100',
                    {
                      underline: pathname === '/products',
                    },
                  )}
                >
                  My Purchases
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                signOut()
              }}
              className="flex items-center justify-between"
            >
              {' '}
              <span>Log out</span>
              <LogoutIcon className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

const Login: React.FC<{className?: string}> = ({className}) => {
  const {pathname} = useRouter()
  const {data: sessionData, status: sessionStatus} = useSession()
  const isLoadingUserInfo = sessionStatus === 'loading'

  return (
    <>
      {isLoadingUserInfo || sessionData?.user?.email ? null : (
        <Link
          href="/login"
          className={cn(
            'group flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:opacity-100',
            {
              'underline opacity-100': pathname === '/login',
              'opacity-75': pathname !== '/login',
            },
            className,
          )}
        >
          Log in
        </Link>
      )}
    </>
  )
}
