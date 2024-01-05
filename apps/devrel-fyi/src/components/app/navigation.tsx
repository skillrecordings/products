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
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

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
    // {
    //   label: (
    //     <>
    //       <span className="sm:hidden lg:inline-block">Pro</span> Workshops
    //     </>
    //   ),
    //   icon: () => '',
    //   href: '/workshops',
    // },
    // {
    //   label: 'Tips',
    //   icon: () => '',
    //   href: canCreateContent ? '/creator/tips' : '/tips',
    // },
    // {
    //   label: (
    //     <>
    //       <span className="sm:hidden lg:inline-block">Free</span> Tutorials
    //     </>
    //   ),
    //   icon: () => '',
    //   href: '/tutorials',
    // },
    // {
    //   label: 'Articles',
    //   icon: () => '',
    //   href: '/articles',
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

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
    })

  const {data: lastPurchase, status: lastPurchaseStatus} =
    trpc.purchases.getLastPurchase.useQuery()
  const {subscriber, loadingSubscriber} = useConvertkit()
  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.length > 0
  const ability = useAbilities()
  const canInviteTeam = ability.can('invite', 'Team')
  const currentSale = useAvailableSale()
  const router = useRouter()
  return (
    <>
      <SaleBanner size={size} />
      <div
        className={cn(
          'left-0 z-50 flex w-full flex-col items-center justify-center border-b print:hidden',
          navigationContainerClassName,
        )}
        style={{
          marginTop: currentSale ? currentSale.bannerHeight : 0,
        }}
      >
        <motion.nav
          aria-label="top"
          className={cn('relative mx-auto flex h-20 w-full text-sm', className)}
        >
          <Container
            className="relative flex max-w-full items-center justify-between border-x-0 lg:px-5"
            wrapperClassName="lg:px-0 sm:px-0 px-0"
          >
            <div className="flex items-center gap-2">
              <Link
                href="/"
                aria-current={isRoot}
                tabIndex={isRoot ? -1 : 0}
                passHref
                className="relative z-10 text-lg tracking-tight"
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
                      className={cx(
                        'group flex items-center gap-1 rounded-md px-1.5 py-1 transition lg:px-2.5',
                      )}
                      passHref
                      onClick={() => {
                        track(`clicked ${label} from navigation`, {
                          page: asPath,
                        })
                      }}
                    >
                      {/* {icon()}  */}
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex h-full items-center justify-end">
              {/* <Login className="hidden md:flex" /> */}
              {subscriber ? null : (
                <motion.button
                  whileHover={{
                    borderRadius: 0,
                  }}
                  style={{
                    borderRadius: 40,
                  }}
                  transition={{
                    type: 'spring',
                    duration: 0.3,
                  }}
                  onClick={() => {
                    // scroll to #subscribe
                    const subscribeSection = document.getElementById('join')
                    if (subscribeSection) {
                      subscribeSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                    } else {
                      router.push('/#join')
                    }
                  }}
                  type="button"
                  className="group absolute right-0 flex h-full items-center justify-center overflow-hidden bg-primary px-10 py-3 font-mono text-xs font-bold uppercase text-primary-foreground"
                >
                  Join
                </motion.button>
              )}
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

              {/* <NavToggle isMenuOpened={menuOpen} setMenuOpened={setMenuOpen} /> */}
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
                  className="absolute left-0 top-0 flex w-full flex-col gap-2 border-b border-gray-100 bg-white px-2 pb-5 pt-16 text-2xl shadow-2xl shadow-black/20 backdrop-blur-md md:hidden"
                >
                  {navigationLinks.map(({label, href, icon}) => {
                    return (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-4 rounded-md px-3 py-2 transition hover:bg-indigo-300/10"
                        passHref
                        onClick={() => {
                          track(`clicked ${label} from navigation`, {
                            page: asPath,
                          })
                        }}
                      >
                        {/* <span className="flex w-5 items-center justify-center">
                        {icon()}
                      </span> */}{' '}
                        {label}
                      </Link>
                    )
                  })}

                  <div className="flex w-full items-center justify-between px-3 pt-5 text-lg">
                    {/* <Login /> */}
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
              <span className="inline-flex gap-0.5 text-sm leading-tight">
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
            'group flex items-center gap-1 rounded-md px-2.5 py-1 font-semibold transition hover:opacity-100',
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

export const Logo: React.FC<{className?: string}> = ({className}) => {
  return (
    <>
      <svg
        aria-hidden="true"
        className="w-24"
        viewBox="0 0 110 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M85.7371 16.5678C82.88 18.1423 80.3631 19.5293 77.1219 20.658V19.609C81.8457 17.726 85.4233 15.6129 89.7705 12.948C90.3997 12.5641 90.8229 11.9994 91.246 11.4349C91.4217 11.2004 91.5975 10.9659 91.788 10.7444C92.2579 10.1977 92.7238 9.64723 93.1897 9.09674C95.412 6.47095 97.6345 3.84501 100.3 1.62823C101.03 1.01948 101.85 0.521408 102.74 0.194393C103.389 -0.0470956 104.084 -0.157778 104.557 0.435881C105.04 1.04463 104.723 1.78922 104.3 2.40803C102.192 5.4882 99.2225 7.70629 96.2745 9.90813C96.2178 9.95044 96.1612 9.99274 96.1046 10.035C95.0464 10.8237 93.9311 11.5361 92.8189 12.2465L92.7288 12.304C90.5807 13.6755 89.2782 15.7264 87.9783 17.7732C87.5854 18.3918 87.1928 19.01 86.7771 19.609C86.4544 20.0736 86.5241 20.6905 86.5969 21.3349C86.6274 21.6047 86.6584 21.8794 86.6614 22.1497C89.1517 21.6064 91.1239 20.2379 93.0004 18.7035C93.3471 18.4176 93.6876 18.1247 94.028 17.832C94.4485 17.4704 94.8687 17.109 95.2996 16.7615C95.6568 16.4697 96.1498 16.1628 96.5372 16.525C96.8562 16.8209 96.6233 17.0904 96.4036 17.3447C96.3357 17.4233 96.269 17.5005 96.2203 17.5765C95.9403 18.0079 95.6541 18.4352 95.3677 18.8625C95.0263 19.3721 94.6849 19.8818 94.3538 20.3989C94.3426 20.4165 94.3313 20.4341 94.3201 20.4517C94.0033 20.9478 93.6779 21.4573 93.6293 22.361C93.8822 22.1788 94.133 22 94.3812 21.8231C96.1128 20.5889 97.7144 19.4474 98.9773 17.8633C99.0618 17.7581 99.1471 17.6235 99.2361 17.483C99.56 16.9716 99.9333 16.3824 100.502 16.8521C101.085 17.3327 100.483 17.9195 100.021 18.3689C99.942 18.4464 99.8667 18.5197 99.8024 18.5878C98.8852 19.5462 98.2734 20.6913 97.6437 21.8697C97.5066 22.1263 97.3686 22.3845 97.2265 22.6427C98.4197 21.8124 99.7507 21.2496 101.084 20.6856C102.506 20.0844 103.931 19.4819 105.196 18.5525C105.387 18.4066 105.638 18.628 105.523 18.8343C105.279 19.2641 104.977 19.6658 104.672 20.0725C104.062 20.8845 103.438 21.716 103.234 22.8289C103.203 23.005 103.379 23.1458 103.54 23.0653C104.644 22.5261 105.71 22.0068 106.797 21.4779C107.677 21.0494 108.571 20.6145 109.507 20.1574C110.02 20.5398 108.929 21.1636 108.561 21.3699C107.188 22.1497 105.804 22.9194 104.406 23.654C103.857 23.9458 103.203 24.2325 102.655 23.7244C102.194 23.2976 102.334 22.7379 102.467 22.213C102.489 22.1252 102.51 22.0385 102.529 21.9535C102.586 21.7035 102.703 21.4682 102.823 21.2305C102.874 21.1286 102.925 21.0263 102.972 20.9221C99.6162 21.8982 95.7524 24.7608 93.896 27.6083C91.9087 30.6521 89.8007 33.6103 87.6273 36.5183C87.5701 36.5951 87.5117 36.6783 87.4518 36.7638C87.0799 37.2944 86.6457 37.9138 86.0174 37.6452C85.3543 37.3628 85.4938 36.6508 85.6176 36.0186C85.6459 35.8737 85.6735 35.733 85.6904 35.6026C86.1885 31.8545 88.6084 29.3591 91.305 27.0298C91.7496 26.6454 92.2306 26.2978 92.712 25.95C93.9192 25.0776 95.1287 24.2036 95.7725 22.7434C95.8074 22.662 95.8423 22.5822 95.9054 22.4381C95.9514 22.3329 96.0125 22.1934 96.0995 21.9937C95.7961 22.1811 95.525 22.3542 95.2738 22.5146C94.7628 22.8409 94.3345 23.1143 93.8859 23.3471C93.8426 23.3687 93.7984 23.392 93.7535 23.4157C93.4021 23.6009 93.005 23.8102 92.608 23.4578C92.2094 23.1023 92.3334 22.6231 92.4374 22.2215C92.4424 22.2024 92.4473 22.1835 92.4521 22.1648C92.5644 21.726 92.7404 21.3018 92.9494 20.7983C93.0399 20.5803 93.1366 20.3474 93.2369 20.092C92.893 20.3093 92.5741 20.5161 92.2702 20.7132C91.6804 21.0958 91.1468 21.4419 90.5956 21.7573L90.5439 21.7868C89.3633 22.4616 88.1653 23.1464 86.767 23.1811C86.1039 23.2003 86.0376 23.6214 85.9771 24.0051C85.9587 24.1221 85.9408 24.2356 85.9067 24.3332C83.4818 31.1451 79.6985 37.1522 75.1102 42.6812C74.8385 43.0083 74.3354 43.4812 74.0034 43.7428C73.7166 43.9692 73.3946 44.1251 73.0273 43.8635C72.64 43.5818 72.64 43.1642 72.7456 42.7316C73.0072 41.6298 73.4801 40.6085 73.9883 39.6023C77.0371 33.56 80.3575 27.6687 83.7685 21.8227C84.3771 20.7825 85.0741 19.8042 85.7813 18.8116C86.5825 17.6872 87.3968 16.5443 88.1103 15.2723C87.2818 15.7165 86.4974 16.1488 85.7371 16.5678ZM76.7352 38.9885C80.0959 34.3197 83.2202 29.5101 85.1319 24.0263H85.1269C85.1539 23.9494 85.1927 23.8679 85.2325 23.7846C85.3931 23.4479 85.5686 23.0799 85.0364 22.854C84.5771 22.6589 84.4527 23.008 84.3441 23.3126C84.3099 23.4084 84.2774 23.4998 84.2364 23.5684C81.077 28.8711 78.1087 34.2795 75.3114 39.7834C75.111 40.1697 74.9317 40.5692 74.7524 40.9685C74.6842 41.1204 74.616 41.2723 74.5467 41.4235C75.4045 40.8604 75.9546 40.0858 76.4997 39.3182C76.578 39.2079 76.6562 39.0978 76.7352 38.9885ZM86.3746 36.6541C86.8626 32.0558 89.7554 29.5201 92.8646 27.1354C90.9931 30.3804 88.8146 33.4091 86.3746 36.6541ZM102.382 1.32788C102.295 1.39227 102.211 1.45421 102.132 1.50749C99.2155 3.47816 97.0637 6.19391 94.913 8.90835C94.6149 9.2846 94.3168 9.66083 94.0167 10.035C97.3422 7.90189 100.527 5.63794 103.067 2.59921C103.132 2.52222 103.206 2.44005 103.283 2.35463C103.672 1.92096 104.137 1.40355 103.847 1.05469C103.427 0.557734 102.856 0.978803 102.382 1.32788ZM108.604 15.0858C108.611 15.5794 108.307 15.9005 107.982 15.9475L107.974 15.9397C107.475 15.971 107.251 15.7909 107.222 15.4149C107.178 14.8587 107.475 14.5688 107.953 14.561C108.257 14.5532 108.604 14.749 108.604 15.0858Z"
          className="text-primary"
          fill="currentColor"
        />
        <path
          d="M0.998082 24.0909C0.998082 20.4388 3.28913 17.7394 6.55558 17.7394C7.9166 17.7394 8.98274 18.1024 9.75398 18.8283H9.79935V13.543H13.0431V30.1021H10.0489V29.0586H10.0035C9.11884 29.9886 7.93929 30.4423 6.51021 30.4423C3.31182 30.4423 0.998082 27.8791 0.998082 24.0909ZM9.79935 24.8621V23.2969C9.79935 21.9359 8.59711 20.711 6.98657 20.711C5.2853 20.711 4.24185 22.0267 4.24185 24.0909C4.24185 26.1097 5.33066 27.4707 6.96389 27.4707C8.59711 27.4707 9.79935 26.3139 9.79935 24.8621ZM14.6398 24.1136C14.6398 20.3027 17.135 17.7394 20.7644 17.7394C24.2804 17.7394 26.7983 20.4161 26.7983 24.2043V25.157H17.8836C17.9743 26.6768 19.1085 27.6976 20.8325 27.6976C22.0347 27.6976 22.9874 27.2212 24.1897 25.9283L26.2085 27.9925C24.8248 29.535 22.9874 30.4423 20.8325 30.4423C17.135 30.4423 14.6398 27.8564 14.6398 24.1136ZM17.929 22.7979H23.5318C23.4184 21.4596 22.2389 20.4842 20.7644 20.4842C19.2219 20.4842 18.1785 21.4142 17.929 22.7979ZM32.7956 30.1021L27.3516 18.0797H31.0036L34.134 25.9283H34.1793L37.3097 18.0797H40.9618L35.5177 30.1021H32.7956ZM42.876 30.1021V18.0797H45.9837V19.1912H46.0291C47.0498 18.1704 48.0933 17.7394 49.5224 17.7394C51.6093 17.7394 53.1971 19.0551 53.8096 21.1647L50.77 22.1628C50.4297 21.1874 49.7038 20.6883 48.615 20.6883C46.9818 20.6883 46.1198 21.7091 46.1198 23.365V30.1021H42.876ZM54.8165 24.1136C54.8165 20.3027 57.3117 17.7394 60.9411 17.7394C64.4571 17.7394 66.975 20.4161 66.975 24.2043V25.157H58.0603C58.151 26.6768 59.2852 27.6976 61.0092 27.6976C62.2114 27.6976 63.1641 27.2212 64.3663 25.9283L66.3852 27.9925C65.0015 29.535 63.1641 30.4423 61.0092 30.4423C57.3117 30.4423 54.8165 27.8564 54.8165 24.1136ZM58.1057 22.7979H63.7085C63.5951 21.4596 62.4155 20.4842 60.9411 20.4842C59.3986 20.4842 58.3552 21.4142 58.1057 22.7979ZM75.9666 27.1305H80.2538V30.1021H68.4356V27.1305H72.7228V17.195H68.6624V14.2235H75.9666V27.1305Z"
          className="text-foreground"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">DevRel.fyi</span>
    </>
  )
}

export const SaleBanner: React.FC<{size?: 'sm' | 'md' | 'lg'}> = ({size}) => {
  const currentSale = useAvailableSale()

  if (!currentSale) return null

  return (
    <div
      className={cn(
        `absolute h-[${currentSale.bannerHeight}px] left-0 top-0 z-[60] w-full`,
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
        <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center space-x-2 px-2 text-xs sm:space-x-4 sm:text-sm">
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
