const DEBUG_MODE = false

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
  percentageDiscount: z.string().or(z.number()),
  restrictedToProductId: z.string().nullable(),
  bulkPurchaseId: z.string().nullable(),
  product: ProductSchema.nullable(),
})

export type CTA_ActivePromotion = z.infer<typeof ActivePromotionSchema>

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
  activePromotion: publicProcedure.query(async ({ctx}) => {
    let CURRENT_ACTIVE_PROMOTION

    const token = await getToken({req: ctx.req})
    const {getDefaultCoupon, getPurchasesForUser} = getSdk()

    const selfPacedProducts =
      await sanityClient.fetch(groq`*[_type == 'product' && state == 'active'] | order(_createdAt desc) {
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

    // CURRENT_ACTIVE_PROMOTION

    const products = [...selfPacedProducts]
    const defaultCoupons = await getDefaultCoupon(
      products.map((product: {productId: string}) => product.productId),
    )
    const defaultCoupon = defaultCoupons?.defaultCoupon
    if (DEBUG_MODE) {
      return {
        id: 'dummy',
        code: 'dummy',
        createdAt: new Date(),
        expires: '2024-08-21T00:00:00.000Z',
        maxUses: -1,
        default: true,
        merchantCouponId: 'dummy',
        status: 0,
        usedCount: 0,
        percentageDiscount: '0.2',
        restrictedToProductId: 'dummy',
        bulkPurchaseId: 'dummy',
        product: {
          slug: 'complete-volume',
          title: 'Complete Volume',
          image: {
            url: 'https://res.cloudinary.com/total-typescript/image/upload/v1676015688/core-volume_2x_wt7jnc.png',
          },
          modules: [
            {
              title: 'TypeScript Pro Essentials',
            },
            {
              title: 'TypeScript Pro Essentials',
            },
          ],
        },
      } as unknown as CTA_ActivePromotion
    } else {
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

      return CURRENT_ACTIVE_PROMOTION
    }
  }),
})
