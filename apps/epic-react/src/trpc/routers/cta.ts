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
import {ProductSchema, getProduct} from '@/lib/products'
import {subDays} from 'date-fns'

const ActivePromotionSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  createdAt: z.date(),
  expires: z.date().nullable(),
  maxUses: z.number(),
  default: z.boolean(),
  merchantCouponId: z.string().nullable(),
  status: z.number(),
  usedCount: z.number(),
  percentageDiscount: z.string().or(z.coerce.number()),
  restrictedToProductId: z.string().nullable(),
  bulkPurchaseId: z.string().nullable(),
  product: ProductSchema.nullable(),
})

export type CTA_ActivePromotion = z.infer<typeof ActivePromotionSchema>

const LiveProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  type: z.literal('live'),
  productId: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z
    .object({
      url: z.string(),
    })
    .optional()
    .nullable(),
  event: z
    .object({
      title: z.string(),
      startsAt: z.string().optional().nullable(),
      slug: z.string(),
    })
    .optional()
    .nullable(),
})

const ActiveLiveEventSchema = z.object({
  quantityAvailable: z.number(),
  product: LiveProductSchema,
})

export type CTA_ActiveLiveEvent = z.infer<typeof ActiveLiveEventSchema>

const ContributorProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  type: z.literal('self-paced'),
  productId: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z
    .object({
      url: z.string(),
    })
    .optional()
    .nullable(),
  modules: z.array(
    z.object({
      totalLessons: z.number().optional().nullable(),
      _id: z.string(),
      title: z.string(),
      slug: z.object({
        current: z.string(),
      }),
      image: z
        .object({
          url: z.string(),
        })
        .optional()
        .nullable(),
      description: z.string().optional().nullable(),
      instructor: z
        .object({
          _id: z.string(),
          _type: z.string(),
          _updatedAt: z.string(),
          _createdAt: z.string(),
          name: z.string(),
          slug: z.string(),
          picture: z
            .object({
              url: z.string(),
            })
            .optional()
            .nullable(),
        })
        .nullable()
        .optional(),
    }),
  ),
})

export type CTA_ContributorProduct = z.infer<typeof ContributorProductSchema>

export const ctaRouter = router({
  forResource: publicProcedure
    .input(
      z
        .object({
          slugOrId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ctx, input}) => {
      let CURRENT_ACTIVE_LIVE_EVENT
      let CURRENT_ACTIVE_PROMOTION
      let HAS_PRODUCT

      const token = await getToken({req: ctx.req})
      const {getDefaultCoupon, getPurchasesForUser} = getSdk()

      const resource =
        input?.slugOrId &&
        (await sanityClient.fetch(
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
        ))

      if (!resource) {
        // console.debug('No resource found')
      }

      const contributor = resource?.contributor

      if (!contributor) {
        // console.debug('No contributor found')
      }

      const selfPacedProducts =
        await sanityClient.fetch(groq`*[_type == 'product' && type == 'self-paced' && state == 'active'] | order(_createdAt desc) {
            _id,
            title,
            type,
            productId,
            image {url},
            "slug": slug.current,
            description,
            "modules": modules[]->{
                _id,
                title,
                slug,
                "image": image.asset->{url},
                description,
                "instructor": contributors[@.role == 'instructor'][0].contributor->{
                    _id,
                    _type,
                    _updatedAt,
                    _createdAt,
                    name,
                    "slug": slug.current,
                    picture {
                        "url": asset->url,
                        alt
                    },
                },
                "totalLessons": count(resources[@->._type == 'section']->resources[@->._type in ['exercise', 'explainer', 'lesson']])
            }
        }`)

      const liveProducts =
        await sanityClient.fetch(groq`*[_type == 'product' && type == 'live' && state == 'active'] | order(_createdAt desc) {
            _id,
            title,
            type,
            productId,
            "slug": slug.current,
            description,
            image {url},
            'event': modules[@->._type == 'event'][0]->{
              title,
              "startsAt": select(defined(startsAt) => startsAt, defined(events[0].startsAt) => events[0].startsAt),
              "slug": slug.current
            }
        }`)

      const parsedLiveProducts = z.array(LiveProductSchema).parse(liveProducts)

      const activeLiveProducts = parsedLiveProducts.filter((product) => {
        const hasEnded =
          product.event?.startsAt &&
          subDays(new Date(product.event.startsAt), 1) < new Date()

        return !hasEnded && product
      })

      if (activeLiveProducts?.length > 0) {
        const parsedLatestLiveProduct = LiveProductSchema.safeParse(
          activeLiveProducts[0],
        )

        // CURRENT_ACTIVE_LIVE_EVENT

        if (!parsedLatestLiveProduct.success) {
          console.error('Error parsing latest live product')
          console.error(parsedLatestLiveProduct.error)
        } else {
          const latestLiveProduct = parsedLatestLiveProduct.data

          if (latestLiveProduct) {
            const purchaseCount = await prisma.purchase.count({
              where: {
                productId: latestLiveProduct.productId,
                status: {
                  in: ['VALID', 'RESTRICTED'],
                },
              },
            })

            const productWithQuantityAvailable =
              await prisma.product.findUnique({
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
              query: ctx.req.query,
              token,
              products: [{productId: latestLiveProduct.productId}] as any,
            })

            const purchasedProductIds =
              commerceProps?.purchases?.map((purchase) => purchase.productId) ||
              []
            const hasPurchase = purchasedProductIds.includes(
              latestLiveProduct?.productId as string,
            )

            if (quantityAvailable > 0 && !hasPurchase) {
              const currentActiveLiveEvent = ActiveLiveEventSchema.safeParse({
                quantityAvailable,
                product: latestLiveProduct,
              })

              if (!currentActiveLiveEvent.success) {
                console.error('Error parsing current active live event')
                console.error(currentActiveLiveEvent.error)
              } else {
                CURRENT_ACTIVE_LIVE_EVENT = currentActiveLiveEvent.data
              }
            }
          }
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
          const activePromotion = ActivePromotionSchema.safeParse({
            ...defaultCoupon,
            product,
          })

          if (!activePromotion.success) {
            console.error('Error parsing active promotion')
            console.error(activePromotion.error)
          } else {
            CURRENT_ACTIVE_PROMOTION = activePromotion.data
          }
        }
      }

      //   CONTRIBUTOR_HAS_PRODUCT

      if (contributor) {
        const productsByContributor = selfPacedProducts.filter((product: any) =>
          product?.modules?.some(
            (module: any) => module?.instructor?._id === contributor._id,
          ),
        )
        let contributorProducts
        if (productsByContributor.length > 0) {
          // get random product, this could be improved by intergrating tags, or similar
          const product =
            productsByContributor[
              Math.floor(Math.random() * productsByContributor.length)
            ]
          const parsedProduct = ContributorProductSchema.safeParse(product)

          if (!parsedProduct.success) {
            console.error('Error parsing contributor product')
            console.error(parsedProduct.error)
          } else {
            HAS_PRODUCT = parsedProduct.data
          }

          const parsedProductsByContributor = z
            .array(ContributorProductSchema)
            .safeParse(productsByContributor)

          if (!parsedProductsByContributor.success) {
            console.error('Error parsing products by contributor')
            console.error(parsedProductsByContributor.error)
          } else {
            contributorProducts = parsedProductsByContributor.data
          }
        }
      }

      return {
        CURRENT_ACTIVE_LIVE_EVENT,
        CURRENT_ACTIVE_PROMOTION,
        HAS_PRODUCT,
      }
    }),
})
