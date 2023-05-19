import * as React from 'react'
import Layout from 'components/layout'
import type {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {SanityDocument} from '@sanity/client'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getAllProducts, getActiveProduct} from 'server/products.server'
import {getAllPlaylists} from 'lib/playlists'
import {getAllTestimonials} from 'lib/testimonials'
import {getAllFaqs} from 'lib/faqs'
import {getAllInterviews} from 'lib/interviews'
import type {TestimonialProps, FaqProps, InterviewProps} from '@types'

import LandingTemplate from 'templates/landing-template'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getToken({req})

  const testimonials = await getAllTestimonials()
  const faqs = await getAllFaqs()
  const playlists = await getAllPlaylists()
  const interviews = await getAllInterviews()

  const ability = getCurrentAbility(sessionToken as any)
  const canViewContent = ability.can('view', 'Content')
  const hasChargesForPurchases = ability.can('view', 'Invoice')
  const hasBulkPurchase = ability.can('view', 'Team')
  const hasAvailableSeats = ability.can('invite', 'Team')

  const token = await getToken({req})
  const products = await getAllProducts()
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })
  const purchasedProductsIds =
    commerceProps.purchases?.map((purchase) => purchase.productId) || []

  const modulesAmount: {productId: string; modulesAmount: number}[] =
    await Promise.all(
      purchasedProductsIds.map(
        async (
          productId,
        ): Promise<{productId: string; modulesAmount: number}> => {
          const product = await getActiveProduct(productId)
          return {productId: productId, modulesAmount: product?.modules?.length}
        },
      ),
    )
  const mostValuedProductId = modulesAmount.sort((a, b) => {
    return b.modulesAmount - a.modulesAmount
  })[0]?.productId
  const mostValuedProduct = mostValuedProductId
    ? await getActiveProduct(mostValuedProductId)
    : null
  return {
    props: {
      commerceProps,
      playlists,
      testimonials,
      faqs,
      interviews,
      mostValuedProduct,
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
    playlists: SanityDocument[]
    testimonials: TestimonialProps[]
    faqs: FaqProps[]
    interviews: InterviewProps[]
    mostValuedProduct: SanityProduct
    canViewContent: boolean
    hasChargesForPurchases: boolean
    hasBulkPurchase: boolean
    hasAvailableSeats: boolean
  }>
> = ({
  commerceProps,
  playlists,
  testimonials,
  faqs,
  interviews,
  mostValuedProduct,
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

  const proTestingPurchased =
    canViewContent &&
    !isEmpty(
      purchases.filter(
        (item) => item.productId === 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5',
      ),
    )

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
      <LandingTemplate
        canViewContent={canViewContent}
        playlists={playlists}
        testimonials={testimonials}
        faqs={faqs}
        interviews={interviews}
        proTestingPurchased={proTestingPurchased}
        commerceProps={commerceProps}
        mostValuedProduct={mostValuedProduct}
      />
      {/* {redeemableCoupon ? <RedeemDialogForCoupon /> : null} */}
    </Layout>
  )
}

export default Home
