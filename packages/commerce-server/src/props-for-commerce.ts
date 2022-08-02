import {IncomingMessage} from 'http'
import {ParsedUrlQuery} from 'querystring'
import {getCouponForCode} from './get-coupon-for-code'
import {serialize} from './prisma-next-serializer'
import {Purchase} from '@skillrecordings/database'
import {getSdk} from '@skillrecordings/database'

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
  req,
  query,
  products,
  token,
}: {
  req: IncomingMessage & {cookies: Partial<{[key: string]: string}>}
  query: ParsedUrlQuery
  products: SanityProduct[]
  token: {sub?: string} | null
}) {
  const couponFromCode = await getCouponForCode(query.code as string)
  const {getDefaultCoupon, getPurchasesForUser} = getSdk()

  const purchases = token?.sub ? await getPurchasesForUser(token.sub) : false

  const couponIdFromCoupon = (query.coupon as string) || couponFromCode?.id
  const defaultCoupons = !token
    ? await getDefaultCoupon(process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID)
    : null

  return {
    props: {
      ...(defaultCoupons && {
        defaultCoupon: serialize({
          expires: defaultCoupons.defaultCoupon.expires,
          percentageDiscount: defaultCoupons.defaultCoupon.percentageDiscount,
        }),
      }),
      ...(token?.sub ? {userId: token?.sub} : {}),
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(couponIdFromCoupon && {couponIdFromCoupon}),
      ...(purchases && {purchases: [...purchases.map(serialize)]}),
      products,
    },
  }
}
