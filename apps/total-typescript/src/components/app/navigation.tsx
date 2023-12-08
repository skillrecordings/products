import React from 'react'
import {NextRouter, useRouter} from 'next/router'
import {ChevronDownIcon} from '@heroicons/react/solid'
import {SearchIcon} from '@heroicons/react/outline'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import cx from 'classnames'
import config from '@/config'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {trpc} from '@/trpc/trpc.client'
import NextLink, {type LinkProps} from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import {signOut, useSession} from 'next-auth/react'
import toast from 'react-hot-toast'
import {useFeedback} from '@/feedback-widget/feedback-context'
import {useSearchBar} from '@/search-bar/use-search-bar'
import {motion, AnimationControls, useAnimationControls} from 'framer-motion'
import {cn} from '@skillrecordings/ui/utils/cn'
import SaleMessageBar from './message-bar'

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
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  return (
    <>
      <SaleMessageBar
        className={cn(
          'absolute left-0 top-0 z-30 flex h-14 w-full flex-row justify-center space-x-2 space-y-2 bg-gradient-to-r from-amber-300 to-amber-400 px-2 py-2 text-black sm:h-8 sm:flex-row sm:items-center sm:space-y-0',
          {
            'lg:pl-[calc(280px+20px)] xl:pl-[calc(320px)]': isMinified,
          },
        )}
      />
      <nav
        aria-label="top"
        className={cx(
          'absolute z-30 flex h-14 w-full flex-col items-center justify-center border-b border-gray-800/40 bg-gray-950 pl-3 pr-0 print:hidden sm:h-16 sm:pl-4 md:pr-3',
          className,
          {
            'top-0': !defaultCouponData,
            'top-14 sm:top-8': defaultCouponData,
          },
        )}
      >
        <div className={containerClassName}>
          <NavLogo isMinified={isMinified} />
          <DesktopNav isMinified={isMinified} />
          <MobileNav />
        </div>
      </nav>
    </>
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
      <div className="flex h-full items-center pl-3">
        {/* <hr
          className="ml-4 mr-1 h-1/4 w-px border-transparent bg-gray-700 lg:ml-5 lg:mr-2"
          aria-hidden="true"
        /> */}
        <NavLink
          path="/workshops"
          title="Workshops"
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
          icon={KeyIcon}
        />
        <NavLink
          path="/tutorials"
          title="Tutorials"
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
          icon={PlayIcon}
        />
        <NavLink path="/tips" label="Tips" icon={FireIcon} />
        <NavLink path="/articles" label="Articles" icon={BookIcon} />
        <SearchBar isMinified={isMinified} />
      </div>
      <div className="flex h-full items-center justify-center">
        {status === 'unauthenticated' && <NavLink path="/faq" label="FAQ" />}
        {status === 'authenticated' ? (
          <>
            <NavLink
              label={
                <>
                  {/* <span
                    className={cx('hidden ', {
                      'xl:inline-block': isMinified,
                      'lg:inline-block': !isMinified,
                    })}
                  >
                    Send
                  </span>{' '} */}
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
  const [isMenuOpen, setMenuOpen] = React.useState(false)

  const container = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        type: 'easeInOut',
      },
    },
  }

  return (
    <div className="block md:hidden">
      <ul className="flex h-full items-center justify-center">
        <li className="px-1">
          <SearchBar />
        </li>
        {status === 'unauthenticated' ? (
          <NavLink path="/login" label="Log in" />
        ) : null}
        <NavToggle isMenuOpened={isMenuOpen} setMenuOpened={setMenuOpen} />
        {isMenuOpen && (
          <motion.li className="">
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="absolute left-0 top-14 z-20 w-full overflow-hidden border-b border-white/10 bg-gray-950 pb-5 shadow-2xl shadow-black/60"
            >
              <MobileNavLink
                path="/workshops"
                label="Pro Workshops"
                icon={<KeyIcon />}
              />
              <MobileNavLink
                path="/tutorials"
                label="Free Tutorials"
                icon={<PlayIcon />}
              />
              <MobileNavLink
                path="/tips"
                label="Tips"
                icon={<FireIcon aria-hidden="true" />}
              />
              <MobileNavLink
                path="/articles"
                label="Articles"
                icon={<BookIcon />}
              />
              <MobileNavLink path="/faq" label="FAQ" />
              {status === 'authenticated' && (
                <>
                  <motion.div
                    variants={{
                      hidden: {opacity: 0, x: -20},
                      show: {opacity: 1, x: 0},
                    }}
                    className="border-t border-gray-800/70 px-3 pb-3 pt-5 font-mono text-xs font-semibold uppercase tracking-wide text-gray-300"
                  >
                    Account
                  </motion.div>
                  <ul>
                    {canViewTeam && (
                      <MobileNavLink path="/team" label="Invite team" />
                    )}
                    {canViewInvoice && (
                      <MobileNavLink path="/purchases" label="My Purchases" />
                    )}
                    {/* {canViewInvoice && (
                            <MobileNavLink path="/invoices" label="Invoices" />
                          )} */}
                    <MobileNavLink
                      label="Send Feedback"
                      onClick={() => {
                        setIsFeedbackDialogOpen(true, 'header')
                      }}
                    />

                    <motion.li
                      variants={{
                        hidden: {opacity: 0, x: -20},
                        show: {opacity: 1, x: 0},
                      }}
                    >
                      <LogOutButton className="flex h-full w-full items-center gap-0.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent" />
                    </motion.li>
                  </ul>
                </>
              )}
            </motion.ul>
          </motion.li>
        )}
      </ul>
    </div>
  )
}

const NavLink: React.FC<
  React.PropsWithChildren<{
    label: string | React.ReactElement
    icon?: React.FC<{isActive?: boolean}>
    path?: string
    className?: string
    onClick?: () => void
    title?: string
  }>
> = ({onClick, label, icon, path, className, title}) => {
  const router = useRouter()
  const isActive = router.asPath === path
  const IconEl = () =>
    React.isValidElement(icon) ? React.createElement(icon, {isActive}) : null

  if (onClick) {
    return (
      <li className="">
        <button
          onClick={onClick}
          aria-current={isActive ? 'page' : undefined}
          className={cx(
            'group flex h-full items-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium transition active:bg-transparent sm:gap-1 sm:px-2 lg:px-2.5 lg:text-base xl:px-3',
            {
              '': isActive,
            },
            className,
          )}
        >
          <span
            className={cx('transition group-hover:opacity-100', {
              'opacity-100': isActive,
              'opacity-90': !isActive,
            })}
          >
            {label}
          </span>
        </button>
      </li>
    )
  }
  return path ? (
    <li className="">
      <NextLink
        href={path}
        passHref
        className={cx(
          'group flex h-full items-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium transition active:bg-transparent sm:gap-1 sm:px-2 lg:px-2.5 lg:text-base xl:px-3',
          {
            '': isActive,
          },
          className,
        )}
        onClick={() => {
          track(`clicked ${title ?? label} link in nav`)
        }}
      >
        {icon ? React.createElement(icon, {isActive}) : null}
        <span
          className={cx('transition group-hover:opacity-100', {
            'opacity-100': isActive,
            'opacity-90': !isActive,
          })}
        >
          {label}
        </span>
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
  const item = {
    hidden: {opacity: 0, x: -20},
    show: {opacity: 1, x: 0},
  }

  if (onClick) {
    return (
      <motion.li variants={item}>
        <button
          onClick={onClick}
          className={cx(
            'flex h-full w-full items-center gap-1.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent',
            className,
          )}
        >
          {icon ? icon : null}
          {label}
        </button>
      </motion.li>
    )
  }
  return path ? (
    <motion.li variants={item}>
      <NextLink
        href={path}
        passHref
        className={cx(
          'flex h-full w-full items-center gap-1.5 px-3 py-3 text-base font-medium transition duration-100 hover:bg-gray-800/60 active:bg-transparent',
          className,
        )}
        onClick={() => {
          track(`clicked ${label} link in nav`)
        }}
      >
        {icon ? icon : null}
        {label}
      </NextLink>
    </motion.li>
  ) : null
}

const DropdownLink: React.FC<
  React.PropsWithChildren<LinkProps & {className?: string}>
> = ({href, ...props}) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <NextLink href={href} passHref legacyBehavior>
      <NavigationMenu.Link
        active={isActive}
        {...props}
        className={cx(
          'flex w-full rounded px-2 py-2 transition hover:bg-gray-700',
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
    <NextLink
      href="/"
      passHref
      aria-label={`${config.title} Home`}
      className={cx(
        'group group flex h-full flex-shrink-0 items-center font-text text-base font-semibold text-white md:text-lg lg:text-xl',
        className,
      )}
      tabIndex={router.pathname === '/' ? -1 : 0}
    >
      <span
        aria-hidden={!isMinified}
        className={cx('text-base', {
          'hidden md:block lg:hidden': !isMinified,
          'hidden sm:hidden md:block 2xl:hidden': isMinified,
        })}
      >
        TT.
      </span>
      <span
        aria-hidden={isMinified}
        className={cx('mr-0.5 font-light opacity-90', {
          'block md:hidden lg:block': !isMinified,
          'md:hidden xl:hidden 2xl:block': isMinified,
        })}
      >
        Total
      </span>
      <span
        aria-hidden={isMinified}
        className={cx({
          'block md:hidden lg:block': !isMinified,
          'md:hidden xl:hidden 2xl:block': isMinified,
        })}
      >
        TypeScript
      </span>
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
              className="flex h-full items-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium hover:radix-state-closed:bg-white/5 radix-state-open:bg-[#1F2735] sm:gap-1 sm:px-3 lg:text-base"
            >
              Account <ChevronDownIcon className="h-4 w-4" aria-hidden />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content
              onPointerMove={preventHover}
              onPointerLeave={preventHover}
              className="absolute left-0 top-[90%] w-full rounded"
            >
              <ul className="flex w-full flex-col items-start rounded bg-[#1F2735] p-1 text-sm lg:text-base">
                {canViewTeam && (
                  <li className="w-full">
                    <DropdownLink href="/team">Invite team</DropdownLink>
                  </li>
                )}
                {canViewInvoice && (
                  <li className="w-full">
                    <DropdownLink href="/purchases">Purchases</DropdownLink>
                  </li>
                )}
                {/* {canViewInvoice && (
                  <li className="w-full">
                    <DropdownLink href="/invoices">Invoices</DropdownLink>
                  </li>
                )} */}
                <li className="w-full">
                  <DropdownLink href="/faq">FAQ</DropdownLink>
                </li>
                <li className="w-full">
                  {/* <NavigationMenu.Link asChild> */}
                  <LogOutButton className="px-2 py-2" />
                  {/* </NavigationMenu.Link> */}
                </li>
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </li>
  )
}

const SearchBar: React.FC<{isMinified?: boolean | undefined}> = ({
  isMinified,
}) => {
  const {open: isSearchBarOpen, setOpen: setOpenSearchBar} = useSearchBar()

  return (
    <button
      className="group flex items-center gap-1 rounded-md px-2.5 py-2 text-base font-medium opacity-90 transition hover:opacity-100 sm:px-2 sm:py-2 md:px-2 md:text-sm lg:px-2 lg:text-base"
      onClick={() => {
        setOpenSearchBar(!isSearchBarOpen)
      }}
    >
      <div className="flex items-center gap-1">
        <SearchIcon
          className="h-3.5 w-3.5 opacity-80 transition group-hover:opacity-100"
          aria-hidden="true"
        />
        <span
          className={cx('', {
            'block md:hidden lg:block xl:block': isMinified,
            'block md:block lg:block': !isMinified,
          })}
        >
          Search
        </span>
      </div>
      <div
        className={cx(
          '-mb-0.5 hidden items-center gap-0.5 rounded bg-white/10 px-1 font-mono text-xs font-semibold text-gray-300 md:flex',
          {
            // 'bg-white/10': !isSearchBarOpen,
            // 'bg-white/20': isSearchBarOpen,
          },
        )}
        aria-label="shortcut"
      >
        <span>⌘</span>
        <span>K</span>
      </div>
    </button>
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
    <>
      <button
        onClick={async () => {
          await handleLogOut(router)
          toast.success('Logged out successfully')
        }}
        className={cn(
          'flex w-full rounded px-3 py-2 transition hover:bg-gray-700',
          className,
        )}
      >
        Log out
      </button>
    </>
  )
}

export const KeyIcon: React.FC<{isActive?: boolean}> = ({isActive = false}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 "
      fill="none"
      viewBox="0 0 14 14"
    >
      <path
        stroke="#FFDB80"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.463 1-1.21 1.211m0 0 1.816 1.816-2.12 2.12L9.133 4.33m2.12-2.119-2.12 2.12M6.644 6.818a3.33 3.33 0 1 1-4.71 4.71 3.33 3.33 0 0 1 4.71-4.71h0Zm0 0L9.133 4.33"
      />
      {isActive ? <circle cx="4.35" cy="9.2" r="1" fill="#FFDB80" /> : null}
    </svg>
  )
}

export const BookIcon: React.FC<{isActive?: boolean}> = ({
  isActive = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[15px]"
      fill="none"
      viewBox="0 0 13 13"
    >
      <path
        stroke="#A9A7FF"
        strokeLinecap="square"
        strokeMiterlimit="10"
        d="M7 10v.75C7 12 8.25 12 8.25 12h-6C1.55 12 1 11.45 1 10.75V10h6Zm2.5-7H12v-.75c0-.7-.55-1.25-1.25-1.25S9.5 1.55 9.5 2.25V3Z"
      />
      <path
        stroke="#A9A7FF"
        strokeLinecap="square"
        strokeMiterlimit="10"
        d="M2.5 10V2.25c0-.7.55-1.25 1.25-1.25h7c-.7 0-1.25.55-1.25 1.25v8.5c0 .7-.55 1.25-1.25 1.25H2.5"
      />
      <path
        fill={isActive ? '#A9A7FF' : 'none'}
        stroke="#A9A7FF"
        strokeLinecap="square"
        strokeMiterlimit="10"
        d="M2.5 2.25V10H7v.75C7 11.3 7.408 12 8.25 12c.7 0 1.25-.55 1.25-1.25v-8.5c0-.7.55-1.25 1.25-1.25h-7c-.7 0-1.25.55-1.25 1.25Z"
      />
    </svg>
  )
}

const PlayIcon: React.FC<{isActive?: boolean}> = ({isActive}) => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[11px]"
      fill="none"
      viewBox="0 0 10 13"
    >
      <path
        fill={isActive ? '#80E1FF' : 'none'}
        stroke="#80E1FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 1v11l8-5.5L1 1Z"
      />
    </svg>
  )
}

const FireIcon: React.FC<{isActive?: boolean}> = ({isActive = false}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-[13px]"
      fill="none"
      viewBox="0 0 11 13"
    >
      <path
        fill={isActive ? '#FF80AD' : 'none'}
        stroke="#FF80AD"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.861 1a6.568 6.568 0 0 1-1.255 2.877C2.858 4.854 1 5.821 1 8.22A4.342 4.342 0 0 0 3.21 12a2.356 2.356 0 0 1 .962-1.737c.533-.35.943-.86 1.171-1.457A4.342 4.342 0 0 1 7.476 12a4.342 4.342 0 0 0 2.21-3.78c0-1.215-.217-4.52-4.825-7.22Z"
      />
    </svg>
  )
}

type NavToggleProps = {
  isMenuOpened: boolean
  setMenuOpened: (value: boolean) => void
  menuControls?: AnimationControls
}

const NavToggle: React.FC<NavToggleProps> = ({
  isMenuOpened,
  setMenuOpened,
  menuControls,
}) => {
  const path01Variants = {
    open: {d: 'M3.06061 2.99999L21.0606 21'},
    closed: {d: 'M0 9.5L24 9.5'},
  }
  const path02Variants = {
    open: {d: 'M3.00006 21.0607L21 3.06064'},
    moving: {d: 'M0 14.5L24 14.5'},
    closed: {d: 'M0 14.5L15 14.5'},
  }
  const path01Controls = useAnimationControls()
  const path02Controls = useAnimationControls()

  return (
    <button
      className="z-10 mr-2 flex h-10 w-10 items-center justify-center rounded-md p-1 md:hidden"
      onClick={async () => {
        // menuControls.start(isMenuOpened ? 'close' : 'open')
        setMenuOpened(!isMenuOpened)
        if (!isMenuOpened) {
          await path02Controls.start(path02Variants.moving)
          path01Controls.start(path01Variants.open)
          path02Controls.start(path02Variants.open)
        } else {
          path01Controls.start(path01Variants.closed)
          await path02Controls.start(path02Variants.moving)
          path02Controls.start(path02Variants.closed)
        }
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.path
          {...path01Variants.closed}
          animate={path01Controls}
          transition={{duration: 0.2}}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <motion.path
          {...path02Variants.closed}
          animate={path02Controls}
          transition={{duration: 0.2}}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      </svg>
    </button>
  )
}

export default Navigation
