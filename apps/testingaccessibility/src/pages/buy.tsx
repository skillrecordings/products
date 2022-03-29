import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import {getAdminSDK} from '../lib/api'
import {isBefore} from 'date-fns'
import RedeemDialog from '../components/redeem-dialog'
import {validateCoupon} from '../utils/validate-coupon'

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
  const {getActiveDefaultCoupons} = getAdminSDK()

  const {coupons: defaultCoupons} = await getActiveDefaultCoupons({
    now: new Date(),
  })
  let activeSaleCoupon

  if (defaultCoupons?.length > 0) {
    activeSaleCoupon = defaultCoupons[0]
  }

  const {code} = query
  let couponFromCode

  if (code) {
    const {getCoupon} = getAdminSDK()
    const {coupons_by_pk: loadedCoupon} = await getCoupon({id: code})
    couponFromCode = loadedCoupon
  }

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
