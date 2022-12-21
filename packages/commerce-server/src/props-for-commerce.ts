import {ParsedUrlQuery} from 'querystring'
import {Purchase, getSdk} from '@skillrecordings/database'
import {convertToSerializeForNextResponse} from './prisma-next-serializer'
import {getCouponForCode} from './get-coupon-for-code'
import type {SanityProduct} from './@types'

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
  const allowPurchase = Boolean(query.allowPurchase)

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
      allowPurchase,
    },
  }
}
