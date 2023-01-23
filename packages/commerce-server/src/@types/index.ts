import {Purchase} from '@skillrecordings/database'

export type FormattedPrice = {
  id: string
  quantity: number
  unitPrice: number
  calculatedPrice: number
  availableCoupons: any[]
  appliedMerchantCoupon?: any
  upgradeFromPurchaseId?: string
  defaultCoupon?: {
    expires?: string
    percentageDiscount: string
  }
}

export type CouponForCode = {
  isValid: boolean
  id: string
  isRedeemable: boolean
}

export type DefaultCoupon = {percentageDiscount: number; expires: string}

export type CommerceProps = {
  couponIdFromCoupon?: string
  couponFromCode?: CouponForCode
  userId?: string
  purchases?: Purchase[]
  products: SanityProduct[]
  defaultCoupon?: DefaultCoupon
  allowPurchase?: boolean
}

export type SanityProduct = {
  productId: string
  name: string
  title?: string
  action: string
  description?: string
  slug?: string
  image: {
    url: string
    alt: string
  }
  modules: {
    title: string
    state?: 'draft' | 'published'
    image: {
      url: string
      alt: string
    }
  }[]
  lessons?: {
    title: string
    state?: 'draft' | 'published'
    image: {
      url: string
      alt: string
    }
  }[]
  features: {
    value: string
  }[]
  instructor?: {
    name: string
    image: string
  }
}
