import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import RedeemDialog from '../components/redeem-dialog'
import {validateCoupon} from '../utils/validate-coupon'
import {getSdk} from '../lib/prisma-api'

const Course: React.FC<{
  couponFromCode: any
  activeSaleCoupon: any
}> = ({couponFromCode, activeSaleCoupon}) => {
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
      <Pricing activeSaleCoupon={activeSaleCoupon} />
    </div>
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {getCoupon} = getSdk()
  const activeSaleCoupon = await getCoupon({
    where: {
      default: true,
      expires: {
        gte: new Date(),
      },
    },
  })

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
      ...(couponFromCode && {couponFromCode}),
      ...(activeSaleCoupon && {activeSaleCoupon}),
    },
  }
}
