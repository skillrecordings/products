import * as React from 'react'
import Layout from '@/components/layout'
import type {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {isEmpty} from 'lodash'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {type SanityDocument} from '@sanity/client'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getAllProducts, getActiveProduct} from '@/server/products.server'
import {getAllPlaylists} from '@/lib/playlists'
import {getAllTestimonials} from '@/lib/testimonials'
import {getAllFaqs} from '@/lib/faqs'
import {getAllInterviews} from '@/lib/interviews'
import type {TestimonialProps, FaqProps, InterviewProps} from '@/@types/'

import LandingTemplate from '@/templates/landing-template'

const testingJavaScriptProductIds = [
  'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', // Basic
  'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', // Standard
  'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', // Pro
]

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getToken({req})

  const testimonials = await getAllTestimonials()
  const faqs = await getAllFaqs()
  const playlists = await getAllPlaylists()
  const interviews = await getAllInterviews()

  const products = await getAllProducts()

  const ability = getCurrentAbility(sessionToken as any)

  const hasChargesForPurchases = ability.can('view', 'Invoice')

  const {props: commerceProps} = await propsForCommerce({
    query,
    token: sessionToken,
    products,
  })
  const purchasedProductsIds =
    commerceProps.purchases
      ?.map((purchase) => purchase.productId)
      ?.filter((productId) =>
        testingJavaScriptProductIds.includes(productId),
      ) || []

  const hasBoughtTestingJavaScript = purchasedProductsIds.length > 0

  const canViewContent =
    ability.can('view', 'Content') && hasBoughtTestingJavaScript
  const hasBulkPurchase =
    ability.can('view', 'Team') && hasBoughtTestingJavaScript
  const hasAvailableSeats =
    ability.can('invite', 'Team') && hasBoughtTestingJavaScript

  // `mostValuedProduct` is the product among the user's purchases that has
  // the most modules. E.g. if they original purchased the Standard and have
  // since upgraded to Pro, then we want to look up 'Pro' as the tier of
  // Testing JavaScript to pass around.
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
  } = commerceProps

  const proTestingPurchased =
    canViewContent &&
    !isEmpty(
      purchases.filter(
        (item) => item.productId === process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
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

  const restrictedToProduct = couponFromCode?.restrictedToProductId
    ? products.find(
        (product) => product.productId === couponFromCode.restrictedToProductId,
      )
    : undefined

  const productMetadata = restrictedToProduct
    ? {
        ...restrictedToProduct,
        id: restrictedToProduct.productId,
        image: {
          ...restrictedToProduct.image,
          width: 132,
          height: 112,
        },
      }
    : undefined

  return (
    <Layout>
      <main>
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
      </main>
    </Layout>
  )
}

export default Home
