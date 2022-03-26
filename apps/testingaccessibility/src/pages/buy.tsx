import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import {getToken, JWT} from 'next-auth/jwt'
import jwt from 'jsonwebtoken'
import {getAdminSDK} from '../lib/api'
import {isBefore} from 'date-fns'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // you have to use the same decoder you use in the auth routes
    // if you want this to return a value or set `raw: true`
    decode: async (params) => {
      if (!params.token) return null

      const verify = jwt.verify(params.token, params.secret)
      return verify as JWT
    },
  })

  const {code} = query
  let couponFromCode
  let couponRedeemable = false

  if (code) {
    const {getCoupon} = getAdminSDK()
    const {coupons_by_pk: loadedCoupon} = await getCoupon({id: code})
    couponFromCode = loadedCoupon
  }

  if (couponFromCode) {
    const isUsedUp =
      couponFromCode.max_uses > 0
        ? couponFromCode.used_count > couponFromCode.max_uses
        : false

    const isExpired = couponFromCode.expires
      ? isBefore(new Date(couponFromCode.expires), new Date())
      : false

    couponFromCode = {...couponFromCode, isExpired, isUsedUp}
  }

  return {
    props: {
      token,
      couponFromCode,
    },
  }
}

const Course: React.FC<{
  couponFromCode: string
  token: string
  couponRedeemable: boolean
}> = ({couponFromCode, token, couponRedeemable}) => {
  console.log({couponFromCode, token})
  return (
    <div>
      <Pricing />
    </div>
  )
}

export default Course
