import React from 'react'
import {useScroll} from 'framer-motion'
import {trpc} from '@/trpc/trpc.client'

export const useGlobalBanner = (enabled: boolean = true) => {
  const {data: cta, status} = trpc.cta.forResource.useQuery()
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
