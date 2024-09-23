import React from 'react'
import {useScroll} from 'framer-motion'
import {trpc} from '@/trpc/trpc.client'
import {type CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {ActivePromotion} from '@/trpc/routers/cta'

export const useGlobalBanner = (
  enabled: boolean = true,
  activePromotion?: ActivePromotion | null,
) => {
  const {data: cta, status} = trpc.cta.forResource.useQuery(undefined, {
    initialData: {
      CURRENT_ACTIVE_PROMOTION: activePromotion,
      CURRENT_ACTIVE_LIVE_EVENT: undefined,
      HAS_PRODUCT: undefined,
    },
  })
  const activeSale = enabled && cta?.CURRENT_ACTIVE_PROMOTION
  const activeEvent = enabled && cta?.CURRENT_ACTIVE_LIVE_EVENT
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
