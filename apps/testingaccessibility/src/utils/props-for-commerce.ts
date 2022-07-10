import {IncomingMessage} from 'http'
import {NextApiRequestCookies} from 'next/dist/server/api-utils'
import {ParsedUrlQuery} from 'querystring'
import {getToken} from 'next-auth/jwt'
import {getCouponForCode} from '../server/get-coupon-for-code'
import {getActiveProducts} from '../lib/products'
import {serialize} from './prisma-next-serializer'
import {Purchase} from '@prisma/client'

export type CouponForCode = {
  isValid: boolean
  id: string
  isRedeemable: boolean
}

export type CommerceProps = {
  couponIdFromCoupon?: string
  couponFromCode?: CouponForCode
  userId?: string
  purchases?: Purchase[]
  products: SanityProduct[]
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
  const purchases = token ? (token.purchases as any) : false
  const couponFromCode = await getCouponForCode(query.code as string)
  const {products} = await getActiveProducts()

  const couponIdFromCoupon = (query.coupon as string) || couponFromCode?.id

  return {
    props: {
      ...(token?.id ? {userId: token?.id} : {}),
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(couponIdFromCoupon && {couponIdFromCoupon}),
      ...(purchases && {purchases: [...purchases.map(serialize)]}),
      products,
    },
  }
}
