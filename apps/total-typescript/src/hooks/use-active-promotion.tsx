import type {CTA_ActivePromotion} from '@/trpc/routers/cta'
import {trpc} from '@/trpc/trpc.client'
import cookieUtil from '@skillrecordings/skill-lesson/utils/cookies'
import {useRouter} from 'next/router'
import React from 'react'

type PromotionCookie =
  | {
      state: number
      dismissed_on: string
    }
  | undefined

type ActivePromotionContextType = {
  activePromotion: CTA_ActivePromotion | null
  buyUrl: string
  getCookie: () => PromotionCookie
  setCookie: (values: PromotionCookie) => void
}

const defaultContextValue = {
  activePromotion: null,
  buyUrl: '',
  getCookie: () => undefined,
  setCookie: () => {},
}

const ActivePromotionContext =
  React.createContext<ActivePromotionContextType>(defaultContextValue)

export const ActivePromotionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {data: activePromotion, status: activePromotionStatus} =
    trpc.cta.activePromotion.useQuery(undefined, {
      retryOnMount: false,
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    })

  const router = useRouter()
  const product = activePromotion?.product
  if (!product)
    return (
      <ActivePromotionContext.Provider value={defaultContextValue}>
        {children}
      </ActivePromotionContext.Provider>
    )

  if (
    activePromotionStatus === 'loading' ||
    activePromotionStatus === 'error' ||
    !activePromotion
  ) {
    return (
      <ActivePromotionContext.Provider value={defaultContextValue}>
        {children}
      </ActivePromotionContext.Provider>
    )
  }
  const COOKIE_NAME = activePromotion.expires
    ? `promo_${activePromotion.expires}`
    : `promo_${activePromotion.createdAt}`
  const isBundle = product?.modules && product.modules.length > 1
  const buyUrl = '/#buy' // isBundle ? '/#buy' : '/workshops' + product.slug
  const isOnProductPage = router.asPath.includes(buyUrl)

  if (isOnProductPage && !isBundle)
    return (
      <ActivePromotionContext.Provider value={defaultContextValue}>
        {children}
      </ActivePromotionContext.Provider>
    )

  function getCookie() {
    return cookieUtil.get(COOKIE_NAME)
  }

  function setCookie(values: PromotionCookie) {
    cookieUtil.set(COOKIE_NAME, values, {
      expires: activePromotion?.expires && new Date(activePromotion.expires),
    })
  }

  const contextValue = {
    activePromotion,
    buyUrl,
    cookieName: COOKIE_NAME,
    setCookie,
    getCookie,
  }

  return (
    <ActivePromotionContext.Provider value={contextValue}>
      {children}
    </ActivePromotionContext.Provider>
  )
}

export const useActivePromotion = () => {
  const context = React.use(ActivePromotionContext)
  if (context === null) {
    throw new Error(
      'useActivePromotion must be used within a ActivePromotionProvider',
    )
  }
  return context
}
