import React from 'react'
import {Pricing} from '../components/pricing'
import {GetServerSideProps} from 'next'
import {serialize} from '../utils/prisma-next-serializer'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../utils/honeycomb-tracer'
import {Purchase, Coupon} from '@prisma/client'
import {getToken} from 'next-auth/jwt'
import {useCoupon} from '../hooks/use-coupon'
import {getCouponForCode} from '../server/get-coupon-for-code'

const Buy: React.FC<{
  couponFromCode?: {isValid: boolean; id: string}
  purchases?: Purchase[]
  userId?: string
}> = ({couponFromCode, purchases = [], userId}) => {
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  const {validCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)

  return (
    <div>
      {validCoupon ? <RedeemDialogForCoupon /> : null}
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
            <h2 className="text-3xl  font-extrabold sm:text-4xl lg:text-5xl">
              Pricing
            </h2>
            <p className="text-xl max-w-lg mx-auto">
              Learn the skills that will help you level up your career!
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <Pricing
          userId={userId}
          product={{
            name: 'Professional',
            id: 'd8b8a8a3-7d70-4445-a265-fcd04e2ef6ea',
          }}
          purchased={purchasedProductIds.includes(
            'd8b8a8a3-7d70-4445-a265-fcd04e2ef6ea',
          )}
          purchases={purchases}
        />
      </div>
    </div>
  )
}

export default Buy

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, res} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })

  const token = await getToken({req})
  const purchases = token ? (token.purchases as any) : false
  const couponFromCode = await getCouponForCode(query.code as string)

  return {
    props: {
      ...(token?.id ? {userId: token?.id} : {}),
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(purchases && {purchases: [...purchases.map(serialize)]}),
    },
  }
}
