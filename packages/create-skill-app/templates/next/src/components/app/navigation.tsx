import React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from '@/utils/analytics'
import cx from 'classnames'
import {
  AnimatePresence,
  AnimationControls,
  motion,
  useAnimationControls,
} from 'framer-motion'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {trpc} from '@/trpc/trpc.client'
import Gravatar from 'react-gravatar'
import {signOut, useSession} from 'next-auth/react'
import {cn} from '@skillrecordings/ui/utils/cn'
import {
  Button,
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
import Image from 'next/image'
import Container from './container'
import {ThemeToggle} from './theme-toggle'
import common from '@/text/common'

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

  return [
    {
      label: (
        <>
          <span className="sm:hidden lg:inline-block">Pro</span> Workshops
        </>
      ),
      icon: () => '',
      href: '/workshops',
    },
    {
      label: 'Tips',
      icon: () => '',
      href: canCreateContent ? '/creator/tips' : '/tips',
    },
    {
      label: (
        <>
          <span className="sm:hidden lg:inline-block">Free</span> Tutorials
        </>
      ),
      icon: () => '',
      href: '/tutorials',
    },
    {
      label: 'Articles',
      icon: () => '',
      href: '/articles',
    },
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
          'left-0 z-50 flex w-full flex-col items-center justify-center border-b border-t bg-background print:hidden',
          navigationContainerClassName,
        )}
      >
        <motion.nav
          aria-label="top"
          className={cn(
            'relative mx-auto flex h-16 w-full text-sm font-semibold',
            className,
          )}
        >
          <Container className="relative flex items-center justify-between px-5 sm:px-5 lg:px-5">
            <div className="flex items-center gap-5">
              <Link
                href="/"
                aria-current={isRoot}
                tabIndex={isRoot ? -1 : 0}
                passHref
                className="relative z-10 text-lg font-bold tracking-tight"
                onContextMenu={(event) => {
                  event.preventDefault()
                  push('/brand')
                }}
              >
                <Logo />
              </Link>
              <div className="hidden items-center justify-start gap-2 md:flex lg:pl-2">
                {navigationLinks.map(({label, href, icon}, i) => {
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'group flex items-center gap-1 rounded-md px-1.5 py-1 opacity-75 transition transition hover:opacity-100 lg:px-2.5',
                        {
                          'opacity-100': pathname.includes(href),
                        },
                      )}
                      passHref
                      onClick={() => {
                        track(`clicked ${label} from navigation`, {
                          page: asPath,
                        })
                      }}
                    >
                      {icon()} {label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Login className="hidden md:flex" />
              <User className="hidden md:flex" />
              {commercePropsStatus === 'success' && hasPurchase && (
                <>
                  {canInviteTeam && lastPurchase ? (
                    <Link
                      href={`/products/${lastPurchase.slug}`}
                      className={cx('mr-3 hidden px-2.5 lg:block', {
                        underline:
                          pathname === `/products/${lastPurchase.slug}`,
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
              <ThemeToggle />
              <NavToggle isMenuOpened={menuOpen} setMenuOpened={setMenuOpen} />
            </div>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{y: -30, opacity: 0, scaleY: 0.8}}
                  animate={{y: 0, opacity: 1, scaleY: 1}}
                  exit={{y: -30, opacity: 0, scaleY: 0.8}}
                  transition={{
                    type: 'spring',
                    duration: 0.5,
                  }}
                  className="absolute left-0 top-[65px] grid w-full origin-top grid-cols-2 flex-col border-b bg-background text-lg font-medium shadow-2xl shadow-black/20 backdrop-blur-md md:hidden"
                >
                  {navigationLinks.map(({label, href, icon}, i) => {
                    return (
                      <Link
                        key={href}
                        href={href}
                        passHref
                        className={cn('border-b p-5', {
                          'border-r': i % 2 === 0,
                        })}
                        onClick={() => {
                          track(`clicked ${label} from navigation`, {
                            page: asPath,
                          })
                        }}
                      >
                        {label}
                      </Link>
                    )
                  })}
                  <div className="col-span-2 flex w-full items-center justify-between p-5">
                    <Login className="px-0 opacity-100" />
                    <User />
                    {commercePropsStatus === 'success' &&
                      purchasedProductIds.length > 0 && (
                        <Link
                          href="/products?s=purchased"
                          className={cx({
                            underline: pathname === '/products',
                          })}
                        >
                          My Products
                        </Link>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
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
    <Button
      size="icon"
      variant="outline"
      className="z-10 md:hidden"
      // className="z-10 flex h-12 w-12 items-center justify-center p-1 md:hidden"
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
    </Button>
  )
}

export const Logo: React.FC<{className?: string}> = ({className}) => {
  return (
    <div className="flex items-center gap-1">
      <Image
        src={require('../../../public/favicon.ico')}
        alt=""
        width={24}
        height={24}
      />{' '}
      {process.env.NEXT_PUBLIC_SITE_TITLE}
    </div>
  )
}

export const SaleBanner: React.FC<{size?: 'sm' | 'md' | 'lg'}> = ({size}) => {
  const currentSale = useAvailableSale()

  if (!currentSale) return null

  return (
    <div
      className={cn(
        `h-[${currentSale.bannerHeight}px] left-0 top-0 z-[60] w-full`,
      )}
    >
      <Link
        href="/#buy"
        className={cn(
          `flex h-full w-full bg-muted py-1.5 text-muted-foreground`,
        )}
        onClick={() => {
          track('clicked sale banner cta', {
            location: 'nav',
          })
        }}
      >
        <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-2 text-xs sm:space-x-4 sm:text-sm">
          <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
            <strong className="font-semibold">
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
          <div className="flex-shrink-0 rounded bg-primary px-2 py-0.5 font-semibold text-primary-foreground">
            {common['sale-banner-cta-label']}
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
