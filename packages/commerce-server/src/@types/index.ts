import {
  Purchase,
  MerchantCoupon,
  Product,
  Price,
  Coupon,
} from '@skillrecordings/database'
import type {PortableTextBlock} from '@portabletext/types'

type MerchantCouponWithCountry = MerchantCoupon & {country?: string | undefined}

export type MinimalMerchantCoupon = Omit<
  MerchantCouponWithCountry,
  'identifier' | 'merchantAccountId'
>

type ProductWithPrices = Product & {prices?: Price[]}

export type FormattedPrice = {
  id: string
  quantity: number
  unitPrice: number
  fullPrice: number
  fixedDiscountForUpgrade: number
  calculatedPrice: number
  availableCoupons: Array<
    Omit<MerchantCouponWithCountry, 'identifier'> | undefined
  >
  appliedMerchantCoupon?: MinimalMerchantCoupon
  upgradeFromPurchaseId?: string
  upgradeFromPurchase?: Purchase
  defaultCoupon?: {
    expires?: string
    percentageDiscount: string
  }
  upgradedProduct?: ProductWithPrices | null
  bulk: boolean
  usedCouponId?: string
}

export type CouponForCode = Coupon & {
  isValid: boolean
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
  state?: 'draft' | 'active' | 'unavailable'
  summary?: PortableTextBlock
  modules: SanityProductModule[]
  upgradableTo?: SanityProduct
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

export type SanityProductModule = {
  slug: string
  moduleType: 'workshop' | 'playlist' | 'bonus'
  title: string
  state?: 'draft' | 'published'
  description?: string
  image: {
    url: string
    alt: string
  }
  sections?: {
    _id: string
    title: string
    slug: string
    lessons?: {
      _type?: 'lesson' | 'exercise' | 'solution' | 'interview'
      title: string
      state?: 'draft' | 'published'
      slug: string
      image: {
        url: string
        alt: string
      }
    }[]
  }[]
  lessons?: {
    _type?: 'lesson' | 'exercise' | 'solution' | 'interview'
    title: string
    state?: 'draft' | 'published'
    slug: string
    image: {
      url: string
      alt: string
    }
  }[]
}
