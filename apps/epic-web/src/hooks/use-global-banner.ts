import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useScroll} from 'framer-motion'
import {useRouter} from 'next/router'
import React from 'react'
import {trpc} from 'trpc/trpc.client'

export const useActiveLiveEvent = () => {
  const router = useRouter()
  const {data: products} = trpc.products.getAllProducts.useQuery()
  const events = products?.filter((product: SanityProduct) => {
    return product.type === 'live' && product.state === 'active'
  })
  const event = events && events?.[0]

  const {data: availability} = trpc.products.getQuantityAvailableById.useQuery(
    {
      productId: event?.productId as string,
    },
    {
      enabled: Boolean(event?.productId),
      refetchInterval: 30000, // 30 seconds
    },
  )

  const {data: commerceProps} = trpc.pricing.propsForCommerce.useQuery(
    {
      productId: event?.productId as string,
    },
    {
      enabled: Boolean(event?.productId),
    },
  )

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.includes(event?.productId as string)

  // if there's an active event with availability
  // if user haven't purchased the event
  // and if user is not on the event page
  if (
    event &&
    availability &&
    availability.quantityAvailable > 0 &&
    !hasPurchase &&
    !router.asPath.includes(`/events/${event.slug}`)
  ) {
    return {
      event,
      ...availability,
    }
  }
}

export const useAvailableSale = () => {
  const {data: couponData} = trpc.pricing.defaultCoupon.useQuery()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
    })

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchase = purchasedProductIds.includes(couponData?.product?.id)
  const {data: product} = trpc.epicProducts.getProduct.useQuery(
    {productId: couponData?.restrictedToProductId as string},
    {
      enabled: Boolean(couponData?.restrictedToProductId),
    },
  )

  if (!couponData) return null
  if (hasPurchase) return null

  return {...couponData, product}
}

export const useGlobalBanner = () => {
  const activeSale = useAvailableSale()
  const activeEvent = useActiveLiveEvent()

  const {scrollYProgress} = useScroll()
  const [scrollDirection, setScrollDirection] = React.useState<
    'up' | 'down' | null
  >(null)
  const [lastScrollYProgress, setLastScrollYProgress] = React.useState(0)

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      'change',
      (currentScrollYProgress) => {
        setScrollDirection(
          currentScrollYProgress > lastScrollYProgress ? 'down' : 'up',
        )
        setLastScrollYProgress(currentScrollYProgress)
      },
    )

    return () => unsubscribe()
  }, [lastScrollYProgress, scrollYProgress])

  return {
    isShowingSiteBanner: Boolean(activeSale || activeEvent),
    bannerHeight: 32,
    scrollDirection,
  }
}
