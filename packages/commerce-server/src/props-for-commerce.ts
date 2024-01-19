import {ParsedUrlQuery} from 'querystring'
import {getSdk} from '@skillrecordings/database'
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
  const productIds = products.map((product) => product.productId)
  const couponFromCode = await getCouponForCode(
    query.code as string,
    productIds,
  )
  const allowPurchase =
    Boolean(process.env.NEXT_PUBLIC_SELLING_LIVE === 'true') ||
    Boolean(query.allowPurchase)

  const {getDefaultCoupon, getPurchasesForUser} = getSdk()

  const purchases = token?.sub
    ? await getPurchasesForUser(token.sub as string)
    : false

  const couponIdFromCoupon =
    (query.coupon as string) || (couponFromCode?.isValid && couponFromCode.id)
  const defaultCoupons = !token ? await getDefaultCoupon(productIds) : null

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
        purchases: [
          ...purchases.map((purchase) =>
            convertToSerializeForNextResponse({
              ...purchase,
              totalAmount:
                // because serializer doesnt handle 0.00
                typeof purchase.totalAmount === 'object'
                  ? purchase.totalAmount.toNumber()
                  : purchase.totalAmount,
            }),
          ),
        ],
      }),
      products,
      allowPurchase,
    },
  }
}
