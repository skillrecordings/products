import * as React from 'react'
import Layout from 'components/layout'
import type {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'

import {getAllProducts} from 'server/products.server'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const products = await getAllProducts()
  return await propsForCommerce({query, token, products})
}

const Home: React.FC<React.PropsWithChildren<CommerceProps>> = (props) => {
  const router = useRouter()
  const {
    couponFromCode,
    purchases = [],
    userId,
    products = [],
    couponIdFromCoupon,
    defaultCoupon,
  } = props

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

  const {redeemableCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)

  return (
    <Layout>
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center grow">
        Hi! 👋
      </h1>
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
    </Layout>
  )
}

export default Home
