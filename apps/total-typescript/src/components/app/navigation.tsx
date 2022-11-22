import React from 'react'
import {NextRouter, useRouter} from 'next/router'
import {
  ChevronDownIcon,
  FireIcon,
  MenuIcon,
  PlayIcon,
} from '@heroicons/react/solid'
import {track} from '../../utils/analytics'
import cx from 'classnames'
import config from 'config'
import {AppAbility, getCurrentAbility} from 'ability/ability'
import {useUser} from '@skillrecordings/react'
import {isSellingLive} from 'utils/is-selling-live'
import {trpc} from '../../utils/trpc'
import NextLink, {type LinkProps} from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import {signOut} from 'next-auth/react'
import toast from 'react-hot-toast'

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
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center bg-black/30 px-3 print:hidden sm:h-16 sm:bg-black/30 sm:px-5',
        className,
      )}
    >
      <div className={containerClassName}>
        <NavLogo />
        <DesktopNav />
        <MobileNav />
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
  const canViewContent = ability.can('view', 'Content')

  return (
    <ul className="hidden items-center md:flex">
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
      {isSellingLive && (
        <hr
          className="mx-3 h-1/4 w-px border-transparent bg-gray-700"
          aria-hidden="true"
        />
      )}
      {canViewContent ? (
        <AccountDropdown />
      ) : (
        isSellingLive && <NavLink path="/login" label="Log in" />
      )}
    </ul>
  )
}

const MobileNav = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewContent = ability.can('view', 'Content')
  const canViewInvoice = ability.can('view', 'Invoice')

  return (
    <div className="block md:hidden">
      <ul className="flex h-full items-center justify-center">
        {isSellingLive && !canViewContent && (
          <NavLink path="/login" label="Log in" />
        )}
        <li className="h-full">
          <NavigationMenu.Root delayDuration={0} className="flex h-full">
            <NavigationMenu.List className="flex h-full items-center justify-center">
              <NavigationMenu.Item className="h-full">
                <NavigationMenu.Trigger className="-mr-3 flex h-full items-center justify-center px-5 hover:bg-gray-800 sm:-mr-5">
                  <MenuIcon className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Menu</span>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-full w-full bg-gray-800 shadow-xl">
                  <ul>
                    <MobileNavLink
                      path="/tutorials"
                      label="Free Tutorials"
                      icon={
                        <PlayIcon
                          className="h-5 w-5 text-cyan-300"
                          aria-hidden="true"
                        />
                      }
                    />
                    <MobileNavLink
                      path="/tips"
                      label="Tips"
                      icon={
                        <FireIcon
                          className="h-5 w-5 text-orange-400"
                          aria-hidden="true"
                        />
                      }
                    />
                    {canViewContent && isSellingLive && (
                      <>
                        <div className="border-t border-gray-900/50 px-3 pb-3 pt-5 font-mono text-xs font-semibold uppercase tracking-wide">
                          Account
                        </div>
                        <ul>
                          {!canViewTeam && (
                            <MobileNavLink path="/team" label="Invite team" />
                          )}
                          {canViewInvoice && (
                            <MobileNavLink path="/invoices" label="Invoices" />
                          )}
                          {canViewContent && (
                            <li>
                              <LogOutButton className="flex h-full items-center gap-0.5 px-3 py-2 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent" />
                            </li>
                          )}
                        </ul>
                      </>
                    )}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Viewport className="w-full" />
          </NavigationMenu.Root>
        </li>
      </ul>
    </div>
  )
}

const NavLink: React.FC<
  React.PropsWithChildren<{
    label: string
    icon?: React.ReactElement
    path: string
    className?: string
  }>
> = ({label, icon, path, className}) => {
  return (
    <li className="h-full">
      <NextLink href={path} passHref>
        <a
          className={cx(
            'flex h-full items-center gap-0.5 px-2 text-sm font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent sm:gap-1 sm:px-5 sm:text-base',
            className,
          )}
          onClick={() => {
            track(`clicked ${label} link in nav`)
          }}
        >
          {icon ? icon : null}
          {label}
        </a>
      </NextLink>
    </li>
  )
}

const MobileNavLink: React.FC<
  React.PropsWithChildren<{
    label: string
    icon?: React.ReactElement
    path: string
    className?: string
  }>
> = ({label, icon, path, className}) => {
  return (
    <li>
      <NextLink href={path} passHref>
        <a
          className={cx(
            'flex h-full items-center gap-0.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent',
            className,
          )}
          onClick={() => {
            track(`clicked ${label} link in nav`)
          }}
        >
          {icon ? icon : null}
          {label}
        </a>
      </NextLink>
    </li>
  )
}

const DropdownLink: React.FC<
  React.PropsWithChildren<LinkProps & {className?: string}>
> = ({href, ...props}) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <NextLink href={href} passHref>
      <NavigationMenu.Link
        active={isActive}
        {...props}
        className={cx(
          'flex w-full px-3 py-2 text-sm transition hover:bg-gray-700 sm:text-base',
          props.className,
        )}
      />
    </NextLink>
  )
}

export const NavLogo: React.FC<{className?: string}> = ({className}) => {
  const router = useRouter()
  return (
    <NextLink href="/" passHref>
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
    </NextLink>
  )
}

const AccountDropdown = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')

  return (
    <li className="h-full">
      <NavigationMenu.Root
        aria-label="Account"
        delayDuration={0}
        className="relative flex h-full"
      >
        <NavigationMenu.List className="flex h-full items-center justify-center">
          <NavigationMenu.Item className="h-full">
            <NavigationMenu.Trigger className="flex h-full items-center gap-0.5 px-2 text-sm font-medium hover:radix-state-closed:bg-gray-800/70 radix-state-open:bg-gray-800 sm:gap-1 sm:px-5 sm:text-base">
              Account <ChevronDownIcon className="h-4 w-4" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="absolute top-full left-0 w-full overflow-y-hidden rounded-b">
              <ul className="flex w-full flex-col items-start bg-gray-800">
                {canViewTeam && (
                  <li className="w-full">
                    <DropdownLink href="/team">Invite team</DropdownLink>
                  </li>
                )}
                {canViewInvoice && (
                  <li className="w-full">
                    <DropdownLink href="/invoices">Invoices</DropdownLink>
                  </li>
                )}
                <li className="w-full">
                  <LogOutButton />
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </li>
  )
}

export const handleLogOut = async (router: NextRouter) => {
  const data = await signOut({
    redirect: false,
    callbackUrl: '/',
  }).then((data) => data)
  window.location.href = data.url
}

const LogOutButton: React.FC<{className?: string}> = ({className}) => {
  const router = useRouter()
  return (
    <NavigationMenu.Link asChild>
      <button
        onClick={async () => {
          await handleLogOut(router)
          toast.success('Logged out successfully')
        }}
        className={
          className
            ? className
            : 'flex w-full px-3 py-2 text-sm transition hover:bg-gray-700 sm:text-base'
        }
      >
        Log out
      </button>
    </NavigationMenu.Link>
  )
}

export default Navigation
