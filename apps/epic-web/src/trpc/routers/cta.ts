import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {
  getValidPurchases,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {getSdk, prisma} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {getProduct} from 'lib/products'

export const ctaRouter = router({
  forResource: publicProcedure
    .input(
      z.object({
        slugOrId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      let CURRENT_ACTIVE_LIVE_EVENT
      let CURRENT_ACTIVE_PROMOTION
      let HAS_PRODUCT

      const token = await getToken({req: ctx.req})
      const {getDefaultCoupon, getPurchasesForUser} = getSdk()

      const resource = await sanityClient.fetch(
        groq`*[slug.current == $slugOrId || _id == $slugOrId][0] {
        _id,
        "contributor": contributors[0].contributor->{
          _id,
          name,
          "slug": slug.current,
        },
        }`,
        {
          slugOrId: input.slugOrId,
        },
      )

      if (!resource) {
        console.debug('No resource found')
        return null
      }

      const contributor = resource.contributor

      if (!contributor) {
        console.debug('No contributor found')
        return null
      }

      const selfPacedProducts =
        await sanityClient.fetch(groq`*[_type == 'product' && type == 'self-paced' && state == 'active'] | order(_createdAt desc) {
            _id,
            title,
            type,
            productId,
            "modules": modules[]->{
                _id,
                title,
                "slug": slug.current,
                "instructor": contributors[@.role == 'instructor'][0].contributor->{
                    _id,
                    _type,
                    _updatedAt,
                    _createdAt,
                    name,
                    "slug": slug.current,
                },
            }
        }`)

      const liveProducts =
        await sanityClient.fetch(groq`*[_type == 'product' && type == 'live' && state == 'active'] | order(_createdAt desc) {
            _id,
            title,
            type,
            productId,
        }`)

      const latestLiveProduct = liveProducts?.[0]

      // CURRENT_ACTIVE_LIVE_EVENT

      if (latestLiveProduct) {
        const purchaseCount = await prisma.purchase.count({
          where: {
            productId: latestLiveProduct.productId,
            status: {
              in: ['VALID', 'RESTRICTED'],
            },
          },
        })

        const productWithQuantityAvailable = await prisma.product.findUnique({
          where: {
            id: latestLiveProduct.productId,
          },
          select: {
            quantityAvailable: true,
          },
        })

        const quantityTotal =
          productWithQuantityAvailable?.quantityAvailable || -1
        const quantityAvailable = quantityTotal - purchaseCount
        const {props: commerceProps} = await propsForCommerce({
          query: input,
          token,
          products: [{productId: latestLiveProduct.productId}] as any,
        })

        const purchasedProductIds =
          commerceProps?.purchases?.map((purchase) => purchase.productId) || []
        const hasPurchase = purchasedProductIds.includes(
          latestLiveProduct?.productId as string,
        )

        if (quantityAvailable > 0 && !hasPurchase) {
          CURRENT_ACTIVE_LIVE_EVENT = latestLiveProduct
        }
      }

      // CURRENT_ACTIVE_PROMOTION

      const products = [...selfPacedProducts, ...liveProducts]
      const defaultCoupons = await getDefaultCoupon(
        products.map((product: {productId: string}) => product.productId),
      )
      const defaultCoupon = defaultCoupons?.defaultCoupon

      if (defaultCoupon) {
        const purchases = getValidPurchases(
          await getPurchasesForUser(token?.sub),
        )
        const hasPurchasedProductFromDefaultCoupon =
          defaultCoupon &&
          purchases.some((purchase) => {
            return purchase.productId === defaultCoupon.product?.id
          })

        if (!hasPurchasedProductFromDefaultCoupon) {
          const product = await getProduct(
            defaultCoupon.restrictedToProductId as string,
          )
          CURRENT_ACTIVE_PROMOTION = product
        }
      }

      //   CONTRIBUTOR_HAS_PRODUCT

      const productsByContributor = selfPacedProducts.filter((product: any) =>
        product?.modules?.some(
          (module: any) => module?.instructor?._id === contributor._id,
        ),
      )

      if (productsByContributor.length > 0) {
        HAS_PRODUCT = productsByContributor[0]
      }

      return {
        CURRENT_ACTIVE_LIVE_EVENT,
        CURRENT_ACTIVE_PROMOTION,
        HAS_PRODUCT,
        productsByContributor: productsByContributor,
      }

      // if CURRENT_ACTIVE_LIVE_EVENT showLiveCTA() else if CURRENT_ACTIVE_PROMOTION showPromotionCta() else if HAS_PRODUCT showProductCta() else showDefaultCta()
    }),
})
