import React from 'react'
import {useTheme} from 'next-themes'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import ColorModeToggle from '@/components/color-mode-toggle'
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
import {trpc} from '@/trpc/trpc.client'
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
import {useGlobalBanner} from '@/hooks/use-global-banner'
import pluralize from 'pluralize'
import {useFeedback} from '@/feedback-widget/feedback-context'

type NavigationProps = {
  className?: string
  navigationContainerClassName?: string
  globalBannerClassName?: string
  enableScrollAnimation?: boolean
  enableGlobalBanner?: boolean
  isNavigationFixed?: boolean
}

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

export const useNavigationLinks = () => {
  const ability = useAbilities()
  const canCreateContent = ability.can('create', 'Content')
  // const {theme} = useTheme()
  // const [hasMounted, setHasMounted] = React.useState(false)
  // React.useEffect(() => {
  //   setHasMounted(true)
  // }, [])

  const {data: allProducts, status: allProductsStatus} =
    trpc.products.getAllProducts.useQuery()
  const LEGACY_PRODUCT_IDS =
    allProducts
      ?.filter(
        (product: {state: 'draft' | 'active' | 'unavailable'}) =>
          product.state === 'unavailable',
      )
      .map((product: {productId: string}) => product.productId) || []
  const V2_PRODUCT_IDS =
    allProducts
      ?.filter(
        (product: {state: 'draft' | 'active' | 'unavailable'}) =>
          product.state !== 'unavailable',
      )
      .map((product: {productId: string}) => product.productId) || []
  const {data: allPurchases, status} =
    trpc.purchases.getAllPurchasesForUser.useQuery()
  const hasLegacyPurchase = allPurchases?.some((purchase) =>
    LEGACY_PRODUCT_IDS.includes(purchase.productId),
  )
  const hasV2Purchase = allPurchases?.some((purchase) =>
    V2_PRODUCT_IDS.includes(purchase.productId),
  )

  return [
    {
      label: (
        <>
          Workshops
          {/* {status === 'loading' ? (
            <Spinner className="absolute right-1 top-2.5 h-2 w-2" />
          ) : null} */}
        </>
      ),
      href: '/workshops',
      // href: !allPurchases
      //   ? '/workshops'
      //   : hasLegacyPurchase && !hasV2Purchase
      //   ? '/learn'
      //   : '/workshops',
    },
    {
      label: 'Tutorials',
      href: '/tutorials',
    },
    {
      label: 'Articles',
      href: '/articles',
    },
    // {
    //   label: 'Livestreams',
    //   href: '/livestreams',
    // },
    {
      label: 'Podcast',
      href: '/podcast',
    },
    {
      label: 'FAQ',
      href: '/faq',
    },
    ...(hasLegacyPurchase
      ? [
          {
            label: (
              <>
                Modules{' '}
                <sup className="relative font-mono text-sm font-bold opacity-80 sm:-mr-1 sm:text-[10px]">
                  v1
                </sup>
              </>
            ),
            href: '/learn',
          },
        ]
      : []),
  ]
}

const Navigation: React.FC<NavigationProps> = ({
  className,
  globalBannerClassName,
  enableGlobalBanner = true,
  navigationContainerClassName,
  enableScrollAnimation = true,
  isNavigationFixed = true,
}) => {
  const {data: sessionData, status: sessionStatus} = useSession()
  const {pathname, asPath, push} = useRouter()
  const isRoot = pathname === '/'
  const [menuOpen, setMenuOpen] = React.useState(false)
  const navigationLinks = useNavigationLinks()
  const {isShowingSiteBanner, bannerHeight, scrollDirection} = useGlobalBanner()

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
  const {setIsFeedbackDialogOpen} = useFeedback()

  return (
    <>
      <Banner
        className={globalBannerClassName}
        enableScrollAnimation={enableScrollAnimation}
      />
      <motion.div
        className={cn(
          'z-50 flex w-full flex-col items-center justify-center border-b border-foreground/5 bg-white/95 shadow shadow-gray-300/20 backdrop-blur-md transition dark:bg-background/90 dark:shadow-xl dark:shadow-black/20 print:hidden',
          navigationContainerClassName,
          {'fixed left-0 top-0': isNavigationFixed},
        )}
        style={{
          translateY: isShowingSiteBanner
            ? enableScrollAnimation
              ? scrollDirection === 'up' || !scrollDirection
                ? bannerHeight
                : 0
              : bannerHeight
            : 0,
        }}
      >
        <motion.nav
          aria-label="top"
          className={twMerge(
            'relative mx-auto flex h-12 w-full max-w-screen-xl items-stretch justify-between px-3 text-sm',
            className,
          )}
        >
          <div className="flex items-stretch gap-2">
            <Link
              href="/"
              aria-current={isRoot}
              tabIndex={isRoot ? -1 : 0}
              passHref
              className="relative z-10 flex items-center text-lg font-bold tracking-tight text-[#333753] dark:from-white dark:to-gray-400 dark:text-white"
              onContextMenu={(event) => {
                event.preventDefault()
                push('/brand')
              }}
            >
              <Logo />
            </Link>
            <div className="hidden items-stretch justify-start font-medium md:flex lg:pl-2">
              {navigationLinks.map(({label, href}, i) => {
                const isCurrent = asPath === href || asPath.includes(`${href}/`)

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cx(
                      'group relative flex items-center gap-1 border-b px-2.5 py-1 transition ease-in-out lg:px-3',
                      {
                        'border-primary': isCurrent,
                        'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/30':
                          !isCurrent,
                      },
                    )}
                    passHref
                    onClick={() => {
                      track(`clicked ${label} from navigation`, {
                        page: asPath,
                      })
                    }}
                  >
                    {/* {icon(
                      (hoveredNavItemIndex === i ||
                        asPath === href ||
                        asPath.includes(`${href}/`)) &&
                        !isOvershadowed,
                    )}{' '} */}
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-stretch justify-end">
            <Login className="hidden md:flex" />
            {sessionData?.user && (
              <button
                className="mr-3 hidden items-center lg:flex"
                onClick={() => {
                  setIsFeedbackDialogOpen(true)
                }}
              >
                Feedback
              </button>
            )}
            {commercePropsStatus === 'success' && hasPurchase && (
              <>
                {canInviteTeam && lastPurchase ? (
                  <Link
                    href={`/products/${lastPurchase.slug}`}
                    className={cx('mr-3 hidden items-center px-2.5 lg:flex', {
                      underline: pathname === `/products/${lastPurchase.slug}`,
                    })}
                  >
                    Invite Team
                  </Link>
                ) : (
                  <Link
                    href="/products?s=purchased"
                    className={cx('mr-3 hidden items-center px-2.5 lg:flex', {
                      underline: pathname.includes('/products'),
                    })}
                  >
                    My Products
                  </Link>
                )}
              </>
            )}
            <User className="hidden md:flex" />
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
                className="absolute left-0 top-0 flex w-full flex-col gap-2 border-b border-border bg-background px-2 pb-5 pt-16 text-2xl font-medium shadow-2xl shadow-black/20 backdrop-blur-md dark:border-gray-900 dark:bg-black/90 dark:shadow-black/60 md:hidden"
              >
                {navigationLinks.map(({label, href}) => {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-1 rounded-md px-3 py-2 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
                      passHref
                      onClick={() => {
                        track(`clicked ${label} from navigation`, {
                          page: asPath,
                        })
                      }}
                    >
                      {/* <span className="flex w-5 items-center justify-center">
                        {icon(true)}
                      </span>{' '} */}
                      {label}
                    </Link>
                  )
                })}
                {commercePropsStatus === 'success' &&
                  purchasedProductIds.length > 0 && (
                    <Link
                      href="/products?s=purchased"
                      className="flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
                    >
                      My Products
                    </Link>
                  )}
                {sessionData?.user && (
                  <button
                    className="flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
                    onClick={() => {
                      setIsFeedbackDialogOpen(true)
                    }}
                  >
                    Feedback
                  </button>
                )}
                <div className="flex w-full items-center justify-between px-3 pt-5 text-lg">
                  <Login />
                  <User />

                  <ColorModeToggle />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.div>
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
  const {setIsFeedbackDialogOpen} = useFeedback()

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
            <DropdownMenuItem
              className="flex w-full items-center justify-between"
              asChild
            >
              <button
                onClick={() => {
                  setIsFeedbackDialogOpen(true)
                }}
              >
                Feedback
              </button>
            </DropdownMenuItem>
            {canCreateContent && (
              <>
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
  const id = `articles_icon_${theme}`
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
  const id = `tutorials_icon_${theme}`
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
    <>
      <svg
        className={cn('w-[127px]', className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 329 87"
      >
        <g
          className="text-primary"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        >
          <path d="M60.329 43.943c10.26-8.038 16.045-15.707 13.881-19.455-3.065-5.308-20.92-.738-39.88 10.209C15.37 45.642 2.485 58.82 5.55 64.129c1.652 2.861 7.599 2.853 15.699.524"></path>
          <path d="M52.865 49.566c-7.136 4.757-12.977 6.876-12.685 7.136 16.779 8.708 31.266 12.212 34.03 7.425 2.833-4.907-7.962-16.536-24.585-26.913M21.311 23.977c-8.132-2.346-14.105-2.362-15.761.506-2.18 3.777 3.71 11.535 14.117 19.64"></path>
          <path d="M48.41 18.938c-2.037-8.72-5.102-14.27-8.53-14.27-6.13 0-11.099 17.748-11.099 39.64 0 21.894 4.97 39.642 11.1 39.642 3.377 0 6.402-5.389 8.438-13.89"></path>
        </g>
        <path
          fill="currentColor"
          d="M92.727 43V9.216h22.764v5.89H99.87v8.05h14.45v5.888H99.87v8.067h15.687V43h-22.83Zm28.311 9.502v-34.84h6.928v4.256h.314c.308-.682.753-1.375 1.336-2.078.594-.715 1.364-1.31 2.31-1.782.956-.484 2.144-.726 3.563-.726a9.52 9.52 0 0 1 5.113 1.452c1.562.957 2.81 2.403 3.745 4.338.935 1.925 1.402 4.339 1.402 7.242 0 2.826-.456 5.213-1.369 7.16-.902 1.935-2.133 3.403-3.695 4.404-1.551.99-3.288 1.484-5.213 1.484-1.364 0-2.524-.225-3.481-.676-.945-.45-1.721-1.017-2.325-1.699-.605-.693-1.067-1.391-1.386-2.095h-.215v13.56h-7.027Zm6.879-22.171c0 1.507.209 2.82.627 3.943.418 1.121 1.023 1.996 1.814 2.623.792.615 1.754.923 2.887.923 1.144 0 2.112-.313 2.903-.94.792-.638 1.392-1.518 1.799-2.64.417-1.132.626-2.435.626-3.909 0-1.463-.203-2.75-.61-3.86-.407-1.11-1.006-1.98-1.798-2.606-.792-.627-1.765-.94-2.92-.94-1.144 0-2.111.302-2.903.907-.781.604-1.38 1.462-1.798 2.573-.418 1.11-.627 2.42-.627 3.926ZM150.434 43V17.662h7.027V43h-7.027Zm3.53-28.604c-1.045 0-1.941-.347-2.689-1.04-.736-.703-1.105-1.544-1.105-2.523 0-.968.369-1.798 1.105-2.491.748-.704 1.644-1.056 2.689-1.056 1.045 0 1.936.352 2.673 1.056.747.693 1.121 1.523 1.121 2.49 0 .98-.374 1.82-1.121 2.525-.737.693-1.628 1.039-2.673 1.039Zm20.575 29.099c-2.595 0-4.828-.55-6.697-1.65-1.859-1.11-3.289-2.65-4.289-4.619-.99-1.968-1.485-4.234-1.485-6.796 0-2.595.5-4.872 1.501-6.83 1.012-1.968 2.447-3.502 4.305-4.602 1.859-1.11 4.07-1.666 6.632-1.666 2.21 0 4.146.402 5.807 1.204 1.66.803 2.974 1.93 3.942 3.382.968 1.452 1.501 3.156 1.6 5.114h-6.631c-.187-1.265-.682-2.282-1.485-3.052-.792-.78-1.831-1.171-3.118-1.171-1.088 0-2.04.297-2.853.89-.803.583-1.43 1.436-1.881 2.557-.451 1.122-.676 2.48-.676 4.075 0 1.617.22 2.991.66 4.124.45 1.133 1.083 1.996 1.897 2.59.813.594 1.765.89 2.853.89.803 0 1.524-.164 2.161-.494a4.166 4.166 0 0 0 1.6-1.435c.429-.638.71-1.403.842-2.293h6.631c-.11 1.935-.638 3.64-1.583 5.114-.935 1.462-2.227 2.606-3.877 3.43-1.65.826-3.602 1.238-5.856 1.238ZM201.238 43V9.216h13.329c2.551 0 4.728.457 6.532 1.37 1.815.901 3.195 2.182 4.14 3.843.957 1.65 1.436 3.59 1.436 5.823 0 2.243-.484 4.174-1.452 5.79-.968 1.606-2.37 2.837-4.207 3.695-1.825.858-4.036 1.287-6.631 1.287h-8.924v-5.74h7.769c1.364 0 2.497-.188 3.399-.562.901-.373 1.572-.934 2.012-1.682.451-.748.676-1.677.676-2.788 0-1.122-.225-2.067-.676-2.837-.44-.77-1.116-1.353-2.029-1.749-.902-.407-2.04-.61-3.415-.61h-4.816V43h-7.143Zm18.244-15.374L227.879 43h-7.885l-8.215-15.374h7.703Zm23.247 15.869c-2.606 0-4.849-.528-6.73-1.584-1.87-1.067-3.31-2.573-4.322-4.52-1.012-1.957-1.518-4.272-1.518-6.944 0-2.607.506-4.894 1.518-6.863 1.012-1.968 2.436-3.503 4.272-4.602 1.848-1.1 4.015-1.65 6.5-1.65 1.672 0 3.228.27 4.668.808a10.346 10.346 0 0 1 3.794 2.392c1.089 1.067 1.936 2.409 2.541 4.025.605 1.606.907 3.487.907 5.642v1.93h-21.395v-4.355h14.78c0-1.012-.22-1.908-.66-2.689a4.726 4.726 0 0 0-1.831-1.83c-.77-.452-1.666-.677-2.689-.677-1.066 0-2.012.247-2.837.742a5.196 5.196 0 0 0-1.913 1.963c-.462.814-.699 1.721-.71 2.722v4.14c0 1.254.231 2.337.693 3.25a5.07 5.07 0 0 0 1.996 2.112c.858.495 1.875.742 3.052.742.781 0 1.495-.11 2.144-.33a4.441 4.441 0 0 0 1.666-.99 4.3 4.3 0 0 0 1.056-1.616l6.5.429c-.33 1.561-1.007 2.925-2.029 4.09-1.012 1.155-2.321 2.057-3.926 2.706-1.595.638-3.437.957-5.527.957Zm23.441-.017c-1.616 0-3.057-.28-4.322-.84-1.264-.573-2.265-1.414-3.002-2.525-.726-1.121-1.089-2.518-1.089-4.19 0-1.407.259-2.59.776-3.546a6.267 6.267 0 0 1 2.111-2.31c.891-.583 1.903-1.023 3.035-1.32a23.15 23.15 0 0 1 3.596-.626 91.264 91.264 0 0 0 3.564-.43c.901-.142 1.556-.351 1.963-.626.407-.275.61-.682.61-1.22v-.1c0-1.045-.33-1.853-.99-2.425-.649-.572-1.572-.858-2.771-.858-1.265 0-2.271.28-3.019.842-.748.55-1.243 1.242-1.485 2.078l-6.499-.528c.33-1.54.979-2.87 1.947-3.992.967-1.132 2.216-2.001 3.744-2.606 1.54-.616 3.321-.924 5.345-.924 1.408 0 2.755.165 4.041.495 1.298.33 2.447.841 3.448 1.534a7.455 7.455 0 0 1 2.392 2.672c.583 1.078.874 2.37.874 3.877V43h-6.664v-3.514h-.198a7.148 7.148 0 0 1-1.633 2.095c-.682.594-1.501 1.062-2.458 1.402-.957.33-2.062.495-3.316.495Zm2.013-4.85c1.034 0 1.946-.203 2.738-.61.792-.418 1.413-.979 1.864-1.682.451-.704.677-1.502.677-2.392v-2.69c-.22.144-.523.276-.908.397-.374.11-.797.214-1.27.313-.473.088-.946.17-1.419.248l-1.286.181c-.825.121-1.545.313-2.161.577-.616.264-1.095.622-1.435 1.073-.341.44-.512.99-.512 1.65 0 .956.347 1.687 1.039 2.193.704.495 1.595.743 2.673.743Zm29.156 4.867c-2.595 0-4.827-.55-6.697-1.65-1.858-1.11-3.288-2.65-4.289-4.619-.99-1.968-1.485-4.234-1.485-6.796 0-2.595.501-4.872 1.502-6.83 1.011-1.968 2.447-3.502 4.305-4.602 1.859-1.11 4.069-1.666 6.632-1.666 2.21 0 4.146.402 5.806 1.204 1.661.803 2.975 1.93 3.943 3.382.967 1.452 1.501 3.156 1.6 5.114h-6.632c-.187-1.265-.681-2.282-1.484-3.052-.792-.78-1.831-1.171-3.118-1.171-1.089 0-2.04.297-2.854.89-.803.583-1.429 1.436-1.88 2.557-.451 1.122-.677 2.48-.677 4.075 0 1.617.22 2.991.66 4.124.451 1.133 1.083 1.996 1.897 2.59.814.594 1.765.89 2.854.89.803 0 1.523-.164 2.161-.494a4.173 4.173 0 0 0 1.6-1.435c.429-.638.709-1.403.841-2.293h6.632c-.11 1.935-.638 3.64-1.584 5.114-.935 1.462-2.227 2.606-3.876 3.43-1.65.826-3.602 1.238-5.857 1.238Zm29.293-25.833v5.279h-15.258v-5.279h15.258Zm-11.794-6.07h7.027v23.622c0 .649.099 1.155.297 1.517.198.352.473.6.825.743.363.143.781.214 1.253.214.33 0 .66-.027.99-.082.33-.066.583-.116.759-.149l1.105 5.23a19.9 19.9 0 0 1-1.484.379c-.638.154-1.414.247-2.326.28-1.694.066-3.179-.159-4.454-.676-1.265-.517-2.249-1.32-2.953-2.408-.704-1.09-1.05-2.464-1.039-4.124V11.592Z"
        ></path>
        <path
          fill="currentColor"
          d="M92.612 80.263V59.31h2.415v7.735h.204c.178-.273.423-.62.737-1.043.32-.43.778-.812 1.371-1.146.6-.341 1.412-.512 2.435-.512 1.323 0 2.49.331 3.499.993 1.01.661 1.797 1.6 2.364 2.813.566 1.214.849 2.647.849 4.297 0 1.665-.283 3.107-.849 4.328-.567 1.214-1.351 2.156-2.354 2.824-1.002.662-2.158.993-3.468.993-1.01 0-1.818-.168-2.425-.502-.607-.34-1.074-.726-1.402-1.156-.327-.437-.58-.798-.757-1.085h-.286v2.415h-2.333Zm2.374-7.858c0 1.187.174 2.234.522 3.141.347.9.856 1.607 1.524 2.118.669.505 1.487.757 2.456.757 1.009 0 1.851-.266 2.527-.798.682-.538 1.193-1.261 1.534-2.169.348-.914.522-1.93.522-3.048 0-1.106-.17-2.101-.511-2.988-.335-.894-.843-1.6-1.525-2.118-.675-.525-1.524-.788-2.547-.788-.983 0-1.808.25-2.476.747-.669.491-1.174 1.18-1.515 2.067-.34.88-.511 1.906-.511 3.08Zm16.186 13.751c-.41 0-.774-.034-1.095-.102-.321-.061-.542-.123-.665-.184l.614-2.128c.586.15 1.105.204 1.555.163.45-.04.849-.242 1.197-.603.355-.355.679-.931.972-1.73l.45-1.227-5.811-15.797h2.619l4.338 12.523h.164l4.338-12.523h2.619l-6.671 18.007c-.3.812-.672 1.483-1.115 2.015a4.173 4.173 0 0 1-1.545 1.198c-.58.259-1.234.388-1.964.388Zm22.913-5.893V59.31h2.537v10.395h.246l9.412-10.395h3.315l-8.799 9.454 8.799 11.5h-3.069l-7.285-9.74-2.619 2.947v6.793h-2.537Zm23.903.328c-1.515 0-2.821-.335-3.919-1.003-1.091-.675-1.934-1.617-2.527-2.824-.587-1.214-.88-2.626-.88-4.236 0-1.61.293-3.028.88-4.256.593-1.235 1.419-2.196 2.476-2.885 1.064-.696 2.305-1.044 3.724-1.044.819 0 1.627.137 2.425.41a6.008 6.008 0 0 1 2.179 1.33c.655.607 1.177 1.411 1.566 2.414.388 1.003.583 2.237.583 3.704v1.023h-12.114v-2.087h9.658c0-.887-.177-1.678-.532-2.374a4.01 4.01 0 0 0-1.494-1.647c-.641-.403-1.398-.604-2.271-.604-.962 0-1.794.239-2.496.716a4.71 4.71 0 0 0-1.607 1.842 5.412 5.412 0 0 0-.562 2.435v1.392c0 1.186.204 2.192.613 3.018.417.818.993 1.442 1.73 1.872.736.423 1.592.634 2.568.634a5.22 5.22 0 0 0 1.718-.266 3.676 3.676 0 0 0 1.341-.818c.375-.368.665-.825.869-1.371l2.333.655a5.164 5.164 0 0 1-1.238 2.087c-.58.593-1.296 1.057-2.148 1.391-.853.328-1.811.492-2.875.492Zm12.594-9.782v9.454h-2.414V64.548h2.333v2.455h.204a4.487 4.487 0 0 1 1.678-1.923c.75-.491 1.719-.737 2.906-.737 1.064 0 1.995.218 2.793.655.798.43 1.419 1.084 1.862 1.964.443.873.665 1.978.665 3.315v9.986h-2.415v-9.822c0-1.234-.32-2.196-.961-2.885-.641-.696-1.521-1.044-2.64-1.044-.771 0-1.46.167-2.067.502-.6.334-1.074.822-1.422 1.463-.348.64-.522 1.418-.522 2.332Zm21.274-6.261v2.046h-8.144v-2.046h8.144Zm-5.771-3.765h2.415V75.76c0 .682.099 1.194.297 1.535.204.334.463.56.777.675a3.1 3.1 0 0 0 1.013.164c.266 0 .484-.014.655-.04l.409-.083.491 2.17a4.89 4.89 0 0 1-.685.183 5.045 5.045 0 0 1-1.115.103 4.864 4.864 0 0 1-2.006-.44 3.977 3.977 0 0 1-1.616-1.34c-.423-.6-.635-1.358-.635-2.272V60.783Zm34.695 5.074h-2.538a5.276 5.276 0 0 0-2.138-3.315 5.72 5.72 0 0 0-1.75-.859 6.982 6.982 0 0 0-2.005-.286c-1.269 0-2.418.32-3.448.961-1.023.642-1.838 1.586-2.445 2.834-.6 1.249-.9 2.78-.9 4.594 0 1.815.3 3.346.9 4.594.607 1.248 1.422 2.193 2.445 2.834 1.03.641 2.179.962 3.448.962.696 0 1.364-.096 2.005-.287a5.86 5.86 0 0 0 1.75-.849 5.41 5.41 0 0 0 1.351-1.401c.375-.56.637-1.2.787-1.924h2.538c-.191 1.071-.539 2.03-1.044 2.875a7.865 7.865 0 0 1-1.882 2.159 8.25 8.25 0 0 1-2.528 1.34c-.927.307-1.92.46-2.977.46-1.787 0-3.376-.436-4.768-1.309-1.391-.873-2.486-2.114-3.284-3.724-.798-1.61-1.197-3.52-1.197-5.73 0-2.21.399-4.12 1.197-5.73.798-1.609 1.893-2.85 3.284-3.723 1.392-.873 2.981-1.31 4.768-1.31 1.057 0 2.05.153 2.977.46a8.131 8.131 0 0 1 2.528 1.35 7.724 7.724 0 0 1 1.882 2.15c.505.838.853 1.797 1.044 2.874Zm5.532 14.57a1.77 1.77 0 0 1-1.299-.542 1.77 1.77 0 0 1-.542-1.3c0-.505.18-.938.542-1.3a1.772 1.772 0 0 1 1.299-.541c.505 0 .938.18 1.3.542.361.361.542.794.542 1.3 0 .333-.085.64-.256.92a1.91 1.91 0 0 1-.665.675c-.273.164-.58.246-.921.246Zm21.072-.164h-6.466V59.31h6.752c2.033 0 3.772.42 5.218 1.259 1.446.832 2.555 2.03 3.325 3.591.771 1.555 1.156 3.417 1.156 5.586 0 2.183-.388 4.062-1.166 5.638-.777 1.569-1.91 2.776-3.397 3.622-1.487.839-3.294 1.258-5.422 1.258Zm-3.929-2.25h3.765c1.733 0 3.168-.335 4.307-1.003 1.139-.669 1.989-1.62 2.548-2.855.559-1.234.839-2.704.839-4.41 0-1.691-.276-3.148-.829-4.368-.552-1.228-1.378-2.17-2.476-2.824-1.098-.662-2.465-.993-4.103-.993h-4.051v16.452Zm24.228 2.578c-1.419 0-2.664-.338-3.735-1.013-1.064-.676-1.896-1.62-2.496-2.834-.594-1.215-.89-2.633-.89-4.257 0-1.637.296-3.066.89-4.287.6-1.22 1.432-2.169 2.496-2.844 1.071-.675 2.316-1.013 3.735-1.013 1.418 0 2.66.338 3.724 1.013 1.071.675 1.903 1.624 2.496 2.844.601 1.221.901 2.65.901 4.287 0 1.624-.3 3.042-.901 4.257-.593 1.214-1.425 2.158-2.496 2.834-1.064.675-2.306 1.013-3.724 1.013Zm0-2.17c1.077 0 1.964-.276 2.66-.828.696-.553 1.211-1.28 1.545-2.18.334-.9.501-1.875.501-2.926 0-1.05-.167-2.029-.501-2.936-.334-.907-.849-1.64-1.545-2.2-.696-.56-1.583-.839-2.66-.839-1.078 0-1.965.28-2.66.84-.696.558-1.211 1.292-1.545 2.199a8.411 8.411 0 0 0-.502 2.936c0 1.05.167 2.026.502 2.927.334.9.849 1.626 1.545 2.179.695.552 1.582.828 2.66.828Zm16.741 2.17c-1.31 0-2.466-.331-3.469-.993-1.002-.668-1.787-1.61-2.353-2.824-.566-1.22-.849-2.663-.849-4.328 0-1.65.283-3.083.849-4.297.566-1.214 1.354-2.152 2.363-2.813 1.01-.662 2.176-.993 3.5-.993 1.023 0 1.831.17 2.424.512.601.334 1.058.716 1.371 1.146.321.423.57.77.747 1.043h.205V59.31h2.414v20.954h-2.332v-2.415h-.287a15.17 15.17 0 0 1-.757 1.085c-.327.43-.794.815-1.402 1.156-.607.334-1.415.502-2.424.502Zm.327-2.17c.969 0 1.787-.252 2.456-.757.668-.511 1.176-1.217 1.524-2.118.348-.907.522-1.954.522-3.14 0-1.174-.171-2.2-.512-3.08-.341-.887-.846-1.576-1.514-2.067-.668-.498-1.494-.747-2.476-.747-1.023 0-1.876.263-2.558.788-.675.518-1.183 1.224-1.524 2.118-.334.887-.502 1.882-.502 2.987 0 1.12.171 2.135.512 3.05.348.907.859 1.63 1.535 2.168.682.532 1.528.798 2.537.798Zm17.567 2.17c-1.309 0-2.466-.331-3.468-.993-1.003-.668-1.787-1.61-2.353-2.824-.567-1.22-.85-2.663-.85-4.328 0-1.65.283-3.083.85-4.297.566-1.214 1.354-2.152 2.363-2.813 1.01-.662 2.176-.993 3.499-.993 1.023 0 1.832.17 2.425.512.6.334 1.057.716 1.371 1.146.321.423.569.77.747 1.043h.204V59.31h2.415v20.954h-2.333v-2.415h-.286c-.178.287-.43.648-.757 1.085-.328.43-.795.815-1.402 1.156-.607.334-1.415.502-2.425.502Zm.328-2.17c.968 0 1.787-.252 2.455-.757.669-.511 1.177-1.217 1.525-2.118.347-.907.521-1.954.521-3.14 0-1.174-.17-2.2-.511-3.08-.341-.887-.846-1.576-1.514-2.067-.669-.498-1.494-.747-2.476-.747-1.024 0-1.876.263-2.558.788-.675.518-1.184 1.224-1.525 2.118-.334.887-.501 1.882-.501 2.987 0 1.12.171 2.135.512 3.05.347.907.859 1.63 1.534 2.168.682.532 1.528.798 2.538.798Zm22.764-10.354-2.169.614a4.014 4.014 0 0 0-.603-1.053 2.938 2.938 0 0 0-1.064-.86c-.451-.225-1.027-.338-1.73-.338-.961 0-1.763.222-2.404.665-.634.437-.951.993-.951 1.668 0 .6.218 1.074.654 1.422.437.348 1.119.638 2.047.87l2.332.573c1.405.34 2.452.863 3.141 1.565.689.696 1.034 1.593 1.034 2.691 0 .9-.259 1.705-.778 2.415-.511.71-1.228 1.268-2.148 1.678-.921.409-1.992.614-3.213.614-1.603 0-2.93-.348-3.98-1.044-1.05-.696-1.715-1.712-1.995-3.049l2.292-.573c.218.846.631 1.48 1.238 1.903.614.423 1.415.634 2.404.634 1.125 0 2.019-.238 2.681-.716.668-.484 1.002-1.064 1.002-1.74 0-.545-.191-1.002-.573-1.37-.382-.375-.968-.655-1.759-.84l-2.62-.613c-1.439-.341-2.496-.87-3.171-1.586-.669-.723-1.003-1.627-1.003-2.711 0-.887.249-1.671.747-2.353.505-.682 1.19-1.218 2.056-1.607.873-.388 1.862-.583 2.967-.583 1.556 0 2.777.341 3.663 1.023.894.682 1.528 1.583 1.903 2.701Z"
          opacity=".8"
        ></path>
      </svg>
    </>
  )
}

export const productOnSalePathBuilder = (product: {
  slug: string
  type?: 'live' | 'self-paced' | null
  modules?: {slug: {current: string}}[]
}) => {
  if (product.type === 'live') {
    return `/events/${product.slug}`
  } else if (product.modules && product.modules.length > 1) {
    return `/products/${product.slug}`
  } else {
    return `/workshops/${product?.modules?.[0]?.slug?.current}`
  }
}

export const Banner: React.FC<{
  className?: string
  enableScrollAnimation?: boolean
}> = ({className, enableScrollAnimation}) => {
  const {data: cta, status} = trpc.cta.forResource.useQuery()

  const router = useRouter()
  const currentSale = cta?.CURRENT_ACTIVE_PROMOTION
  const activeEvent = cta?.CURRENT_ACTIVE_LIVE_EVENT
  const {bannerHeight, scrollDirection} = useGlobalBanner()
  const code = router.query.code
  const productOnSale = currentSale?.product
  const productPath = productOnSale && productOnSalePathBuilder(productOnSale)

  if (!currentSale && !activeEvent) return null
  return (
    <div
      style={{
        height: bannerHeight,
      }}
      className={cn(`fixed left-0 top-0 z-[60] w-full transition`, className, {
        '-translate-y-full':
          scrollDirection === 'down' && enableScrollAnimation,
        'translate-y-0': scrollDirection === 'up' && enableScrollAnimation,
      })}
    >
      {currentSale && productOnSale ? (
        <Link
          href={productPath || '/buy'}
          className={cn(
            `flex h-full w-full bg-primary py-1.5 text-white print:hidden`,
          )}
          onClick={() => {
            track('clicked banner cta', {
              location: 'nav',
              type: 'sale',
              title: productOnSale.title,
            })
          }}
        >
          <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-2 text-[10px] font-medium sm:space-x-4 sm:text-sm">
            <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
              <strong>
                Save {(Number(currentSale.percentageDiscount) * 100).toString()}
                % {productOnSale.title && `on ${productOnSale.title}`}
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
              {productOnSale?.action ?? `Level up at React`}
            </div>
          </div>
        </Link>
      ) : activeEvent ? (
        <Link
          href={`/events/${activeEvent.product?.event?.slug}${
            code ? '?code=' + code : ''
          }`}
          className={cn(`flex h-full w-full bg-primary py-1.5 text-white`)}
          onClick={() => {
            track('clicked banner cta', {
              location: 'nav',
              type: 'event',
              title: activeEvent.product?.event?.title,
            })
          }}
        >
          <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-2 text-[10px] font-medium sm:space-x-4 sm:text-sm">
            <p className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
              <strong className="hidden sm:inline-block">
                New live event scheduled!
              </strong>{' '}
              <span>
                {pluralize('spot', activeEvent.quantityAvailable, true)} left
                for {activeEvent.product?.event?.title} workshop.
              </span>
            </p>
            <div className="flex-shrink-0 rounded bg-white px-2 py-0.5 font-semibold text-primary shadow-md">
              Register
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  )
}
