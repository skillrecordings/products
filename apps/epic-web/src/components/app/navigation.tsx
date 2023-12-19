import React from 'react'
import {useTheme} from 'next-themes'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from 'utils/analytics'
import ColorModeToggle from 'components/color-mode-toggle'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'
import {
  AnimatePresence,
  AnimationControls,
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
} from 'framer-motion'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {trpc} from 'trpc/trpc.client'
import Gravatar from 'react-gravatar'
import {signOut, useSession} from 'next-auth/react'
import {useMedia} from 'react-use'
import {cn} from '@skillrecordings/ui/utils/cn'
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
import Countdown, {zeroPad} from 'react-countdown'

type NavigationProps = {
  className?: string
  navigationContainerClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

export const useNavigationLinks = () => {
  const ability = useAbilities()
  const canCreateContent = ability.can('create', 'Content')
  const {theme} = useTheme()

  return [
    {
      label: (
        <>
          <span className="sm:hidden lg:inline-block">Pro</span> Workshops
        </>
      ),
      icon: (isHovered: boolean) => (
        <WorkshopsIcon isHovered={isHovered} theme={theme} />
      ),
      href: '/workshops',
    },
    {
      label: 'Tips',
      icon: (isHovered: boolean) => (
        <TipsIcon isHovered={isHovered} theme={theme} />
      ),
      href: canCreateContent ? '/creator/tips' : '/tips',
    },
    {
      label: (
        <>
          <span className="sm:hidden lg:inline-block">Free</span> Tutorials
        </>
      ),
      icon: (isHovered: boolean) => (
        <TutorialsIcon isHovered={isHovered} theme={theme} />
      ),
      href: '/tutorials',
    },
    {
      label: 'Articles',
      icon: (isHovered: boolean) => (
        <ArticlesIcon isHovered={isHovered} theme={theme} />
      ),
      href: '/articles',
    },
    // {
    //   label: 'Live Events',
    //   icon: (isHovered: boolean) => (
    //     <EventsIcon isHovered={isHovered} theme={theme} />
    //   ),
    //   href: '/events',
    // },
  ]
}

const Navigation: React.FC<NavigationProps> = ({
  className,
  size = 'md',
  navigationContainerClassName,
}) => {
  const {pathname, asPath, push} = useRouter()
  const isRoot = pathname === '/'
  const [menuOpen, setMenuOpen] = React.useState(false)
  const navigationLinks = useNavigationLinks()
  const {scrollY} = useScroll()
  const navHeight = useTransform(
    scrollY,
    // Map y from these values:
    [0, 500],
    // Into these values:
    [80, 48],
  )
  const isSmScreen = useMedia('(max-width: 640px)', false)

  const [hoveredNavItemIndex, setHoveredNavItemIndex] = React.useState(-1)

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
    })

  const {data: lastPurchase, status: lastPurchaseStatus} =
    trpc.purchases.getLastPurchase.useQuery()

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.length > 0
  const ability = useAbilities()
  const canInviteTeam = ability.can('invite', 'Team')
  const currentSale = useAvailableSale()

  return (
    <>
      <SaleBanner size={size} />
      <div
        className={cn(
          'fixed left-0 z-50 flex w-full flex-col items-center justify-center border-b border-foreground/5 bg-white/95 shadow shadow-gray-300/20 backdrop-blur-md dark:bg-background/90 dark:shadow-xl dark:shadow-black/20 print:hidden',
          navigationContainerClassName,
          {
            'top-[44px] sm:top-[36px]': currentSale,
            'top-0': !currentSale,
          },
        )}
      >
        <motion.nav
          aria-label="top"
          style={{height: size === 'sm' || isSmScreen ? 48 : navHeight}}
          className={twMerge(
            'relative mx-auto flex w-full max-w-screen-lg items-center justify-between px-3 text-sm',
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-current={isRoot}
              tabIndex={isRoot ? -1 : 0}
              passHref
              className="relative z-10 text-lg font-bold tracking-tight text-[#333753] dark:from-white dark:to-gray-400 dark:text-white"
              onContextMenu={(event) => {
                event.preventDefault()
                push('/brand')
              }}
            >
              <Logo />
            </Link>
            <div className="hidden items-center justify-start gap-2 font-medium md:flex lg:pl-2">
              {navigationLinks.map(({label, href, icon}, i) => {
                const isOvershadowed = false
                // (hoveredNavItemIndex !== i && hoveredNavItemIndex !== -1)

                return (
                  <Link
                    onMouseOver={() => {
                      setHoveredNavItemIndex(i)
                    }}
                    onMouseLeave={() => {
                      setHoveredNavItemIndex(-1)
                    }}
                    key={href}
                    href={href}
                    className={cx(
                      'group flex items-center gap-1 rounded-md px-1.5 py-1 transition lg:px-2.5',
                      {
                        'opacity-60': isOvershadowed,
                      },
                    )}
                    passHref
                    onClick={() => {
                      setHoveredNavItemIndex(i)
                      track(`clicked ${label} from navigation`, {
                        page: asPath,
                      })
                    }}
                  >
                    {icon(
                      (hoveredNavItemIndex === i ||
                        asPath === href ||
                        asPath.includes(href)) &&
                        !isOvershadowed,
                    )}{' '}
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Login className="hidden md:flex" />
            <User className="hidden md:flex" />
            {commercePropsStatus === 'success' && hasPurchase && (
              <>
                {canInviteTeam && lastPurchase ? (
                  <Link
                    href={`/products/${lastPurchase.slug}`}
                    className={cx('mr-3 hidden px-2.5 lg:block', {
                      underline: pathname === `/products/${lastPurchase.slug}`,
                    })}
                  >
                    Invite Team
                  </Link>
                ) : (
                  <Link
                    href="/products?s=purchased"
                    className={cx('mr-3 hidden px-2.5 lg:block', {
                      underline: pathname.includes('/products'),
                    })}
                  >
                    My Products
                  </Link>
                )}
              </>
            )}
            <ColorModeToggle className="hidden md:block" />
            <NavToggle isMenuOpened={menuOpen} setMenuOpened={setMenuOpen} />
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{y: -30, opacity: 0, scale: 0.9}}
                animate={{y: 0, opacity: 1, scale: 1}}
                exit={{y: -30, opacity: 0, scale: 0.9}}
                transition={{
                  type: 'spring',
                  duration: 0.5,
                }}
                className="absolute left-0 top-0 flex w-full flex-col gap-2 border-b border-gray-100 bg-white px-2 pb-5 pt-16 text-2xl font-medium shadow-2xl shadow-black/20 backdrop-blur-md dark:border-gray-900 dark:bg-black/90 dark:shadow-black/60 md:hidden"
              >
                {navigationLinks.map(({label, href, icon}) => {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
                      passHref
                      onClick={() => {
                        track(`clicked ${label} from navigation`, {
                          page: asPath,
                        })
                      }}
                    >
                      <span className="flex w-5 items-center justify-center">
                        {icon(true)}
                      </span>{' '}
                      {label}
                    </Link>
                  )
                })}

                <div className="flex w-full items-center justify-between px-3 pt-5 text-lg">
                  <Login />
                  <User />
                  {commercePropsStatus === 'success' &&
                    purchasedProductIds.length > 0 && (
                      <Link
                        href="/products?s=purchased"
                        className={cx(
                          // 'text-xs font-medium opacity-75 hover:underline hover:opacity-100',
                          {
                            underline: pathname === '/products',
                          },
                        )}
                      >
                        My Products
                      </Link>
                    )}
                  <ColorModeToggle />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </>
  )
}

export default Navigation

type IconProps = {
  isHovered: boolean
  theme: 'light' | 'dark'
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
  const ability = useAbilities()
  const canCreateContent = ability.can('create', 'Content')

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
              <span className="inline-flex gap-0.5 text-sm font-bold leading-tight">
                <span className="truncate sm:max-w-[8rem] lg:max-w-[11rem] xl:max-w-none">
                  {sessionData?.user?.name?.split(' ')[0]}
                </span>{' '}
                <ChevronDownIcon className="w-2" />
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {sessionData?.user?.email || 'Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-between"
              asChild
            >
              <Link
                href="/profile"
                className={cx({
                  underline: pathname.includes('/profile'),
                })}
              >
                Profile
              </Link>
            </DropdownMenuItem>
            {purchasedProductIds.length > 0 && (
              <DropdownMenuItem
                className="flex items-center justify-between"
                asChild
              >
                <Link
                  href="/products?s=purchased"
                  className={cx({
                    underline: pathname.includes('/products'),
                  })}
                >
                  My Products
                </Link>
              </DropdownMenuItem>
            )}
            {canCreateContent && (
              <>
                {' '}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  asChild
                >
                  <Link
                    href="/admin"
                    className={cx({
                      underline: pathname.includes('/admin'),
                    })}
                  >
                    Admin
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
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
            'hover:opacity-100flex group items-center gap-1 rounded-md px-2.5 py-1 transition',
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

export const ArticlesIcon: React.FC<IconProps> = ({
  isHovered,
  theme = 'dark',
}) => {
  const id = Math.random() * 100
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        fill={`url(#gradientArticles-${id})`}
        d="M15.742.676a.375.375 0 0 0-.367-.301H2.625a.374.374 0 0 0-.368.301l-.75 3.75a.374.374 0 0 0 .368.449h.75a.375.375 0 0 0 .371-.322C3.01 4.46 3.347 2.25 5.25 2.25H7.5v12.302a1.41 1.41 0 0 1-1.232 1.396l-1.44.18a.375.375 0 0 0-.328.372v.75c0 .207.168.375.375.375h8.25a.375.375 0 0 0 .375-.375v-.75a.375.375 0 0 0-.329-.372l-1.44-.18a1.409 1.409 0 0 1-1.231-1.396V2.25h2.25c1.893 0 2.24 2.21 2.254 2.303a.375.375 0 0 0 .37.322h.75a.374.374 0 0 0 .368-.449l-.75-3.75Z"
      />
      <defs>
        <linearGradient
          id={`gradientArticles-${id}`}
          x1="9"
          x2="9"
          y1=".375"
          y2="17.625"
          gradientUnits="userSpaceOnUse"
        >
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#FF9254'
                : theme === 'light'
                ? '#C2C4CF'
                : '#5B5E71',
            }}
            stopColor={
              isHovered ? '#FF9254' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#F8965F'
                : theme === 'light'
                ? '#C2C4CF'
                : '#393A46',
            }}
            stopColor={
              isHovered ? '#F8965F' : theme === 'light' ? '#C2C4CF' : '#393A46'
            }
            offset="1"
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const TutorialsIcon: React.FC<IconProps> = ({
  isHovered,
  theme = 'dark',
}) => {
  const id = Math.random() * 100
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="16"
      fill="none"
      viewBox="0 0 22 16"
    >
      <path
        fill={`url(#tutorialsGradient-${id})`}
        fillRule="evenodd"
        d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3Zm6 11.44V4.56a.3.3 0 0 1 .466-.25l5.16 3.44a.3.3 0 0 1 0 .5l-5.16 3.44A.3.3 0 0 1 9 11.44Z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id={`tutorialsGradient-${id}`}
          x1="11"
          x2="11"
          y1="0"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#FF5F5F'
                : theme === 'light'
                ? '#C2C4CF'
                : '#5B5E71',
            }}
            stopColor={
              isHovered ? '#FF5F5F' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#F33D3D'
                : theme === 'light'
                ? '#C2C4CF'
                : '#393A46',
            }}
            stopColor={
              isHovered ? '#F33D3D' : theme === 'light' ? '#C2C4CF' : '#393A46'
            }
            offset="1"
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const HamburgerMenuIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export const CrossIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      scale="24"
      aria-hidden
    >
      <path
        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
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
      className="absolute z-10 flex h-12 w-12 items-center justify-center p-1 md:hidden"
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

export const Logo: React.FC<{className?: string; withText?: boolean}> = ({
  className,
  withText = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-[127px]', className)}
      fill="none"
      viewBox={withText ? '0 0 264 70' : '0 0 70 70'}
    >
      {withText && (
        <g fill="currentColor">
          <path d="M92.593 36.536v6.189h9.061v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225Z"></path>
          <path
            fillRule="evenodd"
            d="M109.942 25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97h-2.593V25.662Zm2.593 10.12h4.488c1.088 0 1.98-.362 2.677-1.086.697-.753 1.059-1.673 1.059-2.76 0-2.231-1.589-3.848-3.736-3.848h-4.488v7.695Z"
            clipRule="evenodd"
          />
          <path d="M131.126 43.379V27.342h-3.089v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089Zm21.11 2.161c-2.955 0-5.409-.975-7.332-2.927-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.569 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.54-6.161-3.54-2.258 0-4.098.724-5.52 2.174-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.676 0 5.046-1.394 6.161-3.513l2.259 1.282c-.809 1.45-1.98 2.621-3.485 3.485-1.506.865-3.151 1.283-4.935 1.283Z" />
          <path
            fillRule="evenodd"
            d="M101.654 42.725v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225v6.189h9.061Zm-8.761-.3h9.061v3.053H89.7V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589Zm16.749-17.063h7.381c1.889 0 3.444.643 4.701 1.9 1.257 1.257 1.9 2.812 1.9 4.673 0 1.834-.643 3.416-1.9 4.673-1.257 1.257-2.812 1.9-4.701 1.9h-4.188v6.97h-3.193V25.362Zm2.893 19.816h-2.593V25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97Zm15.502-17.836v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089V27.342h-3.089Zm2.789.3h-3.089v-2.428h9.409v2.428h-3.127V43.08h3.127v2.428h-9.409V43.08h3.089V27.642Zm30.239 2.507-2.789 1.618-.145-.279c-1.059-2.038-3.32-3.379-5.895-3.379-2.188 0-3.947.7-5.306 2.085-1.362 1.388-2.033 3.123-2.033 5.226 0 2.076.671 3.81 2.033 5.199 1.359 1.386 3.118 2.085 5.306 2.085 2.575 0 4.837-1.341 5.896-3.353l.144-.274 2.787 1.583-.145.26c-.837 1.499-2.047 2.708-3.598 3.599-1.554.891-3.25 1.322-5.084 1.322-3.028 0-5.561-1.003-7.546-3.017-1.982-2.01-2.958-4.485-2.958-7.404 0-2.918.976-5.392 2.958-7.403 1.985-2.014 4.518-3.017 7.546-3.017 3.672 0 6.951 1.894 8.68 4.89l.149.259Zm-48.23 5.334h4.188c1.012 0 1.823-.334 2.459-.993.643-.696.977-1.542.977-2.555 0-2.072-1.462-3.547-3.436-3.547h-4.188v7.095Zm6.865-.787c-.697.724-1.589 1.087-2.677 1.087h-4.488v-7.695h4.488c2.147 0 3.736 1.617 3.736 3.847 0 1.088-.362 2.008-1.059 2.76Zm40.805 6.337c-.8 1.33-1.92 2.413-3.334 3.225-1.506.865-3.151 1.283-4.935 1.283-2.955 0-5.409-.976-7.332-2.928-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.462 0 6.556 1.732 8.266 4.482l.131.218.023.04-2.259 1.31a6.226 6.226 0 0 0-.144-.263c-1.168-1.997-3.451-3.278-6.017-3.278-2.258 0-4.098.725-5.52 2.175-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.565 0 4.848-1.28 6.015-3.251.051-.086.1-.173.146-.262l2.259 1.282-.07.123c-.027.046-.053.092-.081.137Z"
            clipRule="evenodd"
          />
          <path d="M174.058 45.178h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm27.294-8.643v6.19h9.061v2.453h-11.654V25.662h11.515v2.454h-8.922v5.994h8.225v2.425h-8.225Zm28.222-1.477c1.784.864 2.928 2.509 2.928 4.6 0 1.561-.558 2.872-1.645 3.931-1.088 1.06-2.426 1.59-4.015 1.59h-8.42V25.661h7.807c1.533 0 2.815.502 3.875 1.534 1.059 1.031 1.589 2.286 1.589 3.791 0 1.729-.697 3.095-2.119 4.07Zm-3.345-6.97h-5.214v5.966h5.214c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892Zm-5.214 14.665h5.827c1.756 0 3.095-1.394 3.095-3.179 0-.864-.307-1.617-.92-2.23-.586-.613-1.311-.92-2.175-.92h-5.827v6.329Z" />
          <path
            fillRule="evenodd"
            d="M174.281 45.478h-3.46l-5.777-20.116h3.359l4.241 15.27 4.507-15.27h3.069l4.507 15.27 4.241-15.27h3.359l-5.776 20.116h-3.461l-4.404-14.83-4.405 14.83Zm-.223-.3h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm36.655-2.753v3.053h-12.254V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589h9.061Zm-9.361.3v-6.19h8.225V34.11h-8.225v-5.994h8.922v-2.454h-11.515v19.516h11.654v-2.453h-9.061Zm16.77 2.753V25.362h8.107c1.607 0 2.966.53 4.084 1.619 1.118 1.088 1.68 2.42 1.68 4.006 0 1.66-.615 3.019-1.861 4.029 1.635.957 2.67 2.6 2.67 4.642 0 1.642-.59 3.03-1.736 4.146-1.146 1.117-2.561 1.674-4.224 1.674h-8.72Zm11.752-10.264a6.066 6.066 0 0 0-.3-.156c.094-.065.185-.131.273-.2 1.238-.958 1.846-2.256 1.846-3.87 0-1.506-.53-2.76-1.589-3.792-1.06-1.032-2.342-1.534-3.875-1.534h-7.807v19.516h8.42c1.589 0 2.927-.53 4.015-1.589 1.087-1.06 1.645-2.37 1.645-3.931 0-1.971-1.017-3.546-2.628-4.444Zm-1.827-6.027c-.505-.53-1.097-.8-1.818-.8h-4.914v5.367h4.914c1.469 0 2.599-1.166 2.599-2.683 0-.73-.248-1.35-.776-1.879l-.005-.005Zm-1.818 4.867c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892h-5.214v5.966h5.214Zm2.575 3.502-.005-.005c-.527-.553-1.173-.827-1.957-.827h-5.527v5.729h5.527c1.582 0 2.795-1.251 2.795-2.879a2.75 2.75 0 0 0-.833-2.018Zm-7.789 5.197v-6.329h5.827c.864 0 1.589.307 2.175.92.613.613.92 1.366.92 2.23 0 1.785-1.339 3.179-3.095 3.179h-5.827Z"
            clipRule="evenodd"
          />
          <path d="M239.041 32.853a.89.89 0 0 1-1.254 0 .89.89 0 0 1 0-1.254.89.89 0 0 1 1.254 0 .889.889 0 0 1 0 1.254Zm2.753-7.187h2.904c1.003 0 1.839.355 2.508 1.055.679.7 1.013 1.567 1.013 2.6 0 1.035-.334 1.902-1.013 2.602-.669.7-1.505 1.055-2.508 1.055h-2.904v-7.313Zm1.442 5.933h1.462c.638 0 1.15-.209 1.547-.627.397-.428.595-.971.595-1.65 0-.68-.198-1.223-.595-1.64-.397-.429-.909-.637-1.547-.637h-1.462v4.554Zm8.753-1.64v1.64h3.082v1.379h-4.524v-7.313h4.471v1.38h-3.029V28.6h2.768v1.358h-2.768Zm8.997 3.019H259.2l-2.455-7.313h1.567l1.786 5.62 1.776-5.62h1.578l-2.466 7.313Z" />
        </g>
      )}
      <path
        fill="url(#markGradient)"
        d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
      />
      <path
        fill="currentColor"
        d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
      />
      <defs>
        <linearGradient
          id="markGradient"
          x1="49.496"
          x2="20.585"
          y1="20.504"
          y2="49.431"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const EventsIcon: React.FC<IconProps> = ({isHovered, theme}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
    >
      <g clip-path="url(#a)">
        <path
          fill="url(#b)"
          d="M17.586 3.08a.756.756 0 0 0-.784.07l-4.8 3.6V4.5a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-2.25l4.8 3.6a.748.748 0 0 0 .786.07.751.751 0 0 0 .414-.67V3.75a.751.751 0 0 0-.414-.67Z"
        />
      </g>
      <defs>
        <linearGradient
          id="b"
          x1="9"
          x2="9"
          y1="1.5"
          y2="16.5"
          gradientUnits="userSpaceOnUse"
        >
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#1BD3C8'
                : theme === 'light'
                ? '#C2C4CF'
                : '#5B5E71',
            }}
          />
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#14C5C5'
                : theme === 'light'
                ? '#C2C4CF'
                : '#393A46',
            }}
            offset="1"
            stopColor="#393A46"
          />
        </linearGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const TipsIcon: React.FC<IconProps> = ({isHovered, theme = 'dark'}) => {
  const id = Math.random() * 100

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="12"
      fill="none"
      viewBox="0 0 18 12"
    >
      <motion.path
        fill={`url(#tipsGradient-${id})`}
        d="M1.866.202A1.2 1.2 0 0 0 0 1.2v9.6a1.2 1.2 0 0 0 1.866.998L8.4 7.442V10.8a1.2 1.2 0 0 0 1.866.998l7.2-4.8a1.2 1.2 0 0 0 0-1.996l-7.2-4.8A1.2 1.2 0 0 0 8.4 1.2v3.358L1.866.202Z"
      />
      <motion.path
        fill={`url(#tipsGradient-${id})`}
        d="M1.866.202A1.2 1.2 0 0 0 0 1.2v9.6a1.2 1.2 0 0 0 1.866.998L8.4 7.442V10.8a1.2 1.2 0 0 0 1.866.998l7.2-4.8a1.2 1.2 0 0 0 0-1.996l-7.2-4.8A1.2 1.2 0 0 0 8.4 1.2v3.358L1.866.202Z"
      />
      <defs>
        <linearGradient
          id={`tipsGradient-${id}`}
          x1="12.5"
          x2="-.5"
          y1="-2"
          y2="14.5"
          gradientUnits="userSpaceOnUse"
        >
          <motion.stop
            // animate={{
            //   stopColor: isHovered
            //     ? '#30B0FF'
            //     : theme === 'light'
            //     ? '#C2C4CF'
            //     : '#5B5E71',
            // }}
            stopColor={
              isHovered ? '#30B0FF' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <motion.stop
            offset="1"
            stopColor={
              isHovered ? '#5075FF' : theme === 'light' ? '#A4A5AF' : '#393A46'
            }
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const WorkshopsIcon: React.FC<IconProps> = ({isHovered, theme}) => {
  const id = Math.random() * 100
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.6565 1.42938C9.02065 0.812604 9.91295 0.812604 10.2771 1.42938L12.8368 5.76489C12.9176 5.90177 13.0318 6.01596 13.1687 6.09678L17.5042 8.6565C18.121 9.02065 18.121 9.91295 17.5042 10.2771L13.1687 12.8368C13.0318 12.9176 12.9176 13.0318 12.8368 13.1687L10.2771 17.5042C9.91294 18.121 9.02065 18.121 8.6565 17.5042L6.09677 13.1687C6.01595 13.0318 5.90177 12.9176 5.76489 12.8368L1.42938 10.2771C0.812604 9.91294 0.812604 9.02065 1.42938 8.6565L5.76489 6.09677C5.90177 6.01595 6.01596 5.90177 6.09678 5.76489L8.6565 1.42938Z"
        fill={`url(#workshopsGradient${id})`}
      />
      <defs>
        <linearGradient
          id={`workshopsGradient${id}`}
          fill={`url(#workshopsGradient${id})`}
          x1="9.46692"
          y1="0.0570553"
          x2="9.46692"
          y2="18.8768"
          gradientUnits="userSpaceOnUse"
        >
          <motion.stop
            animate={{
              stopColor: isHovered
                ? '#FFE55F'
                : theme === 'light'
                ? '#C2C4CF'
                : '#5B5E71',
            }}
            stopColor={
              isHovered ? '#FFE55F' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <motion.stop
            offset="1"
            stopColor={
              isHovered ? '#F39F3D' : theme === 'light' ? '#A4A5AF' : '#393A46'
            }
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const ExerciseIcon: React.FC<IconProps> = ({isHovered, theme}) => {
  const id = Math.random() * 100
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.831 0.0626895C13.9833 0.11338 14.1242 0.193588 14.2456 0.298734C14.3669 0.40388 14.4663 0.531903 14.5382 0.675488C14.61 0.819073 14.6529 0.975407 14.6643 1.13556C14.6757 1.29571 14.6555 1.45654 14.6047 1.60887L9.7156 16.2762C9.61317 16.5838 9.39272 16.8381 9.10275 16.9832C8.81279 17.1283 8.47706 17.1523 8.16943 17.0499C7.86179 16.9474 7.60745 16.727 7.46235 16.437C7.31725 16.1471 7.29329 15.8113 7.39573 15.5037L12.2848 0.836389C12.3355 0.684043 12.4157 0.543176 12.5209 0.421836C12.626 0.300496 12.754 0.201061 12.8976 0.129212C13.0412 0.0573628 13.1975 0.0145067 13.3577 0.00309257C13.5178 -0.00832159 13.6787 0.0119298 13.831 0.0626895ZM5.75299 4.0253C5.98213 4.25452 6.11085 4.56535 6.11085 4.88945C6.11085 5.21356 5.98213 5.52439 5.75299 5.7536L2.95031 8.55628L5.75299 11.359C5.86973 11.4717 5.96284 11.6066 6.0269 11.7557C6.09096 11.9048 6.12468 12.0652 6.12609 12.2275C6.1275 12.3898 6.09657 12.5507 6.03512 12.701C5.97366 12.8512 5.8829 12.9876 5.76814 13.1024C5.65337 13.2172 5.51691 13.3079 5.36669 13.3694C5.21648 13.4308 5.05553 13.4618 4.89324 13.4604C4.73094 13.4589 4.57056 13.4252 4.42144 13.3612C4.27231 13.2971 4.13744 13.204 4.02469 13.0873L0.357866 9.42043C0.128724 9.19122 0 8.88038 0 8.55628C0 8.23217 0.128724 7.92134 0.357866 7.69213L4.02469 4.0253C4.2539 3.79616 4.56474 3.66744 4.88884 3.66744C5.21294 3.66744 5.52378 3.79616 5.75299 4.0253ZM16.2474 4.0253C16.4767 3.79616 16.7875 3.66744 17.1116 3.66744C17.4357 3.66744 17.7465 3.79616 17.9757 4.0253L21.6426 7.69213C21.8717 7.92134 22.0004 8.23217 22.0004 8.55628C22.0004 8.88038 21.8717 9.19122 21.6426 9.42043L17.9757 13.0873C17.863 13.204 17.7281 13.2971 17.579 13.3612C17.4299 13.4252 17.2695 13.4589 17.1072 13.4604C16.9449 13.4618 16.7839 13.4308 16.6337 13.3694C16.4835 13.3079 16.3471 13.2172 16.2323 13.1024C16.1175 12.9876 16.0268 12.8512 15.9653 12.701C15.9039 12.5507 15.8729 12.3898 15.8743 12.2275C15.8758 12.0652 15.9095 11.9048 15.9735 11.7557C16.0376 11.6066 16.1307 11.4717 16.2474 11.359L19.0501 8.55628L16.2474 5.7536C16.0183 5.52439 15.8896 5.21356 15.8896 4.88945C15.8896 4.56535 16.0183 4.25452 16.2474 4.0253Z"
        fill={`url(#exerciseGradient-${id})`}
      />
      <defs>
        <linearGradient
          id={`exerciseGradient-${id}`}
          x1="15.2785"
          y1="-2.85212"
          x2="4.65076"
          y2="19.4004"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor={
              isHovered ? '#34D399' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <stop
            offset="1"
            stopColor={
              isHovered ? '#10B981' : theme === 'light' ? '#A4A5AF' : '#393A46'
            }
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const TalkIcon: React.FC<IconProps> = ({isHovered, theme}) => {
  const id = Math.random() * 100
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 8.3125C19 3.72163 14.7464 0 9.5 0C4.25362 0 0 3.72163 0 8.3125C0 12.9034 4.25362 16.625 9.5 16.625C10.2113 16.625 10.9024 16.5514 11.5698 16.4208L15.7261 18.9145C15.8199 18.9703 15.9256 18.9988 16.0312 18.9988C16.1322 18.9988 16.2331 18.9739 16.3234 18.9216C16.5098 18.8159 16.625 18.6188 16.625 18.4051V13.7964C18.0987 12.3322 19 10.4167 19 8.3125Z"
        fill={`url(#tipsgradient-${id})`}
      />
      <defs>
        <linearGradient
          id={`tipsgradient-${id}`}
          x1="13.1948"
          y1="-3.16651"
          x2="-0.333843"
          y2="18.8679"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor={
              isHovered ? '#999DB5' : theme === 'light' ? '#C2C4CF' : '#5B5E71'
            }
          />
          <stop
            offset="1"
            stopColor={
              isHovered ? '#666778' : theme === 'light' ? '#A4A5AF' : '#393A46'
            }
          />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const SaleBanner: React.FC<{size?: 'sm' | 'md' | 'lg'}> = ({size}) => {
  const currentSale = useAvailableSale()

  if (!currentSale) return null

  return (
    <div
      className={cn(
        `h-[${currentSale.bannerHeight}px] left-0 top-0 z-[60] w-full`,
        {
          fixed: size !== 'sm',
          absolute: size === 'sm',
        },
      )}
    >
      <Link
        href="/#buy"
        className={cn(`flex h-full w-full bg-primary py-1.5 text-white`)}
        onClick={() => {
          track('clicked sale banner cta', {
            location: 'nav',
          })
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-2 text-xs font-medium sm:space-x-4 sm:text-sm">
          <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
            <strong>
              Save {(Number(currentSale.percentageDiscount) * 100).toString()}%
              on{' '}
              {currentSale.product?.name ||
                process.env.NEXT_PUBLIC_PRODUCT_NAME}
            </strong>
            <Countdown
              date={currentSale.expires?.toString()}
              renderer={({days, hours, minutes, seconds}) => {
                return (
                  <div className="flex space-x-1">
                    <span>Price goes up in:</span>
                    <span className="font-orig tabular-nums">{days}d</span>
                    <span className="font-orig tabular-nums">{hours}h</span>
                    <span className="font-orig tabular-nums">{minutes}m</span>
                    <span className="font-orig tabular-nums">
                      {zeroPad(seconds)}s
                    </span>
                  </div>
                )
              }}
            />
          </div>
          <div className="flex-shrink-0 rounded bg-white px-2 py-0.5 font-semibold text-primary shadow-md">
            Become an Epic Dev
          </div>
        </div>
      </Link>
    </div>
  )
}

export const useAvailableSale = () => {
  const {data} = trpc.pricing.defaultCoupon.useQuery()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
    })

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.length > 0

  if (!data) return null
  if (hasPurchase) return null

  return {...data, bannerHeight: data ? 36 : 0}
}
