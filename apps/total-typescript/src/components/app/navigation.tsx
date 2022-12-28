import React from 'react'
import {NextRouter, useRouter} from 'next/router'
import {
  ChevronDownIcon,
  FireIcon,
  MenuIcon,
  PlayIcon,
} from '@heroicons/react/solid'
import {track} from '../../video/analytics'
import cx from 'classnames'
import config from 'config'
import {createAppAbility} from 'video/ability'
import {trpc} from '../../video/trpc'
import NextLink, {type LinkProps} from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import {signOut, useSession} from 'next-auth/react'
import toast from 'react-hot-toast'
import {useFeedback} from '../../feedback-widget/feedback-context'

type Props = {
  className?: string
  containerClassName?: string
  isMinified?: boolean
}

const Navigation: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  containerClassName = 'max-w-screen-lg flex items-stretch justify-between w-full h-full',
  isMinified = false,
}) => {
  return (
    <nav
      aria-label="top"
      className={cx(
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center bg-black/30 pl-3 pr-0 print:hidden sm:h-16 sm:bg-black/30 sm:pl-4 md:pr-3',
        className,
      )}
    >
      <div className={containerClassName}>
        <NavLogo isMinified={isMinified} />
        <DesktopNav isMinified={isMinified} />
        <MobileNav />
      </div>
    </nav>
  )
}

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

type DesktopNavProps = {
  isMinified?: boolean
}

const DesktopNav: React.FC<DesktopNavProps> = ({isMinified}) => {
  const {status} = useSession()
  const {setIsFeedbackDialogOpen} = useFeedback()

  return (
    <ul className={cx('hidden w-full items-center justify-between md:flex')}>
      <div className="flex h-full items-center">
        <hr
          className="ml-4 mr-1 h-1/4 w-px border-transparent bg-gray-700 lg:ml-6 lg:mr-2"
          aria-hidden="true"
        />
        <NavLink
          path="/workshops"
          label={
            <>
              <span
                className={cx('hidden ', {
                  'xl:inline-block': isMinified,
                  'lg:inline-block': !isMinified,
                })}
              >
                Pro
              </span>{' '}
              Workshops
            </>
          }
          icon={<KeyIcon />}
        />
        <NavLink
          path="/tutorials"
          label={
            <>
              <span
                className={cx('hidden ', {
                  'xl:inline-block': isMinified,
                  'lg:inline-block': !isMinified,
                })}
              >
                Free
              </span>{' '}
              Tutorials
            </>
          }
          icon={
            <PlayIcon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
          }
        />
        <NavLink
          path="/tips"
          label="Tips"
          icon={
            <FireIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />
          }
        />
        <NavLink
          path="/articles"
          label="Articles"
          icon={<BookIcon aria-hidden="true" />}
        />
      </div>
      <div className="flex h-full items-center justify-center">
        {status === 'unauthenticated' && <NavLink path="/faq" label="FAQ" />}
        {status === 'authenticated' ? (
          <>
            <NavLink
              label={
                <>
                  <span
                    className={cx('hidden ', {
                      'xl:inline-block': isMinified,
                      'lg:inline-block': !isMinified,
                    })}
                  >
                    Send
                  </span>{' '}
                  Feedback
                </>
              }
              onClick={() => {
                setIsFeedbackDialogOpen(true, 'header')
              }}
            />
            <AccountDropdown />
          </>
        ) : status === 'unauthenticated' ? (
          <NavLink path="/login" label="Log in" />
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
    </ul>
  )
}

const MobileNav = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {status} = useSession()
  const {setIsFeedbackDialogOpen} = useFeedback()

  return (
    <div className="block md:hidden">
      <ul className="flex h-full items-center justify-center">
        {status === 'unauthenticated' ? (
          <NavLink path="/login" label="Log in" />
        ) : null}
        <li className="h-full">
          <NavigationMenu.Root delayDuration={0} className="flex h-full">
            <NavigationMenu.List className="flex h-full items-center justify-center">
              <NavigationMenu.Item className="h-full">
                <NavigationMenu.Trigger className="flex h-full items-center justify-center px-5 hover:bg-gray-800">
                  <MenuIcon className="h-5 w-5" aria-hidden />
                  <span className="sr-only">Menu</span>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-full w-full bg-gray-800 shadow-xl">
                  <ul>
                    <MobileNavLink
                      path="/workshops"
                      label="Pro Workshops"
                      icon={<KeyIcon />}
                    />
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
                    <MobileNavLink
                      path="/articles"
                      label="Articles"
                      icon={<BookIcon aria-hidden="true" />}
                    />
                    <MobileNavLink path="/faq" label="FAQ" />
                    {status === 'authenticated' && (
                      <>
                        <div className="border-t border-gray-900/70 px-3 pb-3 pt-5 font-mono text-xs font-semibold uppercase tracking-wide text-gray-300">
                          Account
                        </div>
                        <ul>
                          {canViewTeam && (
                            <MobileNavLink path="/team" label="Invite team" />
                          )}
                          {canViewInvoice && (
                            <MobileNavLink path="/invoices" label="Invoices" />
                          )}
                          <MobileNavLink
                            label="Send Feedback"
                            onClick={() => {
                              setIsFeedbackDialogOpen(true, 'header')
                            }}
                          />
                          <li>
                            <LogOutButton className="flex h-full items-center gap-0.5 px-3 py-2 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent" />
                          </li>
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
    label: string | React.ReactElement
    icon?: React.ReactElement
    path?: string
    className?: string
    onClick?: () => void
  }>
> = ({onClick, label, icon, path, className}) => {
  const router = useRouter()
  const isActive = router.pathname === path
  if (onClick) {
    return (
      <li className="">
        <button
          onClick={onClick}
          aria-current={isActive ? 'page' : undefined}
          className={cx(
            'flex h-full items-center gap-0.5 rounded-md py-2 px-2 text-sm font-medium shadow-black/80 transition duration-100 hover:bg-gray-800/60 hover:shadow-lg active:bg-transparent sm:gap-1 sm:px-3 lg:px-3 lg:text-base',
            className,
          )}
        >
          {label}
        </button>
      </li>
    )
  }
  return path ? (
    <li className="">
      <NextLink href={path} passHref>
        <a
          className={cx(
            'flex h-full items-center gap-0.5 rounded-md py-2 px-2 text-sm font-medium shadow-black/80 transition duration-100 hover:bg-gray-800/60 hover:shadow-lg active:bg-transparent sm:gap-1 sm:px-3 lg:px-3 lg:text-base',
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
  ) : null
}

const MobileNavLink: React.FC<
  React.PropsWithChildren<{
    label: string
    icon?: React.ReactElement
    path?: string
    className?: string
    onClick?: () => void
  }>
> = ({onClick, label, icon, path, className}) => {
  if (onClick) {
    return (
      <li>
        <button
          onClick={onClick}
          className={cx(
            'flex h-full items-center gap-1.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent',
            className,
          )}
        >
          {icon ? icon : null}
          {label}
        </button>
      </li>
    )
  }
  return path ? (
    <li>
      <NextLink href={path} passHref>
        <a
          className={cx(
            'flex h-full items-center gap-1.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent',
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
  ) : null
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
          'flex w-full rounded px-3 py-2 transition hover:bg-gray-700',
          props.className,
        )}
      />
    </NextLink>
  )
}

export const NavLogo: React.FC<{className?: string; isMinified?: boolean}> = ({
  className,
  isMinified,
}) => {
  const router = useRouter()
  return (
    <NextLink href="/" passHref>
      <a
        aria-label={`${config.title} Home`}
        className={cx(
          'group group flex h-full flex-shrink-0 items-center font-text text-xl font-semibold text-white md:text-lg lg:text-xl',
          className,
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <span
          aria-hidden={!isMinified}
          className={cx('text-base', {
            hidden: !isMinified,
            'hidden sm:hidden md:block xl:hidden': isMinified,
          })}
        >
          TT.
        </span>
        <span
          aria-hidden={isMinified}
          className={cx('mr-0.5 font-light opacity-90', {
            'md:hidden xl:block 2xl:block': isMinified,
          })}
        >
          Total
        </span>
        <span
          aria-hidden={isMinified}
          className={cx({
            'md:hidden xl:block 2xl:block': isMinified,
          })}
        >
          TypeScript
        </span>
      </a>
    </NextLink>
  )
}

const AccountDropdown = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')

  const preventHover = (event: any) => {
    const e = event as Event
    return e.preventDefault()
  }

  return (
    <li className="h-full">
      <NavigationMenu.Root
        aria-label="Account"
        delayDuration={0}
        className="relative flex h-full"
      >
        <NavigationMenu.List className="flex h-full items-center justify-center">
          <NavigationMenu.Item className="">
            <NavigationMenu.Trigger
              onPointerMove={preventHover}
              onPointerLeave={preventHover}
              className="flex h-full items-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium hover:radix-state-closed:bg-gray-800/70 radix-state-open:bg-gray-800 sm:gap-1 sm:px-3 lg:text-base"
            >
              Account <ChevronDownIcon className="h-4 w-4" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content
              onPointerMove={preventHover}
              onPointerLeave={preventHover}
              className="absolute top-full left-0 w-full rounded-b"
            >
              <ul className="flex w-full flex-col items-start rounded-b bg-gray-800 p-1 text-sm lg:text-base">
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
                  <DropdownLink href="/faq">FAQ</DropdownLink>
                </li>
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
            : 'flex w-full rounded px-3 py-2 transition hover:bg-gray-700'
        }
      >
        Log out
      </button>
    </NavigationMenu.Link>
  )
}

const KeyIcon = () => {
  return (
    <svg
      className="mr-0.5 h-4 w-4 text-amber-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 15 15"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 0a1 1 0 0 1 .707 1.707l-1.646 1.647 1.793 1.792a.5.5 0 0 1 0 .708l-2.5 2.5a.499.499 0 0 1-.708 0L9.854 6.561 7.434 8.98c.367.61.563 1.308.566 2.02a4 4 0 1 1-4-4c.712.004 1.41.2 2.02.566L13.293.293A1 1 0 0 1 14 0ZM4 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      />
    </svg>
  )
}

const BookIcon = () => {
  return (
    <svg
      className="mr-0.5 h-3.5 w-3.5 text-violet-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <g fill="currentColor">
        <path
          fill="currentColor"
          d="M13,0H3C1.3,0,0,1.3,0,3v10c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V3C16,1.3,14.7,0,13,0z M5,3h6v4H5V3z M14,13 c0,0.6-0.4,1-1,1H3c-0.6,0-1-0.4-1-1c0-0.6,0.4-1,1-1h10c0.6,0,0.9-0.1,1-0.2V13z"
        />
      </g>
    </svg>
  )
}

export default Navigation
