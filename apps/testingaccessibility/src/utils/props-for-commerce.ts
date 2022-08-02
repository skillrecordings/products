import {ParsedUrlQuery} from 'querystring'
import {
  getCouponForCode,
  convertToSerializeForNextResponse,
} from '@skillrecordings/commerce-server'
import {Purchase, getSdk} from '@skillrecordings/database'

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
}

export type SanityProduct = {
  productId: string
  name: string
  action: string
  image: {
    url: string
    alt: string
  }
  modules: {
    title: string
    image: {
      url: string
      alt: string
    }
  }[]
  features: {
    value: string
  }[]
}

export async function propsForCommerce({
  query,
  token,
  products,
}: {
  query: ParsedUrlQuery
  token: {sub?: string} | null
  products: SanityProduct[]
}) {
  const couponFromCode = await getCouponForCode(query.code as string)

  const {getDefaultCoupon, getPurchasesForUser} = getSdk()

  const purchases = token?.sub
    ? await getPurchasesForUser(token.sub as string)
    : false

  const couponIdFromCoupon = (query.coupon as string) || couponFromCode?.id
  const defaultCoupons = !token
    ? await getDefaultCoupon(process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID)
    : null

  return {
    props: {
      ...(defaultCoupons && {
        defaultCoupon: convertToSerializeForNextResponse({
          expires: defaultCoupons.defaultCoupon.expires,
          percentageDiscount: defaultCoupons.defaultCoupon.percentageDiscount,
        }),
      }),
      ...(token?.sub ? {userId: token?.sub} : {}),
      ...(couponFromCode && {
        couponFromCode: convertToSerializeForNextResponse(couponFromCode),
      }),
      ...(couponIdFromCoupon && {couponIdFromCoupon}),
      ...(purchases && {
        purchases: [...purchases.map(convertToSerializeForNextResponse)],
      }),
      products,
    },
  }
}
