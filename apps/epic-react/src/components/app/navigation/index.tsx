import * as React from 'react'
import Link from 'next/link'
import {useRouter, usePathname} from 'next/navigation'
import {useSession} from 'next-auth/react'
import {motion, useScroll, useTransform, useSpring} from 'framer-motion'
import {useMedia} from 'react-use'
import {isEmpty} from 'lodash'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

import {trpc} from '@/trpc/trpc.client'
import {isOnlyTeamPurchaser} from '@/utils/is-only-team-purchaser'

import MobileNavigation from '@/components/app/navigation/mobile-navigation'
import MessageBar from '@/components/app/navigation/message-bar'
import Logo from '@/components/app/navigation/logo'
import ThemeToggle from '@/components/app/navigation/theme-toggle'
import FeedbackButton from '@/components/app/navigation/feedback-button'
import LogoutButton from '@/components/app/navigation/logout-button'
import Skeleton from '@/components/skeleton'

type NavigationProps = {
  navChildren?: React.ReactNode
  className?: string
  isNavigationFixed: boolean
}

const sellingLive = process.env.NEXT_PUBLIC_SELLING_LIVE

const Navigation: React.FC<NavigationProps> = ({
  navChildren,
  isNavigationFixed,
}) => {
  const {data: sessionData, status: sessionStatus} = useSession()
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [hasMounted, setMounted] = React.useState(false)
  const isAuthenticated = sessionStatus === 'authenticated'
  const router = useRouter()
  const location = usePathname()
  const currentSale = useAvailableSale()
  const isMobile = useMedia('(max-width: 640px)', false)
  const isTablet = useMedia('(max-width: 920px)', false)
  const {scrollY} = useScroll()
  const messageBarTransform = useTransform(
    scrollY,
    [0, 200],
    [0, isMobile ? -70 : -40],
  )
  const dismissMessageBar = useSpring(messageBarTransform, {
    stiffness: 300,
    damping: 90,
  })

  // TODO: probably additional conditions required
  const showDiscountBar =
    currentSale?.percentageDiscount &&
    !location?.includes('modules') &&
    isAuthenticated
  const purchasedOnlyTeam = isOnlyTeamPurchaser(sessionData?.user)

  const handlerCloseMobileMenu = () => setOpen(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const Links = ({isTablet = false}) => {
    if (hasMounted) {
      return (
        <>
          {sellingLive && !isAuthenticated && isTablet ? (
            <button
              onClick={() => {
                setOpen(false)
                router.push('/?buy')
              }}
              className="mb-2 flex cursor-pointer rounded-lg bg-blue-500 px-3 py-2 text-white  transition-all duration-150 ease-in-out hover:bg-blue-600"
              data-navi-item=""
            >
              Buy Epic React
            </button>
          ) : null}
          {menuItems.map((item) => {
            return (
              <Link
                key={item.label}
                href={item.slug}
                className={twMerge(
                  cx(
                    'rounded-md px-3 py-2 text-text transition-opacity duration-150 ease-in-out hover:opacity-100 sm:opacity-75',
                    {
                      'bg-er-gray-200 sm:opacity-100': location?.startsWith(
                        item.slug,
                      ),
                    },
                  ),
                )}
                data-navi-item=""
              >
                {item.label}
              </Link>
            )
          })}
          {sellingLive && !isAuthenticated ? (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-text transition-all duration-150 ease-in-out lg:bg-blue-500 lg:text-white lg:hover:bg-blue-600"
              data-navi-item=""
            >
              Sign In
            </Link>
          ) : null}
          <div
            className={twMerge(
              cx('flex', {
                'flex-col items-start': isTablet,
                'flex-row items-center': !isTablet,
              }),
            )}
          >
            {isAuthenticated && (
              <FeedbackButton handlerCloseMenu={handlerCloseMobileMenu} />
            )}
            <ThemeToggle handlerCloseMenu={handlerCloseMobileMenu} />
            {isAuthenticated && (
              <LogoutButton handlerCloseMenu={handlerCloseMobileMenu} />
            )}
          </div>
        </>
      )
    }
    return (
      <div className="grid grid-flow-col items-center gap-5 text-xs sm:pr-2 sm:text-sm">
        {!isTablet || !isMobile ? <Skeleton className="h-6 w-16" /> : null}
        <Skeleton className="h-6 w-6" />
      </div>
    )
  }

  return hasMounted ? (
    <header
      className={cx('top-0 z-30 mx-auto w-full print:hidden', {
        fixed: isNavigationFixed,
      })}
    >
      {showDiscountBar && (
        <motion.div style={{y: dismissMessageBar}}>
          <MessageBar
            percentageDiscount={(
              Number(currentSale.percentageDiscount) * 100
            ).toString()}
          />
        </motion.div>
      )}
      <motion.nav
        style={{y: showDiscountBar ? dismissMessageBar : 0}}
        className="navigation flex w-full items-center justify-between border-b border-er-gray-100 px-2 py-2 shadow-sm"
      >
        <div className="flex flex-grow items-center">
          <Link
            href={
              isAuthenticated &&
              !isEmpty(sessionData?.user?.purchases) &&
              !purchasedOnlyTeam
                ? '/learn'
                : '/'
            }
            className="flex items-center"
          >
            <Logo isMobile={isMobile} />
          </Link>

          {/* TODO: reference: epic-react-gatsby-main/src/layouts/video-resource-page-layout.js */}
          {navChildren && (
            <motion.div
              className="ml-4 hidden text-text xl:block"
              initial={false}
              transition={{type: 'spring', mass: 0.35, velocity: 1}}
            >
              {navChildren}
            </motion.div>
          )}
        </div>

        {isTablet ? (
          <>
            <button
              onClick={() => setOpen(!isOpen)}
              aria-label={`${isOpen ? 'Close' : 'Open'} Navigation`}
              type="button"
              className="z-10 mr-2"
            >
              <motion.svg width="23" height="23" viewBox="0 0 23 23">
                <MenuPath
                  animate={{
                    d: isOpen ? 'M 3 16.5 L 17 2.5' : 'M 2 2.5 L 20 2.5',
                  }}
                  initial={{d: 'M 2 2.5 L 20 2.5'}}
                />
                <MenuPath
                  animate={{opacity: isOpen ? 0 : 1}}
                  initial={{opacity: 1}}
                  d="M 2 9.423 L 20 9.423"
                  transition={{duration: 0.1}}
                />
                <MenuPath
                  initial={{d: 'M 2 16.346 L 20 16.346'}}
                  animate={{
                    d: isOpen
                      ? 'M 3 2.5 L 17 16.346'
                      : 'M 2 16.346 L 20 16.346',
                  }}
                />
              </motion.svg>
            </button>
            {isOpen && (
              <MobileNavigation setOpen={setOpen}>
                <Links isTablet={true} />
              </MobileNavigation>
            )}
          </>
        ) : (
          <div className="grid grid-flow-col items-center gap-2 text-xs sm:text-base">
            <Links />
          </div>
        )}
      </motion.nav>
    </header>
  ) : null
}

export default Navigation

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

const MenuPath = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    transition={{
      type: 'spring',
    }}
    {...props}
  />
)

const menuItems = [
  {
    label: 'Articles',
    slug: '/articles',
  },
  {
    label: 'Tutorials',
    slug: '/tutorials',
  },
  {
    label: 'Livestreams',
    slug: '/livestreams',
  },
  {
    label: 'Podcast',
    slug: '/podcast',
  },
  {
    label: 'FAQ',
    slug: '/faq',
  },
  {
    label: 'Modules',
    slug: '/learn',
  },
]
