import * as React from 'react'
import Layout from 'components/layout'
import type {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getAllProducts} from 'server/products.server'

import LandingTemplate from 'templates/landing-template'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getToken({req})
  const ability = getCurrentAbility(sessionToken as any)
  const canViewContent = ability.can('view', 'Content')
  const hasChargesForPurchases = ability.can('view', 'Invoice')
  const hasBulkPurchase = ability.can('view', 'Team')
  const hasAvailableSeats = ability.can('invite', 'Team')

  const token = await getToken({req})
  const products = await getAllProducts()
  const commerceProps = await propsForCommerce({query, token, products})
  return {
    props: {
      commerceProps: commerceProps,
      canViewContent,
      hasChargesForPurchases,
      hasBulkPurchase,
      hasAvailableSeats,
    },
  }
}

const Home: React.FC<
  React.PropsWithChildren<{
    commerceProps: CommerceProps
    canViewContent: boolean
    hasChargesForPurchases: boolean
    hasBulkPurchase: boolean
    hasAvailableSeats: boolean
  }>
> = ({
  commerceProps,
  canViewContent,
  hasChargesForPurchases,
  hasBulkPurchase,
  hasAvailableSeats,
}) => {
  const router = useRouter()
  const {
    couponFromCode,
    purchases = [],
    userId,
    products = [],
    couponIdFromCoupon,
    defaultCoupon,
  } = commerceProps

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
      <LandingTemplate isPro={canViewContent} />
      {/* <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center grow">
        Hi! 👋
      </h1>
      <p>
        <b>canViewContent:</b> {canViewContent ? 'true' : 'false'}
      </p>
      <p>
        <b>hasChargesForPurchases:</b>{' '}
        {hasChargesForPurchases ? 'true' : 'false'}
      </p>
      <p>
        <b>hasBulkPurchase:</b> {hasBulkPurchase ? 'true' : 'false'}
      </p>
      <p>
        <b>hasAvailableSeats:</b> {hasAvailableSeats ? 'true' : 'false'}
      </p>
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null} */}
    </Layout>
  )
}

export default Home
