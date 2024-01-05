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
                  className="group absolute right-0 flex h-full items-center justify-center overflow-hidden bg-mint px-10 py-3 font-mono text-xs font-bold uppercase text-primary-foreground"
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
        className={cn('w-24', className)}
        aria-hidden="true"
        viewBox="0 0 98 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.045 27.965C1.045 24.83 3.04 22.645 5.776 22.645C7.201 22.645 8.436 23.215 9.215 24.108H9.253V19.13H10.735V33H9.31V31.803H9.272C8.512 32.715 7.239 33.285 5.89 33.285C2.907 33.285 1.045 31.138 1.045 27.965ZM9.253 28.896V27.015C9.253 25.457 7.733 24.032 5.852 24.032C4.864 24.032 4.066 24.393 3.439 25.115C2.831 25.818 2.527 26.768 2.527 27.965C2.527 30.397 3.819 31.898 5.966 31.898C7.733 31.898 9.253 30.473 9.253 28.896ZM12.4524 27.965C12.4524 24.83 14.4474 22.645 17.3924 22.645C20.2614 22.645 22.2374 24.792 22.2374 27.965V28.516H14.0104C14.1054 30.549 15.4734 31.879 17.3924 31.879C18.8554 31.879 19.9764 31.176 20.7554 29.77L22.0094 30.568C20.9074 32.373 19.3684 33.285 17.3924 33.285C14.4854 33.285 12.4524 31.138 12.4524 27.965ZM14.0484 27.243H20.6604C20.5084 25.324 19.2164 24.051 17.3924 24.051C15.4924 24.051 14.1434 25.362 14.0484 27.243ZM27.9638 33L23.0048 22.93H24.6958L28.5908 31.157H28.6288L32.5238 22.93H34.2148L29.2558 33H27.9638ZM36.5213 33V22.93H37.9653V24.222H38.0033C38.6683 23.234 39.7893 22.645 41.2143 22.645C42.7913 22.645 44.0073 23.405 44.7673 24.83L43.4753 25.571C42.8863 24.526 42.1643 24.032 41.1193 24.032C39.2383 24.032 38.0033 25.362 38.0033 27.319V33H36.5213ZM46.1047 27.965C46.1047 24.83 48.0997 22.645 51.0447 22.645C53.9137 22.645 55.8897 24.792 55.8897 27.965V28.516H47.6627C47.7577 30.549 49.1257 31.879 51.0447 31.879C52.5077 31.879 53.6287 31.176 54.4077 29.77L55.6617 30.568C54.5597 32.373 53.0207 33.285 51.0447 33.285C48.1377 33.285 46.1047 31.138 46.1047 27.965ZM47.7007 27.243H54.3127C54.1607 25.324 52.8687 24.051 51.0447 24.051C49.1447 24.051 47.7957 25.362 47.7007 27.243ZM63.0031 31.613H67.0121V33H57.5121V31.613H61.5211V21.087H57.7021V19.7H63.0031V31.613Z"
          fill="white"
        />
        <path
          d="M70.921 33V30.549H73.41V33H70.921Z"
          fill="currentColor"
          className="text-foreground"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M68.9531 22.9005C69.9285 21.5316 70.9198 20.1403 71.7883 18.5918C70.2926 19.3938 69.0069 20.0998 67.9048 20.705C65.8619 21.8267 64.4499 22.6021 63.5 23C63.5 23 63.5 21.4578 63.5 21.5372C67.0225 19.7916 70.4392 17.8283 73.8094 15.7623C74.5753 15.295 75.0905 14.6076 75.6056 13.9204C75.8195 13.6349 76.0335 13.3494 76.2654 13.0798C76.8375 12.4142 77.4046 11.7441 77.9718 11.074C80.6771 7.87745 83.3826 4.68075 86.6281 1.98213C87.5161 1.24107 88.5144 0.634739 89.5985 0.236645C90.3885 -0.0573321 91.2337 -0.192072 91.8094 0.530622C92.3974 1.27169 92.0115 2.17812 91.4971 2.93143C88.9312 6.68109 85.3159 9.38129 81.727 12.0617C81.6581 12.1132 81.5891 12.1647 81.5202 12.2162C80.2321 13.1763 78.8743 14.0436 77.5203 14.9083L77.4107 14.9784C74.7957 16.648 73.2101 19.1446 71.6276 21.6363C71.1494 22.3894 70.6714 23.142 70.1653 23.8712C69.7725 24.4367 69.8574 25.1877 69.946 25.9721C69.9831 26.3006 70.0209 26.635 70.0245 26.9641C73.0561 26.3026 75.4569 24.6367 77.7414 22.7688C78.1633 22.4208 78.578 22.0642 78.9923 21.7078C79.5042 21.2677 80.0157 20.8278 80.5403 20.4047C80.9751 20.0495 81.5753 19.6759 82.0469 20.1168C82.4352 20.477 82.1517 20.8051 81.8843 21.1146C81.8016 21.2103 81.7204 21.3043 81.6611 21.3969C81.3203 21.9221 80.9718 22.4421 80.6233 22.9624C80.2077 23.5827 79.7919 24.2032 79.3889 24.8327C79.3752 24.8542 79.3615 24.8756 79.3478 24.897C78.9622 25.5009 78.5661 26.1212 78.5069 27.2213C78.8148 26.9994 79.1201 26.7818 79.4222 26.5665C81.5302 25.0641 83.4799 23.6744 85.0173 21.746C85.1203 21.6179 85.2241 21.4541 85.3324 21.2831C85.7268 20.6605 86.1812 19.9432 86.873 20.5149C87.5836 21.1001 86.8502 21.8144 86.2885 22.3615C86.1917 22.4558 86.1 22.5451 86.0217 22.6279C84.9052 23.7947 84.1604 25.1886 83.3939 26.6232C83.227 26.9356 83.059 27.2499 82.886 27.5643C84.3385 26.5534 85.9589 25.8683 87.5826 25.1818C89.3135 24.4499 91.0482 23.7164 92.5872 22.585C92.82 22.4074 93.1262 22.6769 92.9853 22.928C92.689 23.4512 92.3217 23.9403 91.9499 24.4354C91.2077 25.4239 90.4476 26.4361 90.1987 27.7909C90.1619 28.0052 90.3763 28.1767 90.5723 28.0787C91.9155 27.4223 93.2139 26.7902 94.5367 26.1462C95.6082 25.6246 96.6957 25.0952 97.8359 24.5388C98.4606 25.0042 97.1316 25.7637 96.6845 26.0148C95.0125 26.9641 93.3283 27.9011 91.6257 28.7953C90.9581 29.1505 90.1619 29.4996 89.4943 28.881C88.9328 28.3615 89.1042 27.6801 89.265 27.0411C89.2919 26.9343 89.3184 26.8287 89.3412 26.7252C89.4098 26.4208 89.5534 26.1345 89.6985 25.8451C89.7607 25.7211 89.8232 25.5965 89.8802 25.4697C85.7951 26.6578 81.0915 30.1427 78.8315 33.6092C76.4124 37.3145 73.8462 40.9157 71.2004 44.4557C71.1307 44.5492 71.0597 44.6505 70.9867 44.7546C70.5339 45.4005 70.0053 46.1546 69.2405 45.8276C68.4334 45.4838 68.6031 44.6171 68.7538 43.8475C68.7883 43.6711 68.8219 43.4998 68.8424 43.341C69.4488 38.7783 72.3947 35.7405 75.6774 32.9048C76.2187 32.4369 76.8042 32.0138 77.3903 31.5903C78.8598 30.5284 80.3322 29.4644 81.116 27.6868C81.1585 27.5877 81.2009 27.4906 81.2777 27.3152C81.3338 27.1871 81.4081 27.0172 81.5141 26.7742C81.1448 27.0023 80.8147 27.213 80.5089 27.4083C79.8868 27.8055 79.3654 28.1384 78.8193 28.4217C78.7665 28.4481 78.7128 28.4764 78.6581 28.5052C78.2303 28.7307 77.747 28.9854 77.2637 28.5564C76.7784 28.1238 76.9294 27.5404 77.056 27.0514C77.062 27.0282 77.068 27.0052 77.0738 26.9824C77.2106 26.4482 77.4249 25.9319 77.6792 25.319C77.7894 25.0536 77.9071 24.7701 78.0292 24.4591C77.6106 24.7236 77.2224 24.9754 76.8524 25.2154C76.1344 25.6811 75.4848 26.1024 74.8139 26.4864L74.7509 26.5223C73.3137 27.3438 71.8553 28.1773 70.1531 28.2196C69.3459 28.2431 69.2651 28.7556 69.1915 29.2227C69.1691 29.3651 69.1473 29.5033 69.1058 29.6221C66.1538 37.9147 61.5481 45.2274 55.9626 51.9582C55.6318 52.3563 55.0194 52.932 54.6152 53.2505C54.2661 53.5261 53.8741 53.716 53.427 53.3975C52.9554 53.0545 52.9554 52.5462 53.084 52.0195C53.4025 50.6782 53.9782 49.4349 54.5968 48.21C58.3083 40.8545 62.3504 33.6827 66.5029 26.566C67.2437 25.2997 68.0922 24.1088 68.9531 22.9005ZM57.9408 47.4628C62.032 41.7793 65.8353 35.9242 68.1626 29.2485H68.1565C68.1893 29.1549 68.2366 29.0558 68.285 28.9543C68.4805 28.5444 68.6942 28.0964 68.0463 27.8215C67.4872 27.5839 67.3357 28.009 67.2035 28.3797C67.162 28.4963 67.1223 28.6076 67.0725 28.6912C63.2263 35.1464 59.6128 41.7303 56.2076 48.4305C55.9635 48.9008 55.7453 49.3871 55.5271 49.8732C55.444 50.0582 55.361 50.2431 55.2766 50.4271C56.3209 49.7416 56.9906 48.7986 57.6541 47.8642C57.7495 47.73 57.8446 47.5959 57.9408 47.4628ZM69.6754 44.6211C70.2695 39.0233 73.7911 35.9365 77.576 33.0335C75.2977 36.9838 72.6458 40.6707 69.6754 44.6211ZM89.1623 1.6165C89.056 1.69489 88.9537 1.77029 88.8574 1.83515C85.3073 4.23415 82.6878 7.54019 80.0697 10.8446C79.7068 11.3027 79.3439 11.7607 78.9785 12.2162C83.0268 9.61941 86.9037 6.86338 89.9965 3.16417C90.0752 3.07044 90.165 2.97041 90.2585 2.86642C90.7329 2.33849 91.2989 1.70862 90.9459 1.28394C90.4339 0.67896 89.7387 1.19155 89.1623 1.6165ZM96.7363 18.365C96.7452 18.9657 96.3751 19.3567 95.9786 19.4139L95.9698 19.4044C95.3618 19.4425 95.0887 19.2232 95.0534 18.7655C95.0006 18.0884 95.3618 17.7356 95.9433 17.726C96.3134 17.7165 96.7363 17.9549 96.7363 18.365Z"
          fill="currentColor"
          className="text-primary"
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
              on {/* @ts-ignore-next-line */}
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
