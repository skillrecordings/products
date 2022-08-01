import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {ParsedUrlQuery} from 'querystring'
import {getToken} from 'next-auth/jwt'
import {getCouponForCode} from '../server/get-coupon-for-code'
import {getActiveProducts} from '../lib/products'
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
}: {
  req: IncomingMessage & {cookies: NextApiRequestCookies}
  query: ParsedUrlQuery
}) {
  const token = await getToken({req})

  const couponFromCode = await getCouponForCode(query.code as string)
  const {products} = await getActiveProducts()
  const {getDefaultCoupon, getPurchasesForUser} = getSdk()

  const purchases = token?.id
    ? await getPurchasesForUser(token.id as string)
    : false

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
      ...(token?.id ? {userId: token?.id} : {}),
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(couponIdFromCoupon && {couponIdFromCoupon}),
      ...(purchases && {purchases: [...purchases.map(serialize)]}),
      products,
    },
  }
}
