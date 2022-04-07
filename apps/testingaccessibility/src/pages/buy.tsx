import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import RedeemDialog from '../components/redeem-dialog'
import {validateCoupon} from '../utils/validate-coupon'
import {getSdk} from '../lib/prisma-api'
import {serialize} from '../utils/prisma-next-serializer'
import {setupHttpTracing} from '@skillrecordings/tracing'
import {tracer} from '../utils/honeycomb-tracer'
import {getDecodedToken} from '../utils/get-decoded-token'
import {Purchase, Coupon} from '@prisma/client'

const Buy: React.FC<{
  couponFromCode?: {isValid: boolean; id: string}
  purchases?: Purchase[]
}> = ({couponFromCode, purchases = []}) => {
  const [validCoupon, setValidCoupon] = React.useState(false)
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)

  React.useEffect(() => {
    setTimeout(() => {
      setValidCoupon(Boolean(couponFromCode && couponFromCode.isValid))
    }, 0)
  }, [])

  return (
    <div>
      {validCoupon && couponFromCode && (
        <RedeemDialog
          open={couponFromCode.isValid}
          couponId={couponFromCode.id}
        />
      )}
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
          product={{
            name: 'Foundation',
            id: 'c5b03b0d-9971-4981-8ad2-cae7ebb75bf4',
          }}
          purchased={purchasedProductIds.includes(
            'c5b03b0d-9971-4981-8ad2-cae7ebb75bf4',
          )}
          purchases={purchases}
        />
        <Pricing
          product={{
            name: 'Core',
            id: '3db63974-0863-4797-a095-1c6a901144e4',
          }}
          purchased={purchasedProductIds.includes(
            '3db63974-0863-4797-a095-1c6a901144e4',
          )}
          purchases={purchases}
        />
        <Pricing
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  setupHttpTracing({name: '/buy', tracer, req, res})
  const {getCoupon, getPurchasesForUser} = getSdk()
  const token = await getDecodedToken(req)

  const purchases = token
    ? await getPurchasesForUser(token.sub as string)
    : false

  const {code} = query

  let couponFromCode =
    code && (await getCoupon({where: {id: query.code as string}}))

  if (couponFromCode) {
    couponFromCode = {
      ...couponFromCode,
      ...validateCoupon(couponFromCode),
    }
  }

  return {
    props: {
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
      ...(purchases && {purchases}),
    },
  }
}
