import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import RedeemDialog from '../components/redeem-dialog'
import {validateCoupon} from '../utils/validate-coupon'
import {getSdk} from '../lib/prisma-api'
import {serialize} from '../utils/prisma-next-serializer'

const Course: React.FC<{
  couponFromCode: any
}> = ({couponFromCode}) => {
  const [validCoupon, setValidCoupon] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setValidCoupon(couponFromCode && couponFromCode.isValid)
    }, 0)
  }, [])

  return (
    <div>
      {validCoupon && (
        <RedeemDialog
          open={couponFromCode.isValid}
          couponId={couponFromCode.id}
        />
      )}
      <Pricing />
    </div>
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {getCoupon} = getSdk()

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
    },
  }
}
